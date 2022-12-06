

module.exports.tohhmm = (date) => {
    const hhmm = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return hhmm;
}

module.exports.toDate = (raw) => {//should varidate for already converted data
    if(raw.seconds === undefined)return new Date(raw);
    else return new Date(raw.seconds*1000);
}

module.exports.minDiff = (a, b) => Math.floor((a-b)/(1000*60));