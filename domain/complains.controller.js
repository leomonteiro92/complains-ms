const { Request, Response, Next } = require('restify');
const service = require('./complains.service');

class ComplainController {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Next} next
   */
  static async create(req, res, next) {
    const inputComplain = req.body;
    try {
      const result = await service.create(inputComplain);
      res.send(201, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Next} next
   */
  static async findById(req, res, next) {
    const _id = req.params.id;
    try {
      const result = await service.findById(_id);
      if (!result) {
        return next(Error(`Complain not found with id:${_id}`));
      }
      res.send(200, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Next} next
   */
  static async list(req, res, next) {
    try {
      const result = await service.list(req.query || {});
      res.send(200, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Next} next
   */
  static async remove(req, res, next) {
    const { id } = req.params;
    try {
      await service.remove(id);
      res.send(204);
    } catch (err) {
      next(err);
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Next} next
   */
  static async update(req, res, next) {
    const { id } = req.params;
    const inputComplain = req.body;
    try {
      const result = await service.update(id, inputComplain);
      res.send(204, result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ComplainController;
