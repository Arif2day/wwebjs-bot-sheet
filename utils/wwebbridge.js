const {Client,LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const {convertToInterpolationString,formatDate,findPropertyByPrefix} = require('./common');
const dotenv = require('dotenv');
const { logNotificationHistory } = require('./logger');
const {notifierLoop} = require('./notifier');
const { log } = require('console');
const { readJSON, logFilePath, writeJSON } = require('./jsonLogger');
dotenv.config({ path: path.join( __dirname,'../', '.env') });

// var

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth()
});

// run (only once) when the client is ready
client.once('ready',async()=>{
    console.log('[Whatsapp Client] - is ready!');  
    const today = new Date();
    
    
    try {        
        var dataSource = readJSON(logFilePath());
        var unprocessed = dataSource.filter((e)=>{
            return e.notif_status == false
        });
        console.log('\n');
        console.log('----------------------------------------------------------');
        console.log('Notifikasi Total                     : ',dataSource.length);
        console.log('Notifikasi Terkirim                  : ',dataSource.filter(e=> e.notif_status==true).length);
        console.log('Notifikasi Menunggu Proses antrian   : ',dataSource.filter(e=> e.notif_status==false).length);
        console.log('----------------------------------------------------------');
        unprocessed.length>0?
        console.log('[Data Source] - ready to access...'):
        console.log('[Data Source] - nothing to process...');
        
        await notifierLoop(unprocessed,async (item,index)=>{       
            // console.log(formatDate(new Date(item.tgl_tempo),2));    
            var format,type;
            console.log((index+1)+' of '+(unprocessed.length));
            if(item.type_notif=='Notifikasi Tunggakan'){
                if(item.last_due_date<formatDate(today)){
                    //F_T2
                    type = "Tunggakan lama" 
                    format = process.env.FORMAT_T2                    
                }else{
                    //F_T1
                    type = "Tunggakan bulan lalu" 
                    format = process.env.FORMAT_T1
                }
            }else{
                if(item.tgl_tempo==formatDate(today)){
                    //F_H0
                    type = "H-0" 
                    format = process.env.FORMAT_H0
                }else{
                    //F_H-2
                    type = "H-2" 
                    format = process.env.FORMAT_HM2
                }
            }
            var message = convertToInterpolationString(format,item)
            var number = findPropertyByPrefix(item,'whatsapp_')
            // console.log(message);
            await sendMsg(number,message)
            // log file
            logNotificationHistory(`${item.type_notif} kelompok ${item.kelompok} (${type}) dikirim ke ${item.send_to} - ${number}`);
            console.log(`[Notification] - ${item.type_notif} kelompok ${item.kelompok} (${type}) dikirim ke ${item.send_to} - ${number}`);
            

            // update json log                        
            // Synchronously write the updated data back to the JSON file
            dataSource[index].notif_status = true
            writeJSON(logFilePath(),dataSource,`[Data Source] - berhasil diupdate!`);
            console.log('----------------------------------------------------------');
            console.log('Notifikasi Total                     : ',dataSource.length);
            console.log('Notifikasi Terkirim                  : ',dataSource.filter(e=> e.notif_status==true).length);
            console.log('Notifikasi Menunggu Proses antrian   : ',dataSource.filter(e=> e.notif_status==false).length);
            console.log('----------------------------------------------------------');
        });
        
        console.log('\n[Data Source] - no more notification to proccess...');
    } catch (error) {
        console.log(error);
    }
});

// Received QR-Code
client.on('qr',(qr)=>{
    console.log('[Whatsapp Client] - QR RECEIVED',qr);
    qrcode.generate(qr,{small:true});
})

// client whatsapp listen on message to auto reply info
client.on('message', async msg => {
    if(!msg.isStatus)
    {
        if(!(await msg.getChat()).isGroup)
        {
             {
                // console.log(`${JSON.stringify(await msg.getContact())}`);
                // console.log(`PESAN== ${msg.body}`);
                // console.log(`BROAD== ${msg.broadcast}`);
                // console.log(`STTUS== ${msg.isStatus}`);
                // console.log(`GROUP== ${(await msg.getChat()).isGroup}`);
             }
            
            if (msg.body.toUpperCase() == 'INFO') {
                setTimeout(async() => {
                    await (await msg.getChat()).sendStateTyping().then(async()=>{
                        msg.reply(convertToInterpolationString(process.env.FORMAT_AR,{enter:'\n'}))
                        .then(async()=>{
                            logNotificationHistory(`Auto Reply to ${(await msg.getContact()).number}`);
                        });
                        console.log(`[Auto Replying] - to ${(await msg.getContact()).number}`);
                    });
                }, Number(process.env.DELAY_AR));
            }
        }    
    }    
});

// Direct send message
function sendMsg(number,message){
    client.sendMessage(number, message);
}

//initialize client
async function initializeWwebjs() {
    try {
        await client.initialize();
        console.log('[Whatsapp Client] - Yay, Whatsapp Client initialized successfully.');
    } catch (error) {
        if(error.message.includes('net::ERR_INTERNET_DISCONNECTED')){
            console.error('[Whatsapp Client] - Oops, Internet Connection Lost.');
        }else{
            console.error('[Whatsapp Client] - Oops, ', error.message);
        }
    }
}

async function wwebClientInfo() {
    return await client.getState();
}

module.exports = {
    initializeWwebjs: initializeWwebjs,
    sendMsg: sendMsg,
    wwebClientInfo:wwebClientInfo
};