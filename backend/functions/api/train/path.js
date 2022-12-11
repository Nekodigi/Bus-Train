const { getHash } = require("../../utils/hash");
const { nextToDate, addMin } = require("../../utils/time/date");
const { complementPath } = require("../path/update");
const { updateAllSchedules } = require("./schedule");


exports.getPaths = async (stop) => {
    await updateAllSchedules();
    res = [];
    let arrival = new Date();
    arrival = addMin(arrival, stop.distMBase);
    let departure = nextToDate(arrival, stop.departures);
    if(departure === undefined)return res;
    res.push(complementPath({type:"walk", to:{id:stop.id, name:stop.name, distM:stop.distMBase, scheduledDate:departure, refURL:stop.refURL}, priority:stop.priority}));


    let departure_ = new Date(departure);
    departure_.setSeconds(departure_.getSeconds()+1, 0);
    let departure2 = nextToDate(departure_, stop.departures);
    if(departure2 === undefined)return res;
    
    res.push(complementPath({type:"walk", to:{id:stop.id, name:stop.name, distM:stop.distMBase, scheduledDate:departure2, refURL:stop.refURL}, priority:stop.priority}));
    return res;
}