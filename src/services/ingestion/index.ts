import { getRepository } from "typeorm";
import { EventModel } from "models/events";
import { handlePgErrors } from "utils/errorHandler";

/**
 * Creates new event
 * @param eventData
 * @returns {Promise<EventModel>} resolves with event
 */
export async function ingestEvent(eventData: EventModel): Promise<EventModel> {
  const repository = await getRepository(EventModel);
  const event = await repository.create(eventData);

  await repository.save(event).catch(handlePgErrors);
  return event;
}
