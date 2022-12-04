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
    let min1 = minDiff(departure,now);
    let danger1 = calcDangerByDistM(min1, stop.distMBase, false);
    res.push({type:"walk", from: {id:"base", name:"徳山高専", date:now}, to:{id:stop.id, name:stop.name, date:departure, min:min1, danger:danger1}, delay:0, priority:stop.priority, danger:danger1, lastUpdate:new Date()});


    let departure_ = new Date(departure);
    departure_.setSeconds(departure_.getSeconds()+1, 0);
    let departure2 = nextToDate(departure_, stop.departures.map(departure => tsToDate(departure)));
    if(departure2 === undefined)return res;
    
    let min2 = minDiff(departure2,now);
    let danger2 = calcDangerByDistM(min2, stop.distMBase, false);
    res.push({type:"walk", from: {id:"base", name:"徳山高専", date:now}, to:{id:stop.id, name:stop.name, date:departure2, min:min2, danger:danger2}, delay:0, priority:stop.priority, danger:danger2, lastUpdate:new Date()});
    return res;
}