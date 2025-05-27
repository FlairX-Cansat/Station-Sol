import { SerialPort } from 'serialport';

const port = new SerialPort({
  path: '/dev/cu.usbserial-240', // adapte si nécessaire
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  autoOpen: false
});

port.open((err) => {
  if (err) {
    return console.error('Erreur à l’ouverture :', err.message);
  }
  console.log('Port série ouvert. Envoi de "RD"...');

  // Donne le temps au module d'entrer en mode config
  setTimeout(() => {
    port.write('RD\r\n', (err) => {
      if (err) return console.error('Erreur à l’écriture :', err.message);
      console.log('Commande "RD" envoyée.');
    });
  }, 100); // petit délai de sécurité
});

port.on('data', (data) => {
  console.log('Réponse du module :', data.toString().trim());
});

port.on('error', (err) => {
  console.error('Erreur série :', err.message);
});