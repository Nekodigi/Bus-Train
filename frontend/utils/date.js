

module.exports.tohhmm = (date) => {
    const hhmm = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return hhmm;
}

module.exports.toDate = (TimeStamp) => {
    return new Date(TimeStamp.seconds*1000);
}

module.exports.minDiff = (a, b) => Math.floor((a-b)/(1000*60));