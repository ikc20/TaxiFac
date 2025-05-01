// src/navigation/types.ts
export type TicketData = {
  nom: string;
  immat: string;
  stat: string;
  debut: string;
  fin: string;
  prixCourse: string;
  supplement: string;
  tva: string;
};

export type RootStackParamList = {
  ScanPrinterScreen: undefined;
  TicketFormScreen: { device: BluetoothDevice };
  PreviewAndPrintScreen: {
    ticketData: TicketData;
    device: BluetoothDevice;
  };
};

// Pour que TypeScript résolve BluetoothDevice :
import type { BluetoothDevice } from 'react-native-bluetooth-escpos-printer';
