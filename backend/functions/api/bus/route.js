const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { hhmmToDate, midDate } = require('../../utils/time/date');
const { baseUrl } = require('./const');

const getStops = async (url) => {
  const body = await (await fetch(baseUrl+url)).text();
  //const seq = new URL(baseUrl+url).searchParams; //current seq
  const $ = cheerio.load(body);

  const stops = $('.bstop_name');
  const stopObjs = [];
  for(let i=0; i<stops.length; i++){
    const stop = stops[i];
    const time = hhmmToDate($(stop).find('.arv_time').text().trim());
    const name = $(stop).find('.StopName').text().trim();
    let id = $(stop).find('a').attr('href');
    if(id != undefined)id = id.split('/')[2];
    stopObjs.push({time, name, id});
  }

  const stopsChildren = $(".routeBox01 > ul").children();
  let currentStop = -1;
  stopsChildren.map((i, stop) => {
    //console.log(stop.attribs.class);
    if($(stop).find(".bus_now").length === 1)currentStop=i;
    
  });
  //console.log(currentStop);//0 2  
  const lowStop = Math.ceil(currentStop/2);
  //console.log(lowStop);
  let timeShouldBe = currentStop === -1 ? undefined : currentStop%2 === 0 ? stopObjs[lowStop].time : midDate(stopObjs[lowStop].time, stopObjs[lowStop+1].time);
  let delay = currentStop === -1 ? undefined : Math.round((new Date() - timeShouldBe)/(60*1000));
  // console.log(stopObjs);
  // console.log(timeShouldBe);
  // console.log(delay);
    

  
  return {stopObjs, delay};
}
exports.getStops = getStops;