/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import BluetoothEscposPrinter from 'react-native-bluetooth-escpos-printer';

const PreviewAndPrintScreen = ({ route }: any) => {
  const { ticketData, device } = route.params;
  const [isPrinting, setIsPrinting] = React.useState(false);

  const printTicket = async () => {
    setIsPrinting(true);
    try {
      await BluetoothEscposPrinter.connectPrinter(device.address);

      // Configuration de l'imprimante
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.setBlob(0);

      // Impression du ticket
      await BluetoothEscposPrinter.printText('TICKET CLIENT\n\n', {});
      await BluetoothEscposPrinter.printText('NOTE DE TAXI\n\n', {});

      // Détails du client
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
      await BluetoothEscposPrinter.printText(`NOM: ${ticketData.nom}\n`, {});
      await BluetoothEscposPrinter.printText(`IMMAT: ${ticketData.immat}\n`, {});
      await BluetoothEscposPrinter.printText(`STAT: ${ticketData.stat}\n\n`, {});

      // Horaires
      await BluetoothEscposPrinter.printText(`DEBUT: ${ticketData.debut}\n`, {});
      await BluetoothEscposPrinter.printText(`FIN: ${ticketData.fin}\n\n`, {});

      // Montants
      await BluetoothEscposPrinter.printText('DÉTAIL DU PAIEMENT\n', {});
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Prix course:', `${ticketData.prixCourse}€`],
        {}
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Supplément:', `${ticketData.supplement}€`],
        {}
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['TVA:', `${ticketData.tva}%`],
        {}
      );

      // Total
      await BluetoothEscposPrinter.printText('\n', {});
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['TOTAL:', `${(parseFloat(ticketData.prixCourse) + parseFloat(ticketData.supplement)).toFixed(2)}€`],
        { weight: 1 }
      );

      // Coupure du papier
      await BluetoothEscposPrinter.printText('\n\n\n\n', {});
      await BluetoothEscposPrinter.cutPaper();

      Alert.alert('Succès', 'Ticket imprimé avec succès');
    } catch (error) {
      console.error('Print error:', error);
      Alert.alert('Erreur', `Échec de l'impression: ${error.message}`);
    } finally {
      setIsPrinting(false);
      try {
        await BluetoothEscposPrinter.disconnectPrinter();
      } catch (e) {
        console.warn('Déconnexion échouée:', e);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Aperçu du Ticket</Text>

      <View style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 10 }}>
        {/* Aperçu du ticket similaire à ce qui sera imprimé */}
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>TICKET CLIENT</Text>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>NOTE DE TAXI</Text>
        <Text>{`\nNOM: ${ticketData.nom}`}</Text>
        <Text>{`IMMAT: ${ticketData.immat}`}</Text>
        <Text>{`STAT: ${ticketData.stat}\n`}</Text>
        <Text>{`DEBUT: ${ticketData.debut}`}</Text>
        <Text>{`FIN: ${ticketData.fin}\n`}</Text>
        <Text>{`PRIX COURSE: ${ticketData.prixCourse}€`}</Text>
        <Text>{`SUPPLEMENT: ${ticketData.supplement}€`}</Text>
        <Text>{`TVA: ${ticketData.tva}%`}</Text>
        <Text>{`\nTOTAL: ${(parseFloat(ticketData.prixCourse) + parseFloat(ticketData.supplement)).toFixed(2)}€`}</Text>
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
