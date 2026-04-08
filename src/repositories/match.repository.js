import mongoose from "mongoose";
import Match from "../models/match.model.js";
import QueryHelper from "./query-helper.js";

class MatchRepository {
  async findById(id) {
    return Match.findById(id).exec();
  }

  async create(data) {
    return new Match(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return Match.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return Match.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return Match.find(filter).sort(QueryHelper.defaultDescSort()).exec();
  }

  async findBySeasonId(seasonId) {
    return Match.find({ seasonId }).exec();
  }

  async findFinished() {
    return Match.find({ status: "FINISHED" }).exec();
  }

  async withTransaction(work) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const result = await work(session);
      await session.commitTransaction();
      return result;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }
}

export default new MatchRepository();
