import {
  BluetoothManager,
  BluetoothEscposPrinter,
} from 'react-native-bluetooth-escpos-printer';
import EscPosPrinter from 'react-native-bluetooth-escpos-printer';
const { BluetoothManager, BluetoothEscposPrinter } = EscPosPrinter;

export const handlePrint = async () => {
  try {
    // Activer Bluetooth
    const devices = await BluetoothManager.enableBluetooth();
    const pairedDevices = [];

    for (const item of devices) {
      try {
        pairedDevices.push(JSON.parse(item));
      } catch (e) {
        console.warn('Erreur de parsing appareil:', e);
      }
    }

    console.log('Appareils appairés:', pairedDevices);

    if (pairedDevices.length === 0) {
      alert('Aucune imprimante Bluetooth appairée.');
      return;
    }

    const selectedDevice = pairedDevices[0]; // sélectionne le premier appareil
    console.log('Connexion à:', selectedDevice);

    // Connexion
    await BluetoothManager.connect(selectedDevice.address);

    // Impression
    await BluetoothEscposPrinter.printText("🧾 Hello World\n\r", {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 2,
      heigthtimes: 2,
      fonttype: 1,
    });

    console.log('✅ Impression terminée');
  } catch (error) {
    console.error('❌ Erreur impression:', error);
    alert('Erreur impression: ' + (error?.message || error));
  }
};
