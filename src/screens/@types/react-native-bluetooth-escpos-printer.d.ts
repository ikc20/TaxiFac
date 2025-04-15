declare module 'react-native-bluetooth-escpos-printer' {
    interface BluetoothEscposPrinter {
      connectPrinter(macAddress: string): Promise<void>;
      disconnectPrinter(): Promise<void>;
      printerAlign(align: number): Promise<void>;
      setBlob(weight: number): Promise<void>;
      printText(text: string, options: any): Promise<void>;
      cutPaper(): Promise<void>;
    }

    const ALIGN: {
      LEFT: number;
      CENTER: number;
      RIGHT: number;
    };

    const BluetoothEscposPrinter: BluetoothEscposPrinter;
    export default BluetoothEscposPrinter;
    export { ALIGN };
  }
