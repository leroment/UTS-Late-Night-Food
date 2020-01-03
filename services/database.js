"use strict";

let database;

module.exports = class Database {
  static get database() {
    return database;
  }

  static set database(db) {
    database = db;
  }

  static addDocumentToCollection(collection, document) {
    var collectionName = db.collection(collection);

    collectionName.insertOne(document);

    collectionName.save();
  }
};
