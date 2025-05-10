// req
const {getAllData,getServedNotificationData} = require('./utils/dataserver');
const {initializeWwebjs,wwebClientInfo} = require('./utils/wwebbridge');
const {findPropertyByPrefix} = require('./utils/common');
const { log } = require('console');

// var
let allData;

// get the data ready
(async () => {
    allData = await getAllData();
    getServedNotificationData(allData);
})().then(()=>{ 
    console.log('[Whatsapp Client] - preparing...');  
    initializeWwebjs();
});



// const data = {
//     tgl_tempo : Date.now(),
//     kelompok : 'mawar',
//     total : currencyFormat(1500000)
// }

// let stri = process.env.FORMAT_H12;
// console.log(convertToInterpolationString(stri,data));
// console.log(convertToInterpolationString(process.env.FORMAT_AR));

// make whatsapp connected
// --wwebbridge
// -------------------------
// initializeWwebjs();

// check notifications job today, has done ?
    // if not done yet, iterate notifications job
    // 
    // 