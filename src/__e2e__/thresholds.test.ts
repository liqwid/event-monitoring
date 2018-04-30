import { getRepository, Repository } from "typeorm";
import { initDb } from "db/init";
import {
  ThresholdModel,
  THRESHOLDS_ENDPOINT,
  EMAIL_NOTIFICATION_TYPE,
  SMS_NOTIFICATION_TYPE,
} from "models/thresholds";
import client from "./testRestClient";

const stubThreshold = {
  notificationType: EMAIL_NOTIFICATION_TYPE,
  value: 1.123,
  sensorId: 1,
  email: "test@mail.com",
  phone: null,
};
let repository: Repository<ThresholdModel>;

beforeAll(async () => {
  await initDb();
  repository = await getRepository(ThresholdModel);
  await repository.clear();
});

describe("Tresholds service", () => {
  let thresholdId: string;
  it("should create Threshold upon sending post", async () => {
    const { status, data } = await client.post(THRESHOLDS_ENDPOINT, stubThreshold);

    expect(status).toBe(200);

    const { id } = data;
    const dbEntry = await repository.findOne({ id });

    expect(dbEntry).toEqual({ ...stubThreshold, id });

    thresholdId = id;
  });

  it("should get Threshold upon sending get", async () => {
    const { status, data } = await client.get(`${THRESHOLDS_ENDPOINT}/${thresholdId}`);

    expect(status).toBe(200);

    const { id } = data;
    const dbEntry = await repository.findOne({ id });

    expect(dbEntry).toEqual({ ...stubThreshold, id });
  });

  it("should update Threshold upon sending put", async () => {
    const thresholdUpdate = {
      notificationType: EMAIL_NOTIFICATION_TYPE,
      value: 2,
      sensorId: 4,
      email: "test1@mail.com",
      phone: "null",
    };
    const { status, data } = await client.put(
      `${THRESHOLDS_ENDPOINT}/${thresholdId}`,
      thresholdUpdate
    );

    expect(status).toBe(200);

    const { id } = data;
    const dbEntry = await repository.findOne({ id });

    expect(dbEntry).toEqual({ ...thresholdUpdate, id });
  });

  it("should delete Threshold upon sending delete", async () => {
    const { status } = await client.delete(`${THRESHOLDS_ENDPOINT}/${thresholdId}`);

    expect(status).toBe(200);

    const dbEntry = await repository.findOne({ id: thresholdId });

    expect(dbEntry).toEqual(undefined);
  });

  it("should return 400 without sensorId", async () => {
    const { sensorId, ...withoutSensorId } = stubThreshold;
    await client
      .post(THRESHOLDS_ENDPOINT, withoutSensorId)
      .catch(({ response: { status, data } }) => {
        const { errors } = data;
        const { property, value } = errors[0];
        expect(status).toBe(400);
        expect(property).toBe("sensorId");
        expect(value).toBe(undefined);
      });
  });

  it("should return 400 without value", async () => {
    const { value, ...withoutValue } = stubThreshold;
    await client.post(THRESHOLDS_ENDPOINT, withoutValue).catch(({ response: { status, data } }) => {
      const { errors } = data;
      const { property, value } = errors[0];
      expect(status).toBe(400);
      expect(property).toBe("value");
      expect(value).toBe(undefined);
    });
  });

  it("should return 400 when type is phone without phone", async () => {
    const { phone, ...withoutPhone } = stubThreshold;
    await client
      .post(THRESHOLDS_ENDPOINT, { ...withoutPhone, notificationType: SMS_NOTIFICATION_TYPE })
      .catch(({ response: { status, data } }) => {
        const { errors } = data;
        const { property, value } = errors[0];
        expect(status).toBe(400);
        expect(property).toBe("phone");
        expect(value).toBe(undefined);
      });
  });

  it("should return 400 when type is email without email", async () => {
    const { email, ...withoutPhone } = stubThreshold;
    await client.post(THRESHOLDS_ENDPOINT, withoutPhone).catch(({ response: { status, data } }) => {
      const { errors } = data;
      const { property, value } = errors[0];
      expect(status).toBe(400);
      expect(property).toBe("email");
      expect(value).toBe(undefined);
    });
  });
});
