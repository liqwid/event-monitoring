import { createConnection, getConnectionOptions, Connection } from "typeorm";
import { EventModel } from "models/events";
import { ThresholdModel } from "models/thresholds";

/**
 * Initializaes db connection
 */
export async function initDb(): Promise<Connection> {
  // Getting connection options from env variables
  const options = await getConnectionOptions();
  // Merging connection options with entities
  return await createConnection({
    ...options,
    entities: [EventModel, ThresholdModel],
  });
}
