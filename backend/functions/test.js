const request = require('request')
const cheerio = require('cheerio')
const bus = require('./api/bus/bus');
const train = require('./api/train/train');
const { db } = require('./infrastructure/firestore/firestore');
const { nextToDate } = require('./utils/time/date');
const { sortPaths, getAllPaths, updatePaths } = require('./api/path/path');

const f = async () => {
  // let stopObj = await bus.getStopObj({id:'10000842'}, {id:'36_3', name:'徳山駅前', station:'Tokuyama'});
  // console.log(stopObj);
  //let stopObj = await train.updateSchedule({JRName:'徳山', id:'Tokuyama'});//
  //let stopObj = await train.updateSchedule({JRName:'下松（山口県）', id:'Kudamatsu'});
  // let paths = await updatePaths();
  // console.log(paths[0].to.date.toLocaleString());



  // let paths = await train.getAllPaths();
  // console.log(paths[1].to.date.getHours());

  // let dates = (await (await db.collection('train').doc('Tokuyama').get()).data());
  // dates = dates.departures.map(date => new Date(date._seconds*1000));
  // console.log(dates);
  // let date = nextToDate(new Date(), dates);
  // console.log(date.toLocaleString());

  let tempPath = [
    {
      type: 'walk',
      from: { id: 'base', name: '徳山高専', date: new Date('2022-12-04T07:00:00.000Z') },
      to: {
        id: 'Kushigahama',
        name: '櫛ケ浜駅',
        date: new Date('2022-12-04T07:31:00.000Z'),
        min: 31,
        danger: 1
      },
      delay: 0,
      priority: 20,
      danger: 1,
      lastUpdate: new Date('2022-12-04T07:00:45.472Z')
    },
    {
      type: 'bus',
      from: {
        id: '10000842',
        name: '大学高専下',
        date: new Date('2022-12-04T07:18:00.000Z'),
        min: 15,
        danger: 0
      },
      route: { route: '高尾団地', terminal: '徳山駅' },
      num: '130',
      valid: true,
      detailUrl: '/trip/28_247348?seq=15#stay',
      delay: 2,
      lastUpdate: new Date('2022-12-04T07:00:46.356Z'),
      mid: {
        id: '36_3',
        name: '徳山駅前',
        date: new Date('2022-12-04T07:45:00.000Z'),
        min: 27,
        danger: 0
      },
      to: {
        id: 'Tokuyama',
        name: '徳山駅',
        date: new Date('2022-12-04T08:04:00.000Z'),
        min: 19,
        danger: 0
      },
      priority: 10,
      danger: 0
    },
    {
      type: 'bus',
      from: {
        id: '10000842',
        name: '大学高専下',
        date: new Date('2022-12-04T07:39:00.000Z'),
        min: 38,
        danger: 0
      },
      route: { route: '二番町', terminal: '徳山駅' },
      num: '120',
      valid: true,
      detailUrl: '/trip/28_55681?seq=5#stay',
      delay: 0,
      lastUpdate: new Date('2022-12-04T07:00:47.028Z'),
      mid: {
        id: '36_3',
        name: '徳山駅前',
        date: new Date('2022-12-04T08:00:00.000Z'),
        min: 21,
        danger: 0
      },
      to: {
        id: 'Tokuyama',
        name: '徳山駅',
        date: new Date('2022-12-04T08:04:00.000Z'),
        min: 4,
        danger: 1
      },
      priority: 10,
      danger: 1
    },
    {
      type: 'walk',
      from: { id: 'base', name: '徳山高専', date: new Date('2022-12-04T07:00:00.000Z') },
      to: {
        id: 'Kushigahama',
        name: '櫛ケ浜駅',
        date: new Date('2022-12-04T08:08:00.000Z'),
        min: 68,
        danger: 0
      },
      delay: 0,
      priority: 20,
      danger: 0,
      lastUpdate: new Date('2022-12-04T07:00:45.472Z')
    },
    {
      type: 'bus',
      from: {
        id: '10000843',
        name: '大学高専下',
        date: new Date('2022-12-04T07:23:00.000Z'),
        min: 22,
        danger: 0
      },
      route: { route: '二番町・高尾団地', terminal: '下松駅北口' },
      num: '43',
      valid: true,
      detailUrl: '/trip/28_247404?seq=24#stay',
      delay: 0,
      lastUpdate: new Date('2022-12-04T07:00:46.171Z'),
      mid: {
        id: '10000884',
        name: '下松駅北口',
        date: new Date('2022-12-04T07:48:00.000Z'),
        min: 25,
        danger: 0
      },
      to: {
        id: 'Kudamatsu',
        name: '下松駅',
        date: new Date('2022-12-04T08:12:00.000Z'),
        min: 24,
        danger: 0
      },
      priority: 20,
      danger: 0
    },
    {
      type: 'bus',
      from: {
        id: '10000708',
        name: '馬屋',
        date: new Date('2022-12-04T08:03:00.000Z'),
        min: 62,
        danger: 0
      },
      route: { route: '記念病院・ﾊﾞｲﾊﾟｽ・華陵高', terminal: '徳山駅' },
      num: '110-C',
      valid: true,
      detailUrl: '/trip/28_55826?seq=38#stay',
      delay: 0,
      lastUpdate: new Date('2022-12-04T07:00:46.262Z'),
      mid: {
        id: '10000041',
        name: '徳山駅前',
        date: new Date('2022-12-04T08:18:00.000Z'),
        min: 15,
        danger: 0
      },
      to: {
        id: 'Tokuyama',
        name: '徳山駅',
        date: new Date('2022-12-04T08:38:00.000Z'),
        min: 20,
        danger: 0
      },
      priority: 10,
      danger: 0
    },
    {
      type: 'bus',
      from: {
        id: '10000708',
        name: '馬屋',
        date: new Date('2022-12-04T08:22:00.000Z'),
        min: 81,
        danger: 0
      },
      route: { route: 'バイパス', terminal: '徳山駅' },
      num: '110',
      valid: true,
      detailUrl: '/trip/28_47428?seq=27#stay',
      delay: 0,
      lastUpdate: new Date('2022-12-04T07:00:46.972Z'),
      mid: {
        id: '10000041',
        name: '徳山駅前',
        date: new Date('2022-12-04T08:36:00.000Z'),
        min: 14,
        danger: 0
      },
      to: {
        id: 'Tokuyama',
        name: '徳山駅',
        date: new Date('2022-12-04T08:38:00.000Z'),
        min: 2,
        danger: 1
      },
      priority: 10,
      danger: 1
    },
    {
      type: 'bus',
      from: {
        id: '10000843',
        name: '大学高専下',
        date: new Date('2022-12-04T08:33:00.000Z'),
        min: 92,
        danger: 0
      },
      route: { route: '二番町・高尾団地', terminal: '下松駅北口' },
      valid: true,
      detailUrl: '/trip/28_247349?seq=24#stay',
      delay: 0,
      lastUpdate: new Date('2022-12-04T07:00:46.962Z'),
      mid: {
        id: '10000884',
        name: '下松駅北口',
        date: new Date('2022-12-04T08:58:00.000Z'),
        min: 25,
        danger: 0
      },
      to: {
        id: 'Kudamatsu',
        name: '下松駅',
        date: new Date('2022-12-04T09:13:00.000Z'),
        min: 15,
      },
      priority: 20,
      danger: 0
    }
  ]

  await Promise.all((await db.collection('paths').get()).docs.map(doc => doc.ref.delete()))
  await Promise.all(tempPath.map(async (path, i) => {
      db.collection('paths').doc(i+"").set(path);
  }));
  
}
f();
// request('https://busit.jp/stop/10000708?destination=10000041', (e, response, body) => {
//   if (e) {
//     console.error(e)
//   }

//   try {
//     const $ = cheerio.load(body);
//     const cardObjs = bus.getCardObjs($);
    
    
//     //  .children[0].firstChild.textContent.trim()
//     //console.log(`最新の新着情報の日付は${latestDate}です。`)
//     console.log(cardObjs);
//   } catch (e) {
//     console.error(e)
//   }
// })

