const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { db } = require('../../infrastructure/firestore/firestore');
const { sameDay, tsToDate } = require('../../utils/time/date');

exports.updateAllSchedules = async(stop) => {
    const stations = (await db.collection('train').get()).docs.map(doc => doc.data());
    for(let station of stations){
      await updateSchedule(station);
    } 
    //console.log(stations);
  }
  
  //{id:,JRName, dir}
  const updateSchedule = async (stop) => {
    let currentData = await (await db.collection('train').doc(stop.id).get()).data();
    let isSameDay = false;
    if(currentData.departures && currentData.departures.length !== 0){
    let currentFirstDeparture = tsToDate(currentData.departures[0]);//currentFirstDeparture
    isSameDay = sameDay(new Date(), currentFirstDeparture);
    }
    if(isSameDay)return;
  
    //should change date
    const now = new Date();
    const dateStr = `${now.getFullYear()}${now.getMonth().toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    const body = await (await fetch(`https://mydia.jr-odekake.net/cgi-bin/mydia.cgi?MODE=11&FUNC=0&EKI=${encodeURIComponent(stop.JRName)}&SENK=%E5%B1%B1%E9%99%BD%E6%9C%AC%E7%B7%9A&DIR=${encodeURIComponent(stop.dir1)}&DDIV=&CDAY=&DITD=${encodeURIComponent(stop.JRFrom+","+stop.JRTo)}&COMPANY_CODE=4&DATE=${dateStr}`)).text();
    console.log(dateStr, stop.JRName, stop.dir1);
    console.log(`https://mydia.jr-odekake.net/cgi-bin/mydia.cgi?MODE=11&FUNC=0&EKI=${encodeURIComponent(stop.JRName)}&SENK=%E5%B1%B1%E9%99%BD%E6%9C%AC%E7%B7%9A&DIR=${encodeURIComponent(stop.dir1)}&DDIV=&CDAY=&DITD=${encodeURIComponent(stop.JRFrom+","+stop.JRTo)}&COMPANY_CODE=4&DATE=20221202`);
    const $ = cheerio.load(body);
    const table = $('#weekday > tbody');
    let trs = table.children();
    trs = trs.filter((i, tr) => $(tr).find('.hour').text().trim() !== "");//get only hour columns  $(tr).find('.hour').text().trim() !== ""   //shouldn't convert to array
  
    let dates = [];
    trs.map((i, tr) => {
      let hour = Number($(tr).find('.hour').text().trim());
      let raw_mins = $(tr).find('.min');
      raw_mins.map((i, min_raw) => {
        let min = Number($(min_raw).text().trim());
        let date = new Date();
        date.setHours(hour, min, 0, 0);
        dates.push(date);
      });
    });
    
  
    await db.collection('train').doc(stop.id).update("departures", dates);
    return dates;
  }
  exports.updateSchedule = updateSchedule;