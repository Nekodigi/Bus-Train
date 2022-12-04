const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { baseUrl } = require('./const');

const getStops = async (url, dest) => {
  const body = await (await fetch(baseUrl+url)).text();
  //const seq = new URL(baseUrl+url).searchParams; //current seq
  const $ = cheerio.load(body);
  const stops = $('.bstop_name');
  const stopObjs = [];
  for(let i=0; i<stops.length; i++){
    const stop = stops[i];
    const time = $(stop).find('.arv_time').text().trim();
    const name = $(stop).find('.StopName').text().trim();
    let id = $(stop).find('a').attr('href');
    if(id != undefined)id = id.split('/')[2];
    stopObjs.push({time, name, id});
  }
  return stopObjs;
}
exports.getStops = getStops;