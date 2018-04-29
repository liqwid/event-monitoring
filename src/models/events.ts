import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { IsInt, IsNumber, ValidateIf } from "class-validator";

export const EVENTS_ENDPOINT = "/data";

@Entity()
@Unique(["sensorId", "time"])
export class EventModel {
  @PrimaryGeneratedColumn("uuid") id: string;

  @IsInt()
  @Column("int")
  sensorId: string;

  @IsInt()
  @Column("int")
  time: number;

  @ValidateIf(({ value }) => value !== undefined)
  @IsNumber()
  @Column("float", { nullable: true })
  value: number;
}
