const { db } = require("../../infrastructure/firestore/firestore");
const { getHash } = require("../../utils/hash");
const { pad } = require("../../utils/misc");
const { mergeOverriteA } = require("../../utils/path/merge");
const { minDiff, tsToDate, addMin, calcDangerByDistM } = require("../../utils/time/date");
const bus = require("../bus/bus");
const { updateInvalidPath } = require("../bus/path");
const train = require("../train/train");
const { tsToDateAll } = require("./update");

exports.getAllPaths = async () => {
    let paths = await train.getAllPaths();
    paths = paths.concat(await bus.getAllPaths());
    sortPaths(paths);
    return paths;
}

exports.updatePaths = async () => {
    //console.log(minDiff(new Date(), tsToDate((await db.collection('paths').doc('0').get()).data().lastUpdate)));
    if((await db.collection('paths').doc('0000').get()).data() !== undefined){
        if(minDiff(new Date(), tsToDate((await db.collection('paths').doc('0000').get()).data().lastUpdate)) < 1){console.log("ALREADY UPDATED");return;}
    }
    
    let paths = await train.getAllPaths();
    paths = paths.concat(await bus.getAllPaths());
    
    //should be deleted but should not be lost 
    let cache_paths = [];
    //(await db.collection('paths').get()).docs.map(doc => doc.ref.delete())//doc is not deleted when delete collection
    await Promise.all((await db.collection('paths').get()).docs.map(async doc => {
        let docd = doc.data();
        if(tsToDate(doc.data().from.date) < new Date())docd.valid = false;
        if(tsToDate(doc.data().to.date) > new Date())cache_paths.push(tsToDateAll(docd))
        await doc.ref.delete();
    }))
    cache_paths = await Promise.all(cache_paths.map(async path => await updateInvalidPath(path)));
    paths = mergeOverriteA(cache_paths, paths);//merge a to b; prioritize b change
    //update path which is not included in paths;

    //console.log(paths.map(path => path));

    sortPaths(paths);
    await Promise.all(paths.map(async (path, i) => {//merge by hash however should change order.
        //console.log(i);
        //console.log(pad(i, 4));
        //console.log(path);
        db.collection('paths').doc(pad(i, 4)).set(path);
    }));
    //console.log(paths);
    console.log("PATH UPDATED");

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

