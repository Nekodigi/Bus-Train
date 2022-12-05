const functions = require("firebase-functions");
const { app } = require("./handler/handler");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// process.env.TZ = "Asia/Tokyo";

// export const checkTimezone = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
//   console.info(process.env.TZ)
//   // -> Asia/Tokyo
// });

if(process.argv[2] === "dev"){
    app.listen(4000);
}else{
    functions.region('asia-northeast1').pubsub.schedule('0 10 * * *').timeZone('Asia/Tokyo');
    exports.app = functions.https.onRequest(app);//
}

