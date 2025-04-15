import {
    BluetoothManager,
    BluetoothEscposPrinter,
  } from 'react-native-bluetooth-escpos-printer';

  const handlePrint = () => {
    BluetoothManager.enableBluetooth().then((r) => {
      var paired = [];

      if (r && r.length > 0) {
        for (var i = 0; i < r.length; i++) {
          try {
            paired.push(JSON.parse(r[i])); // need to parse the device information
          } catch (e) {
            // ignore
          }
        }
      }

      console.log(JSON.stringify(paired));
    }, (err) => {
      // eslint-disable-next-line no-alert
      alert(err);
    });

    BluetoothManager.isBluetoothEnabled().then((enabled) => {
      console.log(enabled);
      BluetoothManager.connect('DC:0D:30:F2:02:E9')
        .then(async (s) => {
          // Remplacer press() par une impression
          await BluetoothEscposPrinter.printText('Hello World\n\r', {});
        });
    });
  };
