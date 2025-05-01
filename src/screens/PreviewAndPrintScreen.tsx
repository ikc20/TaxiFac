// src/screens/PreviewAndPrintScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothDevice,
} from 'react-native-bluetooth-escpos-printer';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, TicketData } from '../navigation/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'PreviewAndPrintScreen'
>;

const PreviewAndPrintScreen = ({ route }: Props) => {
  const { ticketData, device } = route.params as {
    ticketData: TicketData;
    device: BluetoothDevice;
  };
  const [isPrinting, setIsPrinting] = React.useState(false);

  const printTicket = async () => {
    setIsPrinting(true);
    try {
      // 1️⃣ Connexion via BluetoothManager
      await BluetoothManager.connectPrinter(device.address);

      // 2️⃣ Initialisation et alignement
      await BluetoothEscposPrinter.printerInit();
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER
      );
      await BluetoothEscposPrinter.setBlob(0);

      // 3️⃣ Contenu du ticket
      await BluetoothEscposPrinter.printText('TICKET CLIENT\n\n', {});
      await BluetoothEscposPrinter.printText('NOTE DE TAXI\n\n', {});
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT
      );

      await BluetoothEscposPrinter.printText(
        `NOM: ${ticketData.nom}\n`,
        {}
      );
      await BluetoothEscposPrinter.printText(
        `IMMAT: ${ticketData.immat}\n`,
        {}
      );
      await BluetoothEscposPrinter.printText(
        `STAT: ${ticketData.stat}\n\n`,
        {}
      );
      await BluetoothEscposPrinter.printText(
        `DEBUT: ${ticketData.debut}\n`,
        {}
      );
      await BluetoothEscposPrinter.printText(
        `FIN: ${ticketData.fin}\n\n`,
        {}
      );
      await BluetoothEscposPrinter.printText(
        'DÉTAIL DU PAIEMENT\n',
        {}
      );

      const prix = parseFloat(ticketData.prixCourse) || 0;
      const supplement = parseFloat(ticketData.supplement) || 0;
      const tva = parseFloat(ticketData.tva) || 0;
      const total = (prix + supplement).toFixed(2);

      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Prix course:', `${prix.toFixed(2)}€`],
        {}
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Supplément:', `${supplement.toFixed(2)}€`],
        {}
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['TVA:', `${tva}%`],
        {}
      );

      await BluetoothEscposPrinter.printText('\n', {});
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['TOTAL:', `${total}€`],
        { weight: 1 }
      );

      // 4️⃣ Fin et coupe
      await BluetoothEscposPrinter.printText('\n\n\n\n', {});
      await BluetoothEscposPrinter.cutPaper();

      Alert.alert('Succès', 'Ticket imprimé avec succès');
    } catch (error: any) {
      console.error('Erreur impression:', error);
      Alert.alert('Erreur', error?.message || 'Échec de l’impression');
    } finally {
      setIsPrinting(false);
      // 5️⃣ Déconnexion via BluetoothManager
      try {
        await BluetoothManager.disconnectPrinter();
      } catch (e) {
        console.warn('Déconnexion échouée:', e);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>
        Aperçu du Ticket
      </Text>
      {/* Affichage du résumé du ticket */}
      <View
        style={{
          backgroundColor: '#f5f5f5',
          padding: 16,
          borderRadius: 10,
        }}
      >
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
          TICKET CLIENT
        </Text>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
          NOTE DE TAXI
        </Text>
        <Text>{`\nNOM: ${ticketData.nom}`}</Text>
        <Text>{`IMMAT: ${ticketData.immat}`}</Text>
        <Text>{`STAT: ${ticketData.stat}\n`}</Text>
        <Text>{`DEBUT: ${ticketData.debut}`}</Text>
        <Text>{`FIN: ${ticketData.fin}\n`}</Text>
        <Text>{`PRIX COURSE: ${ticketData.prixCourse}€`}</Text>
        <Text>{`SUPPLEMENT: ${ticketData.supplement}€`}</Text>
        <Text>{`TVA: ${ticketData.tva}%`}</Text>
        <Text>{`\nTOTAL: ${(parseFloat(ticketData.prixCourse) +
          parseFloat(ticketData.supplement)
        ).toFixed(2)}€`}</Text>
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
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Imprimer
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PreviewAndPrintScreen;
