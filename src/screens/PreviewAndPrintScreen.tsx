import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PreviewAndPrintScreen'>;

export default function PreviewAndPrintScreen({ route }: Props) {
  const { ticketData, device } = route.params;
  const [isPrinting, setIsPrinting] = React.useState(false);

  const prix = parseFloat(ticketData.prixCourse) || 0;
  const supplement = parseFloat(ticketData.supplement) || 0;
  const tvaPct = parseFloat(ticketData.tva) || 0;
  const totalTTC = (prix + supplement).toFixed(2);
  const montantTVA = ((prix + supplement) * (tvaPct / 100)).toFixed(2);

  const printTicket = async () => {
    setIsPrinting(true);
    try {
      const connected = await RNBluetoothClassic.isDeviceConnected(device.address);
      if (!connected) {
        await RNBluetoothClassic.connectToDevice(device.address);
      }

      const now = new Date();
      const dateStr = now.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const lines = [
        '*** TICKET CLIENT ***',
        'NOTE DE TAXI',
        '',
        `DATE   : ${dateStr}`,
        '',
        `NOM    : ${ticketData.nom}`,
        `IMMAT  : ${ticketData.immat}`,
        `STATUT : ${ticketData.stat}`,
        '',
        `DEBUT  : ${ticketData.debut}`,
        `FIN    : ${ticketData.fin}`,
        '',
        `PRIX COURSE     : ${prix.toFixed(2)} EUR`,
        `SUPPLEMENT      : ${supplement.toFixed(2)} EUR`,
        `TOTAL TTC       : ${totalTTC} EUR`,
        `DONT TVA ${tvaPct}% : ${montantTVA} EUR`,
        '',
        '--- MENTIONS CLIENT ---',
        'Nom client       : ',
        'Lieu de depart   : ',
        `Lieu d'arrivee   : `,
        '\n\n\n',
      ];

      const content = lines.join('\n');
      await RNBluetoothClassic.writeToDevice(device.address, content);

      Alert.alert('✅ Impression réussie');
    } catch (err: any) {
      Alert.alert('❌ Erreur impression', err.message || 'Erreur inconnue');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Aperçu du ticket</Text>

      <View style={styles.previewBox}>
        <Text style={styles.line}><Text style={styles.bold}>NOM   :</Text> {ticketData.nom}</Text>
        <Text style={styles.line}><Text style={styles.bold}>IMMAT :</Text> {ticketData.immat}</Text>
        <Text style={styles.line}><Text style={styles.bold}>STAT  :</Text> {ticketData.stat}</Text>
        <Text style={styles.line}><Text style={styles.bold}>DÉBUT :</Text> {ticketData.debut}</Text>
        <Text style={styles.line}><Text style={styles.bold}>FIN   :</Text> {ticketData.fin}</Text>
        <Text style={styles.line}><Text style={styles.bold}>PRIX  :</Text> {prix.toFixed(2)} €</Text>
        <Text style={styles.line}><Text style={styles.bold}>SUPPL.:</Text> {supplement.toFixed(2)} €</Text>
        <Text style={styles.line}><Text style={styles.bold}>TVA   :</Text> {tvaPct}%</Text>
        <Text style={styles.line}><Text style={styles.bold}>TOTAL :</Text> {totalTTC} €</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isPrinting && styles.buttonDisabled]}
        onPress={printTicket}
        disabled={isPrinting}
      >
        {isPrinting
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>🖨️ Imprimer</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  previewBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  line: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  bold: {
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
