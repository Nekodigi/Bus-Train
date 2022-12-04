const { admin } = require("../firebase/firebase");

const firestore = admin.firestore;
module.exports.firestore = firestore;
const db = admin.firestore();
module.exports.db = db;

