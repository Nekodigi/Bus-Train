const functions = require("firebase-functions");
const { app } = require("./handler/handler");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
if(process.argv[2] === "dev"){
    app.listen(4000);
}else{
    exports.app = functions.https.onRequest(app);
}

