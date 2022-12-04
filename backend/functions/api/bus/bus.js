
const { db } = require('../../infrastructure/firestore/firestore');
const { getPaths } = require('./path');

exports.getAllPaths = async () => {
  let paths = [];
  let stopSnaps = (await db.collection('bus').get()).docs;
  await Promise.all(stopSnaps.map(async stopSnap => {
    let dests = (await stopSnap.ref.collection('dest').get()).docs.map(doc => doc.data());
    await Promise.all(dests.map(async dest => {
      console.log(`GETTING from ${stopSnap.data().name} to ${dest.name}`);
      let stop = stopSnap.data();
      let paths_ = await getPaths([stop, dest]);//{id:dest.from}, {id:dest.to, name:dest.name, station:dest.station}
      paths = paths.concat(paths_);
    }));
  }));

  return paths;
}

exports.getPaths = getPaths;

