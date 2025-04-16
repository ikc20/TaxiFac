import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import BluetoothEscposPrinter from 'react-native-bluetooth-escpos-printer';

const ScanPrinterScreen = ({ navigation }: any) => {
  const [devices, setDevices] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const requestBluetoothPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission de localisation',
            message: "L'application a besoin de la localisation pour scanner les appareils Bluetooth",
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const scanPrinters = async () => {
    const hasPermission = await requestBluetoothPermission();
    if (!hasPermission) {
      Alert.alert('Erreur', 'Permission requise pour scanner les appareils Bluetooth');
      return;
    }

    setIsScanning(true);
    setDevices([]);

    try {
      const pairedDevices = await BluetoothEscposPrinter.getDeviceList();
      setDevices(
        pairedDevices.filter((device: any) =>
          device.name && (device.name.includes('Printer') || device.name.includes('POS'))
        )
      );
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert('Erreur', 'Échec du scan des appareils Bluetooth');
    } finally {
      setIsScanning(false);
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
      <Text style={styles.title}>Imprimantes Bluetooth disponibles</Text>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={scanPrinters}
        disabled={isScanning}
      >
        <Text style={styles.scanButtonText}>
          {isScanning ? 'Scan en cours...' : 'Scanner les imprimantes'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={renderDeviceItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isScanning ? 'Recherche en cours...' : 'Aucune imprimante trouvée'}
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceAddress: {
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default ScanPrinterScreen;
