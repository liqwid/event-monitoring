import { getRepository, Repository } from "typeorm";
import { initDb } from "db/init";
import { EventModel, EVENTS_ENDPOINT } from "models/events";
import client from "./testRestClient";

const stubEvent = { time: Math.round(Date.now() / 1000), value: 1.123, sensorId: 1 };
let repository: Repository<EventModel>;
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
});
