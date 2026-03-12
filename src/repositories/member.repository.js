import Member from "../models/member.model.js";

class MemberRepository {
  async findById(id) {
    return Member.findById(id).exec();
  }

  async create(data) {
    return new Member(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return Member.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return Member.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return Member.find(filter).exec();
  }
}

export default new MemberRepository();
