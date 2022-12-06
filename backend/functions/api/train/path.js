const { getHash } = require("../../utils/hash");
const { nextToDate, minDiff, calcDangerByDistM, tsToDate } = require("../../utils/time/date");
const { updateAllSchedules } = require("./schedule");


exports.getPaths = async (stop) => {
    await updateAllSchedules();
    res = [];
    let arrival = new Date();
    arrival.setMinutes(arrival.getMinutes()+stop.distMBase, 0, 0);
    let departure = nextToDate(arrival, stop.departures.map(departure => tsToDate(departure)));
    if(departure === undefined)return res;
    let now = new Date();
    now.setSeconds(0, 0);
    let min = minDiff(departure,now);
    let danger = calcDangerByDistM(min, stop.distMBase, false);
    let hash = getHash(stop.id+departure);
    res.push({type:"walk", from: {id:"base", name:"徳山高専", date:now}, to:{id:stop.id, name:stop.name, date:departure, min, danger, refURL:stop.refURL}, delay:0, priority:stop.priority, danger, hash, lastUpdate:new Date()});


    let departure_ = new Date(departure);
    departure_.setSeconds(departure_.getSeconds()+1, 0);
    let departure2 = nextToDate(departure_, stop.departures.map(departure => tsToDate(departure)));
    if(departure2 === undefined)return res;
    
    min = minDiff(departure2,now);
    danger = calcDangerByDistM(min, stop.distMBase, false);
    hash = getHash(stop.id+departure2);
    res.push({type:"walk", from: {id:"base", name:"徳山高専", date:now}, to:{id:stop.id, name:stop.name, date:departure2, min, danger, refURL:stop.refURL}, delay:0, priority:stop.priority, danger, hash, lastUpdate:new Date()});
    return res;
}