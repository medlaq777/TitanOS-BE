import loyaltyRepo from "../repositories/loyalty.repository.js";
import { NotFoundError } from "../common/errors.js";

class LoyaltyService {
  constructor(repo) {
    this.repo = repo;
  }

  async create(data) {
    return this.repo.create(data);
  }

  async update(id, data) {
    const loyalty = await this.repo.updateById(id, data);
    if (!loyalty) throw new NotFoundError("Loyalty record not found");
    return loyalty;
  }

  async delete(id) {
    const loyalty = await this.repo.deleteById(id);
    if (!loyalty) throw new NotFoundError("Loyalty record not found");
    return loyalty;
  }

  async getById(id) {
    const loyalty = await this.repo.findById(id);
    if (!loyalty) throw new NotFoundError("Loyalty record not found");
    return loyalty;
  }

  async getAll(filters = {}) {
    return this.repo.find(filters);
  }

  async findOne(filter = {}) {
    return this.repo.findOne(filter);
  }
}

export { LoyaltyService };
export default new LoyaltyService(loyaltyRepo);
