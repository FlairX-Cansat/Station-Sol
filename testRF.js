import { ReadlineParser, SerialPort } from 'serialport';
import { createInterface } from 'readline';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

import 'dotenv/config';

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const serialport = new SerialPort({ path: '/dev/cu.usbserial-240', baudRate: 9600, autoOpen: false, flowControl: false });
const parser = serialport.pipe(new ReadlineParser({ delimiter: '\r\n'}));

let missionName;
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Nom de la mission : ', async (answer) => {
    missionName = answer;
    serialport.open((err) => {
        if (err) {
            console.error('Erreur d\'ouverture du port :', err);
            return;
        }

        console.log('Port série ouvert');
        // Une fois ouvert, on peut manipuler les lignes RTS
        serialport.set({ rts: true }, (err) => {
            if (err) {
                console.error('Erreur lors de la configuration RTS :', err);
                return;
            }
            console.log('RTS est maintenant à HIGH');
        });
    });
});

parser.on('data', async (data) => {
    console.log("Data : " + data);
    const values = data.split(';');
    values.forEach((value, index) => {
        console.log(`Valeur ${index + 1} : ${value}`);
    });
});