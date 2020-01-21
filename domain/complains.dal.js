const { ObjectId, MongoClient, MongoClientOptions, Db } = require('mongodb');
const COLLECTION_NAME = 'complains';

class ComplainDAL {
  /**
   *
   * @param {string} uri
   * @param {MongoClientOptions} options
   */
  constructor(uri) {
    this.cli = MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    process.on('SIGINT', () => {
      this.cli.close();
    });

    process.on('SIGTERM', () => {
      this.cli.close();
    });
  }

  /**
   * @returns {Promise<Db>}
   */
  async db() {
    if (!this.cli) {
      this.cli = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      process.on('SIGINT', () => {
        this.cli.close();
      });

      process.on('SIGTERM', () => {
        this.cli.close();
      });
    }
    const conn = await this.cli;
    return conn.db(process.env.DB_NAME);
  }

  /**
   *
   * @param {any} inputComplain
   */
  async create(inputComplain) {
    const db = await this.db();
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
    const db = await this.db();
    const result = await db.collection(COLLECTION_NAME).findOne({ _id: ObjectId(_id) });
    return result;
  }

  /**
   *
   * @param {any} param0
   */
  async list({ size = 25, page = 0, filters = {}, sort = {} }) {
    const db = await this.db();
    if (filters.latitude && filters.longitude) {
      filters.location = {
        $geoWithin: {
          $centerSphere: [[filters.longitude, filters.latitude], (filters.radius || 5) / 3963.2]
        }
      };
      delete filters.latitude;
      delete filters.longitude;
      delete filters.radius;
    }
    if (filters.title) {
      filters.title = new RegExp(filters.title, 'gi');
    }
    const count = await db.collection(COLLECTION_NAME).countDocuments(filters);
    const records = await db
      .collection(COLLECTION_NAME)
      .find(filters)
      .sort(sort)
      .limit(size)
      .skip(page)
      .toArray();
    return { count, records };
  }

  /**
   *
   * @param {string} _id
   */
  async remove(_id) {
    const db = await this.db();
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
    const db = await this.db();
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

module.exports = new ComplainDAL(process.env.DB_URL || 'mongodb://local:dev@127.0.0.1:27017');
