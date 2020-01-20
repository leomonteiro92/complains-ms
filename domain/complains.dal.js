const { ObjectId, MongoClient, MongoClientOptions } = require('mongodb');
const COLLECTION_NAME = 'complains';

class ComplainDAL {
  /**
   *
   * @param {string} uri
   * @param {MongoClientOptions} options
   */
  constructor(uri, options) {
    this.cli = new MongoClient(uri, options);
    this.cli.connect();
    this.db = this.cli.db(process.env.DB_NAME);

    process.on('SIGINT', () => {
      this.cli.close();
    });

    process.on('SIGTERM', () => {
      this.cli.close();
    });
  }

  /**
   *
   * @param {any} inputComplain
   */
  async create(inputComplain) {
    inputComplain.createdAt = new Date();
    inputComplain.updatedAt = new Date();
    const { insertedId } = await this.db.collection(COLLECTION_NAME).insertOne(inputComplain);
    const inserted = await this.db.collection(COLLECTION_NAME).findOne({ _id: insertedId });
    return inserted;
  }

  /**
   *
   * @param {string} _id
   */
  async findById(_id) {
    const result = await this.db.collection(COLLECTION_NAME).findOne({ _id: ObjectId(_id) });
    return result;
  }

  /**
   *
   * @param {any} param0
   */
  async list({ limit = 25, offset = 0, query = {}, sort = {} }) {
    if (query.latitude && query.longitude) {
      query.location = {
        $geoWithin: {
          $centerSphere: [[query.longitude, query.latitude], (query.radius || 5) / 3963.2]
        }
      };
      delete query.latitude;
      delete query.longitude;
      delete query.radius;
    }
    if (query.title) {
      query.title = new RegExp(query.title, 'gi');
    }
    const count = await this.db.collection(COLLECTION_NAME).countDocuments(query);
    const records = await this.db
      .collection(COLLECTION_NAME)
      .find(query)
      .sort(sort)
      .limit(limit)
      .skip(offset)
      .toArray();
    return { count, records };
  }

  /**
   *
   * @param {string} _id
   */
  async remove(_id) {
    const result = await this.db.collection(COLLECTION_NAME).findOneAndDelete({
      _id: ObjectId(_id)
    });
    if (!result) {
      throw new Error(`could not find record with _id: ${_id}`);
    }
    return result;
  }

  /**
   *
   * @param {string} _id
   * @param {any} inputComplain
   */
  async update(_id, inputComplain) {
    inputComplain.updatedAt = new Date();
    const result = await this.db.collection(COLLECTION_NAME).findOneAndUpdate(
      { _id: ObjectId(_id) },
      {
        $set: inputComplain
      },
      {
        returnOriginal: true
      }
    );
    if (!result) {
      throw new Error(`could not find record with _id: ${_id}`);
    }
    return result;
  }
}

module.exports = new ComplainDAL(process.env.DB_URL || 'mongodb://local:dev@127.0.0.1:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
