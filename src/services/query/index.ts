import { getRepository, MoreThan, LessThan, Equal, Between } from "typeorm";
import { EventModel } from "models/events";
import { handlePgErrors } from "utils/errorHandler";

export interface QueryOptions {
  since?: number;
  until?: number;
  sensorId?: number;
}

/**
 * Searches for events
 * @param query
 * @returns {Promise<EventModel>} resolves with event
 */
export async function queryEvents({ since, until, sensorId }: QueryOptions): Promise<EventModel[]> {
  const repository = await getRepository(EventModel);
  const eventsQuery: any = {};
  if (since && until) eventsQuery.time = Between(since, until);
  else if (since) eventsQuery.time = MoreThan(since);
  else if (until) eventsQuery.time = LessThan(until);
  if (sensorId) eventsQuery.sensorId = Equal(sensorId);

  const events = <EventModel[]>await repository.find(eventsQuery).catch(handlePgErrors);
  return events;
}
