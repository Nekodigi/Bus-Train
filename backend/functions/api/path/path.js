const { db } = require("../../infrastructure/firestore/firestore");
const { mergeOverriteA } = require("../../utils/path/merge");
const { minDiff, tsToDate, addMin } = require("../../utils/time/date");
const bus = require("../bus/bus");
const { updateInvalidPath } = require("../bus/path");
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
        if(minDiff(new Date(), tsToDate((await db.collection('paths').doc('0').get()).data().lastUpdate)) < 1){console.log("ALREADY UPDATED");return;}
    }
    
    let paths = await train.getAllPaths();
    paths = paths.concat(await bus.getAllPaths());
    
    //should be deleted but should not be lost 
    let cache_paths = [];
    (await db.collection('paths').get()).docs.map(async doc => {
        let docd = doc.data();
        if(tsToDate(doc.data().from.date) < new Date())docd.valid = false;
        if(tsToDate(doc.data().to.date) > new Date())cache_paths.push(docd)

    })
    cache_paths = await Promise.all(cache_paths.map(async path => await updateInvalidPath(path)));
    paths = mergeOverriteA(cache_paths, paths);//merge a to b; prioritize b change
    //update path which is not included in paths;

    //console.log(paths.map(path => path));

    sortPaths(paths);
    await Promise.all(paths.map(async (path, i) => {//merge by hash however should change order.
        db.collection('paths').doc(i+"").set(path);
    }));
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

const complementPath = (path) => {
    if(path.type === "bus"){
        path.danger = path.from.danger + path.mid.danger + path.to.danger
        path.from.date = addMin(path.from.scheduledDate, path.delay);
        path.mid.date = addMin(path.mid.scheduledDate, path.delay);
        path.to.date = path.to.scheduledDate;
        
        path.from.min = minDiff(path.from.date, new Date());
        path.mid.date = minDiff(path.mid.date, path.from.date);
        path.to.date = minDiff(path.to.date, path.mid.date);
        

    }
    
}