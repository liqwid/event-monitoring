import { getRepository } from "typeorm";
import { ThresholdModel } from "models/thresholds";
import { handlePgErrors } from "utils/errorHandler";

export default {
  async create(thresholdData: ThresholdModel): Promise<ThresholdModel> {
    const repository = await getRepository(ThresholdModel);

    const threshold = await repository.create(thresholdData);

    await repository.save(threshold).catch(handlePgErrors);
    return threshold;
  },

  async get(query: Partial<ThresholdModel>): Promise<ThresholdModel[]> {
    const repository = await getRepository(ThresholdModel);

    const thresholds = <ThresholdModel[]>await repository.find(query).catch(handlePgErrors);
    return thresholds;
  },

  async getOne(id: string): Promise<ThresholdModel> {
    const repository = await getRepository(ThresholdModel);

    const threshold = <ThresholdModel>await repository.findOne(id).catch(handlePgErrors);
    return threshold;
  },

  async update(id: string, thresholdData: ThresholdModel): Promise<ThresholdModel> {
    const repository = await getRepository(ThresholdModel);

    await repository.update(id, thresholdData).catch(handlePgErrors);
    return { ...thresholdData, id };
  },

  async delete(id: string): Promise<{}> {
    const repository = await getRepository(ThresholdModel);

    await repository.delete(id).catch(handlePgErrors);

    return {};
  },
};
