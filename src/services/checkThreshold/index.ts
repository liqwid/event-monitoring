import { EventModel } from "models/events";
import { ThresholdModel, SMS_NOTIFICATION_TYPE, EMAIL_NOTIFICATION_TYPE } from "models/thresholds";
import thresholdCrud from "services/thresholds";
import { sendSms } from "services/sms";
import { sendEmail } from "services/email";

export async function checkThreshold(event: EventModel) {
  const { sensorId, value = 0 } = event;
  const thresholds: ThresholdModel[] = await thresholdCrud.get({ sensorId });

  thresholds
    .filter(threshold => value >= threshold.value)
    .forEach(({ notificationType, email, phone, value }) => {
      const message = formatThresholdBreachMessage(event, value);
      if (notificationType === SMS_NOTIFICATION_TYPE) sendSms(<string>phone, message);
      if (notificationType === EMAIL_NOTIFICATION_TYPE) sendEmail(<string>email, message);
    });
}

export function formatThresholdBreachMessage(
  { sensorId, time, value }: EventModel,
  thresholdValue: number
): string {
  return `A threshold value of ${thresholdValue} has been breached at sensor ${sensorId}
    Event details:
      value ${value}
      time ${new Date(time * 100)}
  `;
}
