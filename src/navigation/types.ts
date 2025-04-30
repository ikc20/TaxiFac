
export interface BluetoothDevice {
    name: string;
    address: string;
  }
  
  export interface TicketData {
    nom: string;
    immat: string;
    stat: string;
    debut: string;
    fin: string;
    prixCourse: string;
    supplement: string;
    tva: string;
  }
  
  export type RootStackParamList = {
    ScanPrinterScreen: undefined;
    PrinterSelectionScreen: { device: BluetoothDevice };
    TicketFormScreen: { device: BluetoothDevice };
    PreviewAndPrintScreen: { ticketData: TicketData; device: BluetoothDevice };
  };
  