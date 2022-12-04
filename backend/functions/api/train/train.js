
const { db } = require('../../infrastructure/firestore/firestore');
const { getPaths } = require('./path');
const { updateSchedule, updateAllSchedules } = require('./schedule');

exports.updateAllSchedules = updateAllSchedules;

exports.updateSchedule = updateSchedule;  //{id:,JRName, dir}

exports.getAllPaths = async () => {
  let stops = (await db.collection('train').get()).docs.map(doc => doc.data());
  let paths = [];
  for(stop of stops){
    if(stop.distMBase===-1)continue;
    
    let paths_ = await getPaths(stop);
    paths = paths.concat(paths_);
  }
  return paths;
}

exports.getPaths = getPaths;