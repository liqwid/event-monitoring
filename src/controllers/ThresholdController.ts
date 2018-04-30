import {
  JsonController,
  Post,
  Get,
  Put,
  Delete,
  Body,
  QueryParams,
  Param,
} from "routing-controllers";
import { THRESHOLDS_ENDPOINT, ThresholdModel } from "models/thresholds";
import crud from "services/thresholds";

@JsonController(THRESHOLDS_ENDPOINT)
export class ThresholdController {
  @Post()
  async createThreshold(@Body() threshold: ThresholdModel): Promise<ThresholdModel> {
    return crud.create(threshold);
  }

  @Get()
  async queryThresholds(@QueryParams() query: Partial<ThresholdModel>): Promise<ThresholdModel[]> {
    return crud.get(query);
  }

  @Get("/:id")
  async getThreshold(@Param("id") id: string): Promise<ThresholdModel> {
    return crud.getOne(id);
  }

  @Put("/:id")
  async updateThreshold(
    @Param("id") id: string,
    @Body() threshold: ThresholdModel
  ): Promise<Partial<ThresholdModel>> {
    return crud.update(id, threshold);
  }

  @Delete("/:id")
  async deleteThreshold(@Param("id") id: string): Promise<{}> {
    return crud.delete(id);
  }
}
