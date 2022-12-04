
module.exports.minDiff = (a, b) => Math.floor((a-b)/(1000*60));

module.exports.calcDangerByDistM = (min, distM, isBus=true) => {
  if(min<distM)return 2;
  else if(min<(distM*2+(isBus?5:0)))return 1;
  else return 0;
}

module.exports.sameDay = (a, b) => {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() == b.getFullYear();
}

module.exports.hhmmToDate = (hhmm) => {
  let date = new Date();
  date.setHours(Number(hhmm.split(":")[0]), Number(hhmm.split(":")[1]), 0, 0);
  return date;
}

module.exports.tsToDate = (TimeStamp) => {//firestore date format, timestamp to date.
  return new Date(TimeStamp._seconds*1000);
}

//return nearest date in array after a
module.exports.nextToDate = (a, array) => {
  let min = Infinity;
  let minDate = undefined;
  array.forEach(date => {
    if(date < a)return;
    let diff = date-a;
    if(diff < min){
      min = diff;
      minDate = date;
    }
  })
  return minDate;
}