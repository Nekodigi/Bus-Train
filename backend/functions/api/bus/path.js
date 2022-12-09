const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { hhmmToDate, nextToDate, calcDangerByDistM, minDiff, tsToDate } = require('../../utils/time/date');

const { db } = require("../../infrastructure/firestore/firestore");
const { updateAllSchedules } = require("../train/train");
const { getStops } = require('./route');
const { baseUrl } = require('./const');
const { getHash } = require('../../utils/hash');

const getPaths = async ([stop, dest]) => {
  const body = await (await fetch(`${baseUrl}/stop/${dest.from}?destination=${dest.to}`)).text();
  const $ = cheerio.load(body);
  return await getCardObjs($, stop, dest);
}
exports.getPaths = getPaths;

//#region data processing
const connectStation = async(res, dest) => {
  await updateAllSchedules();
  let station = (await db.collection('train').doc(dest.station).get()).data();
  let departures = station.departures.map(departure => tsToDate(departure));
  let arrivalDate = res.mid.date;
  let departureDate =nextToDate(arrivalDate, departures);
  let min = minDiff(departureDate, arrivalDate);
  let danger = calcDangerByDistM(min, dest.distMStation);
  return [{id:dest.station, name:station.name, date:departureDate, min, danger, refURL:station.refURL}, station.priority];
}
//#endregion


//#region data format
const getCardObjs = async ($, stop, dest) => {
  const cards = $('.buscard');//.map(card => card_to_obj($, card))
  const cardObjs = [];
  let count = 0;
  for(let i = 0; i< cards.length; i++){
    let cardObj = await cardToObj($, cards[i], stop, dest, count < 2);
    if(cardObj.valid === true)count++;
    else continue;
    if(cardObj !== undefined)cardObjs.push(cardObj);
    if(count >= 2)break;//too many data is not required
  }
  return cardObjs;
}
exports.getCardObjs = getCardObjs;

const statusToObj = (raw_status) => {
  const status = {type:undefined, min:0}
  if(raw_status != ""){
    const words = raw_status.split(" ");
    if(words[0] === "Arrive"){
      status.type = "Arrive";
      if(words[1] === "in"){
        status.min = Number(words[3]);
      }else{//should be soon
        status.min = 0;
      }
    }else if(words[0] === "Departure"){
      status.type = "Departure";
      status.min = 0;
    }else if(words[0] === "渋滞中"){
      status.type = "Jam";
      status.min = Infinity;
    }
  }
  return status;
}

const cardToObj = async ($, card, stop, dest, detail) => {//should exclude 高速
  let res = {};
  let valid = true;
  //find in head(status)
  const head = $(card).find('.head');
  const fromDateRaw = hhmmToDate($(head).find('.time').text().trim());//planned_time
  const status = statusToObj($(head).find('.status').text().trim());
  if(status.type === "Jam")valid = false;
  //find in btm
  const btm = $(card).find('.btm')
  const num = $(btm).find('.num').text().trim();
  if(num === '高速')valid=false;
  const detailUrl = $(btm).find('a').attr('href');

  const route = {}
  route.route = $(btm).find('.route').text().trim();
  route.terminal = $(btm).find('.terminal').text().trim();
    
    
  //now.setHours(Number(time.split(":")[0]), Number(time.split(":")[1]), 0);
  
  let eta = new Date();
  eta.setMinutes(eta.getMinutes()+status.min, 0, 0);
  status.delay = (eta-fromDateRaw)/(60*1000);//min
  let fromDate = new Date(fromDateRaw);
  let min1 = minDiff(fromDate, new Date());
  let danger1 = calcDangerByDistM(min1, stop.distMBase, false);
  fromDate.setMinutes(fromDate.getMinutes()+Math.max(status.delay, 0), 0, 0);

  let from = {id:dest.from, name:stop.name, scheduledDate:fromDateRaw, date:fromDate, min:min1, danger:danger1}
  
  let hash = getHash(from.id+fromDateRaw);//
  res = {type:"bus", from, route, num, valid, delay:Math.max(0, status.delay), hash, lastUpdate:new Date()};//status

  if(!valid)return res;
  //post-processing
  
  if(detail){
    let stopObjs = (await getStops(detailUrl)).stopObjs;
    let mid_ = stopObjs.find(stopObj => stopObj.name === dest.name);
    let midDateRaw = mid_.time;
    let midDate = new Date(midDateRaw);//delay already applied
    let min2 = minDiff(midDateRaw, fromDateRaw);
    let danger2 = 0;
    if(status.delay > 5)danger2=1;
    midDate.setMinutes(midDate.getMinutes()+res.delay, 0, 0);
    res.mid = {id:dest.to, name:mid_.name, scheduledDate:midDateRaw , date:midDate, min:min2, danger:danger2, refURL:baseUrl+detailUrl};

    [res.to, res.priority] = await connectStation(res, dest);
    res.danger = Math.max(res.from.danger, res.mid.danger, res.to.danger);
  }

  return res;
}

exports.updateInvalidPath = async (path) => {//update path data which is already departure (for delay)
  if(path.type === "bus" && path.valid === false){
    //
    console.log(path.from.name, tsToDate(path.from.date).toLocaleTimeString());

    let res = await getStops(path.mid.refURL.substring(16));
    path.delay = res.delay;
    let midDate = tsToDate(path.mid.scheduledDate);
    midDate.setMinutes(midDate.getMinutes()+path.delay);
    path.mid.date = midDate;
    let toMin = minDiff(tsToDate(path.to.date), midDate);
    path.to.min = toMin;
    console.log(toMin);
    console.log(path.delay);
  }
  return path;
}
//#endregion