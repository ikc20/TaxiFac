// // src/navigation/types.ts
// export type TicketData = {
//   nom: string;
//   immat: string;
//   stat: string;
//   debut: string;
//   fin: string;
//   prixCourse: string;
//   supplement: string;
//   tva: string;
// };

// export type BluetoothDevice = {
//   name: string;
//   address: string;
// };

// export type RootStackParamList = {
//   ScanPrinterScreen: undefined;
//   TicketFormScreen: { device?: BluetoothDevice };
//   PreviewAndPrintScreen: { ticketData: TicketData; device?: BluetoothDevice };
// };


export type RootStackParamList = {
  ScanPrinterScreen: undefined;
  TicketFormScreen: { device: BluetoothDevice };
  PreviewAndPrintScreen: { ticketData: TicketData; device: BluetoothDevice };
};

export type BluetoothDevice = {
  name: string;
  address: string;
};

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
