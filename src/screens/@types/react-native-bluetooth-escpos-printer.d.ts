// react-native-bluetooth-escpos-printer.d.ts
declare module 'react-native-bluetooth-escpos-printer' {
  export interface BluetoothDevice {
    name: string;
    address: string;
  }

  export interface BluetoothManager {
    isBluetoothEnabled(): Promise<boolean>;
    enableBluetooth(): Promise<void>;
    disableBluetooth(): Promise<void>;
    connectPrinter(macAddress: string): Promise<void>;
    disconnectPrinter(): Promise<void>;
    // … si vous utilisez d’autres méthodes du manager…
  }

  export interface BluetoothEscposPrinter {
    ALIGN: { LEFT: number; CENTER: number; RIGHT: number };
    printerInit(): Promise<void>;
    printerAlign(align: number): Promise<void>;
    setBlob(weight: number): Promise<void>;
    printText(text: string, options: any): Promise<void>;
    printColumn(
      columnWidths: number[],
      columnAligns: number[],
      columnTexts: string[],
      options: any
    ): Promise<void>;
    cutPaper(): Promise<void>;
    getDeviceList(): Promise<BluetoothDevice[]>;
  }

  // Default export EITHER the EscposPrinter **or** an object qui contient les deux.
  const BluetoothManager: BluetoothManager;
  const BluetoothEscposPrinter: BluetoothEscposPrinter;
  export { BluetoothManager, BluetoothEscposPrinter };
  export default { BluetoothManager, BluetoothEscposPrinter };
}
