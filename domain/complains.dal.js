const { ObjectId, MongoClient, MongoClientOptions, Db } = require('mongodb');
const COLLECTION_NAME = 'complains';

class ComplainDAL {
  /**
   *
   * @param {string} uri
   * @param {MongoClientOptions} options
   */
  constructor(uri, options) {
    this.uri = uri;
    this.options = options;
  }

  /**
   * @returns {Promise<Db>}
   */
  get db() {
    this.cli = new MongoClient(this.uri, this.options);

    process.on('SIGINT', () => {
      this.cli.close();
    });

    process.on('SIGTERM', () => {
      this.cli.close();
    });

    return this.cli.connect().then(() => {
      return this.cli.db(process.env.DB_NAME);
    });
  }

  /**
   *
   * @param {any} inputComplain
   */
  async create(inputComplain) {
    const db = await this.db;
    inputComplain.createdAt = new Date();
    inputComplain.updatedAt = new Date();
    const { insertedId } = await db.collection(COLLECTION_NAME).insertOne(inputComplain);
    const inserted = await db.collection(COLLECTION_NAME).findOne({ _id: insertedId });
    return inserted;
  }

  /**
   *
   * @param {string} _id
   */
  async findById(_id) {
    const db = await this.db;
    const result = await db.collection(COLLECTION_NAME).findOne({ _id: ObjectId(_id) });
    return result;
  }

  /**
   *
   * @param {any} param0
   */
  async list({ limit = 25, offset = 0, query = {}, sort = {} }) {
    const db = await this.db;
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
    const count = await db.collection(COLLECTION_NAME).countDocuments(query);
    const records = await db
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
    const db = await this.db;
    const result = await db.collection(COLLECTION_NAME).findOneAndDelete({
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
    const db = await this.db;
    inputComplain.updatedAt = new Date();
    const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
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
