import { checkThreshold, formatThresholdBreachMessage } from "./index";
import { ThresholdModel, EMAIL_NOTIFICATION_TYPE, SMS_NOTIFICATION_TYPE } from "models/thresholds";
import { sendSms } from "services/sms";
import { sendEmail } from "services/email";
import crud from "services/thresholds";

jest.mock("services/thresholds");

jest.mock("services/email");
jest.mock("services/sms");

const EMAIL_SENSOR_ID = 1;
const SMS_SENSOR_ID = 2;
const EMAIL = "email";
const PHONE = "phone";
const THRESHOLD_VALUE = 30;

const stubThresholds: ThresholdModel[] = [
  {
    sensorId: EMAIL_SENSOR_ID,
    value: THRESHOLD_VALUE,
    notificationType: EMAIL_NOTIFICATION_TYPE,
    email: EMAIL,
  },
  {
    sensorId: SMS_SENSOR_ID,
    value: THRESHOLD_VALUE,
    notificationType: SMS_NOTIFICATION_TYPE,
    phone: PHONE,
  },
];

(crud.get as jest.Mock).mockImplementation(({ sensorId }) =>
  stubThresholds.filter(threshold => sensorId === threshold.sensorId)
);

describe("Threshold check", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send sms if sms threshold with target sensorId and lower or equal value exists", async () => {
    const event = {
      time: Math.floor(Date.now() / 100),
      value: THRESHOLD_VALUE + 1,
      sensorId: SMS_SENSOR_ID,
    };
    await checkThreshold(event);
    expect(sendSms).toHaveBeenCalledTimes(1);
    expect(sendSms).toHaveBeenCalledWith(
      PHONE,
      formatThresholdBreachMessage(event, THRESHOLD_VALUE)
    );

    const eventWithEqualValue = {
      time: Math.floor(Date.now() / 100),
      value: THRESHOLD_VALUE,
      sensorId: SMS_SENSOR_ID,
    };
    await checkThreshold(eventWithEqualValue);
    expect(sendSms).toHaveBeenCalledTimes(2);
  });

  it("should send email if email threshold with target sensorId and lower or equal value exists", async () => {
    const event = {
      time: Math.floor(Date.now() / 100),
      value: THRESHOLD_VALUE + 1,
      sensorId: EMAIL_SENSOR_ID,
    };
    await checkThreshold(event);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      EMAIL,
      formatThresholdBreachMessage(event, THRESHOLD_VALUE)
    );

    const eventWithEqualValue = {
      time: Math.floor(Date.now() / 100),
      value: THRESHOLD_VALUE,
      sensorId: EMAIL_SENSOR_ID,
    };
    await checkThreshold(eventWithEqualValue);
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it("should not send email or sms if email threshold is not reached", async () => {
    const smsEvent = {
      time: Math.floor(Date.now() / 100),
      value: THRESHOLD_VALUE - 1,
      sensorId: SMS_SENSOR_ID,
    };
    const emailEvent = {
      time: Math.floor(Date.now() / 100),
      value: THRESHOLD_VALUE - 1,
      sensorId: EMAIL_SENSOR_ID,
    };
    await checkThreshold(smsEvent);
    await checkThreshold(emailEvent);
    expect(sendEmail).toHaveBeenCalledTimes(0);
    expect(sendSms).toHaveBeenCalledTimes(0);
  });
});
