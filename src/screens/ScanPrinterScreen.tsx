import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import EscPosPrinter from 'react-native-bluetooth-escpos-printer';
const { BluetoothManager, BluetoothEscposPrinter } = EscPosPrinter;

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanPrinterScreen'>;

const ScanPrinterScreen = ({ navigation }: Props) => {
  const [devices, setDevices] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const requestBluetoothPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ];
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        return Object.values(granted).every(
          (result) => result === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn('Erreur permissions Bluetooth:', err);
        return false;
      }
    }
    return true;
  };

  const scanPrinters = async () => {
    const hasPermission = await requestBluetoothPermission();
    if (!hasPermission) {
      Alert.alert('Permission refusée', 'Certaines permissions Bluetooth sont refusées.');
      return;
    }

    setIsScanning(true);
    setDevices([]);

    try {
      const pairedList = await BluetoothManager.enableBluetooth();
      const parsed = pairedList.map((item: string) => JSON.parse(item));
      const filtered = parsed.filter(
        (d: any) => d.name && (d.name.includes('Printer') || d.name.includes('POS'))
      );
      setDevices(filtered);
      if (filtered.length === 0) {
        Alert.alert('Aucune imprimante trouvée', 'Vérifiez que votre imprimante est allumée.');
      }
    } catch (error: any) {
      console.error('[Erreur scan Bluetooth]', error);
      Alert.alert('Erreur', error?.message || 'Erreur inconnue');
    } finally {
      setIsScanning(false);
    }
  };

  const handlePrint = async () => {
    try {
      const enabled = await BluetoothManager.isBluetoothEnabled();
      if (!enabled) {
        await BluetoothManager.enableBluetooth();
      }

      const devices = await BluetoothManager.enableBluetooth();
      const paired = devices.map((d: string) => JSON.parse(d));
      if (!paired.length) {
        Alert.alert('Aucune imprimante appairée');
        return;
      }

      await BluetoothManager.connect(paired[0].address);
      await BluetoothEscposPrinter.printerInit();
      await BluetoothEscposPrinter.printText('🧾 Hello World\n\r', {
        encoding: 'GBK',
        widthtimes: 2,
        heigthtimes: 2,
        fonttype: 1,
      });
    } catch (error: any) {
      Alert.alert('Erreur impression', error?.message || 'Erreur inconnue');
    }
  };

  const renderDeviceItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => navigation.navigate('PrinterSelectionScreen', { device: item })}
    >
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceAddress}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🖨️ Sélectionnez une imprimante</Text>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={scanPrinters}
        disabled={isScanning}
      >
        <Text style={styles.scanButtonText}>
          {isScanning ? '🔎 Scanning...' : '🔍 Scanner'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
        <Text style={styles.printButtonText}>🧾 Imprimer Test</Text>
      </TouchableOpacity>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={renderDeviceItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isScanning
              ? 'Recherche en cours...'
              : 'Aucune imprimante détectée'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111827',
  },
  scanButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  printButton: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  printButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deviceItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  deviceAddress: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContent: {
    paddingBottom: 30,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 30,
    fontSize: 16,
  },
});

export default ScanPrinterScreen;
