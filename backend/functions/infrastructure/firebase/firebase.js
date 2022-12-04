const admin = require("firebase-admin");
const serviceAccount = require("../../secrets/ServiceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

module.exports.admin = admin;