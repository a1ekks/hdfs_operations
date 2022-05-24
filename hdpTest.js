const ENV_CONFIG = require('config');

const fs = require('fs');
const {HdpStorage} = require("./MediaStorages/HdpStorage/HdpStorage");
const {HdpConfig} = require("./MediaStorages/HdpStorage/HdpConfig");
const {AxiosHttpClient} = require("./MediaStorages/HttpClients/AxiosHttpClient");
const hadoopConfig = ENV_CONFIG.get("Hadoop")

const axiosHttpClient = new AxiosHttpClient()
const hdpConfig = new HdpConfig(hadoopConfig.host, hadoopConfig.port, hadoopConfig.user)


console.log(hadoopConfig)

// Since Hadoop 3.0.0 - Alpha 1
// Namenode ports: 50470 --> 9871, 50070 --> 9870, 8020 --> 9820
// Secondary NN ports: 50091 --> 9869, 50090 --> 9868
// Datanode ports: 50020 --> 9867, 50010 --> 9866, 50475 --> 9865, 50075 --> 9864
// //

const hdpStorage = new HdpStorage(hdpConfig, axiosHttpClient);


function readFileFS(localFilePath){
    try {
        return fs.readFileSync(localFilePath);
    }
    catch (err) {
        console.error(`Something went wrong with reading file: ${localFilePath}, error: ${err}`);
    }
}
const haddopNewDir = 'ttestt888'
//
hdpStorage.makeDir(haddopNewDir).then(res => console.log(res)).catch(err => console.error(err));
hdpStorage.isExists(haddopNewDir).then(res => console.log(res)).catch(err => console.error(err));

const tt = readFileFS(localFilePath='./testFiles/test1.png')
hdpStorage.createFile(`${haddopNewDir}/index111.png`, fileData=tt).then(res => console.log(res)).catch(err => console.error(err));
hdpStorage.createFile(`${haddopNewDir}/index222.png`, fileData=tt).then(res => console.log(res)).catch(err => console.error(err));

const tt1 = readFileFS(localFilePath='./testFiles/test1.json');
const tt2 = readFileFS(localFilePath='./testFiles/test2.json');
const tt3 = readFileFS(localFilePath='./testFiles/test3.json');

hdpStorage.createFile(`${haddopNewDir}/tst1.json`, fileData=tt1).then(res => console.log(res)).catch(err => console.error(err));
hdpStorage.createFile(`${haddopNewDir}/tst2.json`, fileData=tt2).then(res => console.log(res)).catch(err => console.error(err));
hdpStorage.createFile(`${haddopNewDir}/tst3.json`, fileData=tt3).then(res => console.log(res)).catch(err => console.error(err));


// concat
// hdpStorage.concatOrdered('ttestt1777/tst1.json', ['ttestt1777/tst1.json', 'ttestt1777/tst2.json', 'ttestt1777/tst3.json']).then(res => console.log(res)).catch(err => console.error(err));


// hdpStorage.rename('ttestt1777/tst1.json', 'ttestt1777/tst9.json').then(res => console.log(res)).catch(err => console.error(err));


// hdpStorage.readFile('ttestt1777/tst9.json').then(res => console.log(res)).catch(err => console.error(err));

// hdpStorage.deleteFile('ttestt1777/index111.png').then(res => console.log(res)).catch(err => console.error(err));
// hdpStorage.isExists('ttestt1777/index111.png').then(res => console.log(res)).catch(err => console.error(err));

// hdpStorage.deleteFile('ttestt1777/index222.png').then(res => console.log(res)).catch(err => console.error(err));
// hdpStorage.deleteFile('ttestt1777/tst9.json').then(res => console.log(res)).catch(err => console.error(err));
// hdpStorage.deleteFile(haddopNewDir).then(res => console.log(res)).catch(err => console.error(err));
// hdpStorage.isExists(haddopNewDir).then(res => console.log(res)).catch(err => console.error(err));

