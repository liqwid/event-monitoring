import "reflect-metadata";
import * as express from "express";
import * as morgan from "morgan";
import { createExpressServer } from "routing-controllers";
import { EventsController } from "controllers/EventsController";
import { initDb } from "db/init";

export async function createApp(): Promise<express.Express> {
  await initDb();
  const app = await createExpressServer({
    cors: true,
    controllers: [EventsController],
  });

  app.use(morgan("dev"));

  return app;
}
