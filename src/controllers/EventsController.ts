import { JsonController, Post, Body } from "routing-controllers";
import { ingestEvent } from "services/ingestion";
import { EventModel, EVENTS_ENDPOINT } from "models/events";

@JsonController(EVENTS_ENDPOINT)
export class EventsController {
  @Post()
  async ingestEvent(@Body() event: EventModel): Promise<EventModel> {
    return ingestEvent(event);
  }
}
