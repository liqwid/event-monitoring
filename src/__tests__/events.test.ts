import { getRepository, Repository } from "typeorm";
import { initDb } from "db/init";
import { EventModel, EVENTS_ENDPOINT } from "models/events";
import client from "./testRestClient";

const stubEvent = { time: Math.round(Date.now() / 1000), value: 1.123, sensorId: 1 };
let repository: Repository<EventModel>;

const stubEvents = Array(30)
  .fill(undefined)
  .map((_, index) => ({
    time: Math.round(Date.now() / 1000) + index,
    value: 1.123,
    sensorId: index + 1,
  }));

beforeAll(async () => {
  await initDb();
  repository = await getRepository(EventModel);
  await repository.clear();
});

describe("Events service", () => {
  describe("Events Ingestion", () => {
    it("should create event upon sending post", async () => {
      const { status, data } = await client.post(EVENTS_ENDPOINT, stubEvent);

      expect(status).toBe(200);

      const { id } = data;
      const dbEntry = await repository.findOne({ id });

      expect(dbEntry).toEqual({ ...stubEvent, id });

      await repository.delete({ id });
    });

    it("should return 400 error if no sensorId was sent", async () => {
      const { sensorId, ...withoutSensorId } = stubEvent;
      await client
        .post(EVENTS_ENDPOINT, withoutSensorId)
        .catch(({ response: { status, data } }) => {
          const { errors } = data;
          const { property, value } = errors[0];
          expect(status).toBe(400);
          expect(property).toBe("sensorId");
          expect(value).toBe(undefined);
        });
    });

    it("should return 400 error if no time was sent", async () => {
      const { time, ...withoutTime } = stubEvent;
      await client.post(EVENTS_ENDPOINT, withoutTime).catch(({ response: { status, data } }) => {
        const { errors } = data;
        const { property, value } = errors[0];
        expect(status).toBe(400);
        expect(property).toBe("time");
        expect(value).toBe(undefined);
      });
    });

    it("should return 409 error if existing entry was sent", async () => {
      await client.post(EVENTS_ENDPOINT, stubEvent);

      await client.post(EVENTS_ENDPOINT, stubEvent).catch(({ response: { status } }) => {
        expect(status).toBe(409);
      });
    });
  });

  describe("Events querying", () => {
    beforeAll(async () => {
      await repository.clear();
      await Promise.all(stubEvents.map(event => client.post(EVENTS_ENDPOINT, event)));
    });

    it("should return all events upon get", async () => {
      const { status, data } = await client.get(EVENTS_ENDPOINT);

      expect(status).toBe(200);
      stubEvents.forEach((event, index) => {
        expect(data[index]).toMatchObject(event);
      });
    });

    it("should filter events by since and until", async () => {
      const from = 10;
      const to = 20;
      const since = stubEvents[from].time;
      const until = stubEvents[to].time;
      const { status, data } = await client.get(EVENTS_ENDPOINT, { params: { since, until } });

      expect(status).toBe(200);
      stubEvents.slice(from, to).forEach((event, index) => {
        expect(data[index]).toMatchObject(event);
      });
    });

    it("should filter events by since and until", async () => {
      const index = 5;
      const sensorId = stubEvents[index].sensorId;
      const { status, data } = await client.get(EVENTS_ENDPOINT, { params: { sensorId } });

      expect(status).toBe(200);
      stubEvents.slice(index, index + 1).forEach((event, index) => {
        expect(data[index]).toMatchObject(event);
      });
    });

    it("should validate sensorId type", async () => {
      const sensorId = "string";
      await client
        .get(EVENTS_ENDPOINT, { params: { sensorId } })
        .catch(({ response: { status, data } }) => {
          expect(status).toBe(400);
        });
    });

    it("should validate since type", async () => {
      const since = "string";
      await client
        .get(EVENTS_ENDPOINT, { params: { since } })
        .catch(({ response: { status, data } }) => {
          expect(status).toBe(400);
        });
    });

    it("should validate until type", async () => {
      const until = "string";
      await client
        .get(EVENTS_ENDPOINT, { params: { until } })
        .catch(({ response: { status, data } }) => {
          expect(status).toBe(400);
        });
    });
  });
});
