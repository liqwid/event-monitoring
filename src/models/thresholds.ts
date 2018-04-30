import { Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";
import { IsInt, IsNumber, IsIn, IsEmail, ValidateIf, IsMobilePhone } from "class-validator";

type EmailNotificationType = "email";
type SMSNotificationType = "sms";
type NotificationType = EmailNotificationType | SMSNotificationType;

export const THRESHOLDS_ENDPOINT = "/threshold";
export const EMAIL_NOTIFICATION_TYPE: EmailNotificationType = "email";
export const SMS_NOTIFICATION_TYPE: SMSNotificationType = "sms";

@Entity()
export class ThresholdModel {
  @PrimaryGeneratedColumn("uuid") id?: string;

  @IsInt()
  @Index()
  @Column("int")
  sensorId: number;

  @IsNumber()
  @Column("float", { nullable: true })
  value: number;

  @IsIn([EMAIL_NOTIFICATION_TYPE, SMS_NOTIFICATION_TYPE])
  @Column()
  notificationType: NotificationType;

  @ValidateIf(({ notificationType }) => notificationType === EMAIL_NOTIFICATION_TYPE)
  @IsEmail()
  @Column({ nullable: true })
  email?: string;

  @ValidateIf(({ notificationType }) => notificationType === SMS_NOTIFICATION_TYPE)
  @IsMobilePhone("en-GB")
  @Column({ nullable: true })
  phone?: string;
}
