const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { hhmmToDate, nextToDate, minDiff, tsToDate, addMin } = require('../../utils/time/date');

const { db } = require("../../infrastructure/firestore/firestore");
const { updateAllSchedules } = require("../train/train");
const { getStops } = require('./route');
const { baseUrl } = require('./const');
const { complementPath } = require('../path/update');

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
  let arrivalDate = addMin(res.mid.scheduledDate, res.delay);
  let departureDate =nextToDate(arrivalDate, departures);
  return [{id:dest.station, name:station.name, scheduledDate:departureDate, distM:dest.distMStation, refURL:station.refURL}, station.priority];
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
  const fromDate = hhmmToDate($(head).find('.time').text().trim());//planned_time
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
  
  let eta = addMin(new Date(), status.min);
  let delay = Math.max(0, minDiff(eta, fromDate));

  let from = {id:dest.from, name:stop.name, scheduledDate:fromDate, distM:stop.distMBase,  route, num}
  
  res = {type:"bus", from, valid, delay};//status

  if(!valid)return res;
  //post-processing
  
  if(detail){
    let stopObjs = (await getStops(detailUrl)).stopObjs;
    let mid_ = stopObjs.find(stopObj => stopObj.name === dest.name);
    res.mid = {id:dest.to, name:mid_.name, scheduledDate:mid_.time, refURL:baseUrl+detailUrl};
    [res.to, res.priority] = await connectStation(res, dest);
  }

  return await complementPath(res);
}
//#endregion

//#region data update
exports.updateInvalidPath = async (path) => {//update path data which is already departure (for delay)
  if(path.type === "bus" && path.valid === false){
    //
    console.log(path.from.name, tsToDate(path.from.date).toLocaleTimeString());

    let res = await getStops(path.mid.refURL.substring(16));
    path.delay = Math.max(0, res.delay);
    path = complementPath(path);
  }
  return path;
}
//#endregion