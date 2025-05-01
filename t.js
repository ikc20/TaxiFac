import { BluetoothManager, BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';

export const handlePrint = async () => {
  try {
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

    const selectedDevice = pairedDevices.find((d) => d.name === 'PT-210') || pairedDevices[0];
    console.log('Connexion à:', selectedDevice);

    await BluetoothManager.connect(selectedDevice.address);

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
