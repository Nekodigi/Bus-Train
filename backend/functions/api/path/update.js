const { getHash } = require("../../utils/hash");
const { calcDangerByDistM, addMin, minDiff, tsToDate } = require("../../utils/time/date");

exports.tsToDateAll = (path) => {
    if(path.from) path.from.scheduledDate = tsToDate(path.from.scheduledDate);
    if(path.mid) path.mid.scheduledDate = tsToDate(path.mid.scheduledDate);
    if(path.to) path.to.scheduledDate = tsToDate(path.to.scheduledDate);
    return path;
}

exports.complementPath = (path) => {
    if(path.type === "bus"){
        path.from.date = addMin(path.from.scheduledDate, path.delay);
        path.mid.date = addMin(path.mid.scheduledDate, path.delay);
        path.to.date = path.to.scheduledDate;
        
        path.from.min = minDiff(path.from.date, new Date());
        path.mid.min = minDiff(path.mid.date, path.from.date);
        path.to.min = minDiff(path.to.date, path.mid.date);

        path.from.danger = calcDangerByDistM(path.from.min, path.from.distM);
        path.mid.danger = path.delay > 5 ? 1 : 0;
        path.to.danger = calcDangerByDistM(path.to.min, path.to.distM, false);

        path.danger = Math.max(path.from.danger, path.mid.danger, path.to.danger);
        path.hash = getHash(path.from.id+path.from.scheduledDate);//
        
    }else if(path.type === "walk"){
        path.to.date = path.to.scheduledDate;
        path.from = {id:"base", name:"徳山高専", scheduledDate:new Date(), date:new Date()};
        path.to.min = minDiff(path.to.date, path.from.date);
        path.to.danger = calcDangerByDistM(path.to.min, path.to.distM, false);

        path.danger = path.to.danger;
        path.delay = 0;
        path.valid = true;
        path.hash = getHash(path.from.id+path.to.scheduledDate);//
    }
    path.lastUpdate = new Date();
    
    return path;
}