const Joi = require('@hapi/joi');
const ComplainDAL = require('./complains.dal');

class ComplainService {
  /**
   *
   * @param {any} inputComplain
   */
  static create(inputComplain) {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      company: Joi.string().required()
    });
    const { error, value: complain } = schema.validate(inputComplain);
    if (error) throw new Error(error.message);

    complain.location = {
      type: 'Point',
      coordinates: [complain.longitude, complain.latitude]
    };

    return ComplainDAL.create(complain);
  }

  /**
   *
   * @param {string} _id
   */
  static findById(_id) {
    return ComplainDAL.findById(_id);
  }

  /**
   *
   * @param {any} options
   */
  static async list(options) {
    const schema = Joi.object({
      limit: Joi.number(),
      offset: Joi.number(),
      query: Joi.object({
        company: Joi.string(),
        description: Joi.string(),
        latitude: Joi.number(),
        longitude: Joi.number(),
        radius: Joi.number(),
        title: Joi.string()
      }).with('latitude', 'longitude'),
      sort: Joi.object({
        title: Joi.number()
          .min(-1)
          .max(1),
        description: Joi.number()
          .min(-1)
          .max(1),
        location: Joi.number()
          .min(-1)
          .max(1),
        company: Joi.number()
          .min(-1)
          .max(1)
      })
    });
    const { error, value: inputOptions } = schema.validate(options);
    if (error) throw new Error(error.message);
    const { count, records: complains } = await ComplainDAL.list(inputOptions);
    return { count, complains };
  }

  /**
   *
   * @param {string} _id
   */
  static remove(_id) {
    return ComplainDAL.remove(_id);
  }

  /**
   *
   * @param {string} _id
   * @param {any} inputComplain
   */
  static update(_id, inputComplain) {
    const schema = Joi.object({
      _id: Joi.forbidden(),
      title: Joi.string(),
      description: Joi.string(),
      location: Joi.string(),
      company: Joi.string()
    });
    const { error } = schema.validate(inputComplain);
    if (error) throw new Error(error.message);
    return ComplainDAL.update(_id, inputComplain);
  }
}

module.exports = ComplainService;
