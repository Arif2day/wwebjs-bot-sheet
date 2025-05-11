const {getAllData,getServedNotificationData} = require('./utils/dataserver');
const {initializeWwebjs,wwebClientInfo} = require('./utils/wwebbridge');
const {findPropertyByPrefix} = require('./utils/common');
const { log } = require('console');

let allData;

(async () => {
    allData = await getAllData();
    getServedNotificationData(allData);
})().then(()=>{ 
    console.log('[Whatsapp Client] - preparing...');  
    initializeWwebjs();
});