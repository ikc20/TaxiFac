/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';

// Déclaration TypeScript pour le module
declare module 'react-native-bluetooth-escpos-printer' {
  interface BluetoothEscposPrinter {
    connectPrinter(macAddress: string): Promise<void>;
    disconnectPrinter(): Promise<void>;
    printerAlign(align: number): Promise<void>;
    setBlob(weight: number): Promise<void>;
    printText(text: string, options: any): Promise<void>;
    cutPaper(): Promise<void>;
  }

  const BluetoothEscposPrinter: BluetoothEscposPrinter;
  export default BluetoothEscposPrinter;
}

const ALIGN = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2,
};

const PreviewAndPrintScreen = ({ route }: any) => {
  const { ticketData, device } = route.params;
  const [isPrinting, setIsPrinting] = React.useState(false);

  const {
    nom,
    immat,
    stat,
    debut,
    fin,
    prixCourse,
    supplement,
    tva,
  } = ticketData;

  const total = (parseFloat(prixCourse) + parseFloat(supplement)).toFixed(2);
  const montantTVA = ((parseFloat(total) * parseFloat(tva)) / (100 + parseFloat(tva))).toFixed(2);

  const printTicket = async () => {
    setIsPrinting(true);
    try {
      const BluetoothEscposPrinter = require('react-native-bluetooth-escpos-printer').default;

      await BluetoothEscposPrinter.connectPrinter(device.id);
      await BluetoothEscposPrinter.printerAlign(ALIGN.CENTER);
      await BluetoothEscposPrinter.setBlob(0);

      // En-tête
      await BluetoothEscposPrinter.printText('TICKET CLIENT\n', {});
      await BluetoothEscposPrinter.printText('NOTE DE TAXI\n\n', {});

      // Informations client
      await BluetoothEscposPrinter.printText(`NOM: ${nom}\n`, {});
      await BluetoothEscposPrinter.printText(`IMMAT: ${immat}\n`, {});
      await BluetoothEscposPrinter.printText(`STAT: ${stat}\n\n`, {});

      // Horaires
      await BluetoothEscposPrinter.printText(`DEBUT: ${debut}\n`, {});
      await BluetoothEscposPrinter.printText(`FIN: ${fin}\n\n`, {});

      // Prix
      await BluetoothEscposPrinter.printText(`PRIX COURSE €       ${prixCourse}\n`, {});
      await BluetoothEscposPrinter.printText('(TTC HORS SUPPLEMENTS)\n\n', {});

      // Suppléments
      await BluetoothEscposPrinter.printText('SUPPLEMENTS\n', {});
      await BluetoothEscposPrinter.printText(`1Ap. reserv. €       ${supplement}\n\n`, {});

      // Total
      await BluetoothEscposPrinter.printText(`A PAYER TTC €        ${total}\n`, {});
      await BluetoothEscposPrinter.printText(`DONT TVA ${tva}%         ${montantTVA}\n\n`, {});

      // Coupure du papier
      await BluetoothEscposPrinter.printText('\n\n\n\n', {});
      await BluetoothEscposPrinter.cutPaper();

      Alert.alert('Succès', 'Ticket imprimé avec succès');
    } catch (error) {
      console.error('Erreur impression:', error);
      Alert.alert('Erreur', 'Impression échouée. Vérifiez la connexion Bluetooth.');
    } finally {
      setIsPrinting(false);
      try {
        const BluetoothEscposPrinter = require('react-native-bluetooth-escpos-printer').default;
        await BluetoothEscposPrinter.disconnectPrinter();
      } catch (e) {
        console.warn('Erreur déconnexion:', e);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Aperçu du Ticket</Text>

      <View style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 10 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>TICKET CLIENT</Text>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>NOTE DE TAXI</Text>
        <Text>{`\nNOM: ${nom}`}</Text>
        <Text>{`IMMAT: ${immat}`}</Text>
        <Text>{`STAT: ${stat}\n`}</Text>
        <Text>{`DEBUT: ${debut}`}</Text>
        <Text>{`FIN: ${fin}\n`}</Text>
        <Text>{`PRIX COURSE €       ${prixCourse}`}</Text>
        <Text>(TTC HORS SUPPLEMENTS)</Text>
        <Text>{`\nSUPPLEMENTS\n1Ap. reserv. €       ${supplement}`}</Text>
        <Text>{`\nA PAYER TTC €        ${total}`}</Text>
        <Text>{`DONT TVA ${tva}%         ${montantTVA}\n`}</Text>
      </View>

      <TouchableOpacity
        onPress={printTicket}
        disabled={isPrinting}
        style={{
          backgroundColor: isPrinting ? '#cccccc' : '#4CAF50',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginTop: 30,
        }}
      >
        {isPrinting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Imprimer</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PreviewAndPrintScreen;
