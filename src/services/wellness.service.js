import { NotFoundError } from '../common/errors.js';
import { validate } from '../common/validate.js';
import { createWellnessFormSchema, updateWellnessFormSchema } from '../schemas/wellness.schemas.js';

export class WellnessService {
  constructor(wellnessRepository) {
    this.wellnessRepository = wellnessRepository;
  }

  getAllForms(memberId) {
    return this.wellnessRepository.findAllForms(memberId);
  }

  async getFormById(id) {
    const form = await this.wellnessRepository.findFormById(id);
    if (!form) throw new NotFoundError('Wellness form not found');
    return form;
  }

  submitForm(body) {
    const data = validate(createWellnessFormSchema, body);
    return this.wellnessRepository.createForm({ ...data, date: new Date(data.date) });
  }

  async updateForm(id, body) {
    await this.getFormById(id);
    const data = validate(updateWellnessFormSchema, body);
    return this.wellnessRepository.updateForm(id, data);
  }

  async deleteForm(id) {
    await this.getFormById(id);
    return this.wellnessRepository.deleteForm(id);
  }

  getRecentForms(memberId, days) {
    return this.wellnessRepository.findRecentByMember(memberId, days);
  }
}
