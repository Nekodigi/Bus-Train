const { db } = require("../../infrastructure/firestore/firestore");
const { minDiff, tsToDate } = require("../../utils/time/date");
const bus = require("../bus/bus");
const train = require("../train/train");

exports.getAllPaths = async () => {
    let paths = await train.getAllPaths();
    paths = paths.concat(await bus.getAllPaths());
    sortPaths(paths);
    return paths;
}

exports.updatePaths = async () => {
    //console.log(minDiff(new Date(), tsToDate((await db.collection('paths').doc('0').get()).data().lastUpdate)));
    if((await db.collection('paths').doc('0').get()).data() !== undefined){
        if(minDiff(new Date(), tsToDate((await db.collection('paths').doc('0').get()).data().lastUpdate)) < 1)return;
    }
    
    let paths = await train.getAllPaths();
    paths = paths.concat(await bus.getAllPaths());
    sortPaths(paths);
    await Promise.all((await db.collection('paths').get()).docs.map(doc => doc.ref.delete()))
    await Promise.all(paths.map(async (path, i) => {
        db.collection('paths').doc(i+"").set(path);
    }));
    
    return paths;
}


const sortPaths = (paths) => {
    paths.sort((a, b) => {
        if(Math.abs(minDiff(a.to.date, b.to.date)) > 10)return minDiff(a.to.date, b.to.date);
        if(a.priority !== b.priority)return a.priority - b.priority
        return a.danger - b.danger;
    });
}
exports.sortPaths = sortPaths;