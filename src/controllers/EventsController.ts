import { JsonController, Post, Get, Body, QueryParams } from "routing-controllers";
import { ingestEvent } from "services/ingestion";
import { queryEvents, QueryOptions } from "services/query";
import { checkThreshold } from "services/checkThreshold";
import { EventModel, EVENTS_ENDPOINT } from "models/events";

@JsonController(EVENTS_ENDPOINT)
export class EventsController {
  @Post()
  async ingestEvent(@Body() event: EventModel): Promise<EventModel> {
    setImmediate(() => checkThreshold(event));
    return ingestEvent(event);
  }

  @Get()
  async queryEvents(@QueryParams() query: QueryOptions) {
    return queryEvents(query);
  }
}
