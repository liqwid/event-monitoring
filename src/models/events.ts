import { Column, Entity, PrimaryGeneratedColumn, Unique, Index } from "typeorm";
import { IsInt, IsNumber, ValidateIf } from "class-validator";

export const EVENTS_ENDPOINT = "/data";

@Entity({
  orderBy: {
    time: "ASC",
    sensorId: "ASC",
  },
})
@Unique(["sensorId", "time"])
export class EventModel {
  @PrimaryGeneratedColumn("uuid") id?: string;

  @IsInt()
  @Index()
  @Column("int")
  sensorId: number;

  @IsInt()
  @Index()
  @Column("int")
  time: number;

  @ValidateIf(({ value }) => value !== undefined)
  @IsNumber()
  @Column("float", { nullable: true })
  value?: number;
}
