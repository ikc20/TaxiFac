import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanPrinterScreen'>;

const ScanPrinterScreen = ({ navigation }: Props) => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      ]);
      return Object.values(granted).every((v) => v === PermissionsAndroid.RESULTS.GRANTED);
    }
    return true;
  };

  const scanDevices = async () => {
    try {
      const bonded = await RNBluetoothClassic.getBondedDevices();
      setDevices(bonded);
      Alert.alert('Scan terminé', `Appareils appairés trouvés : ${bonded.length}`);
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Échec du scan Bluetooth');
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      const connected = await device.connect();
      if (connected) {
        setConnectedDevice(device);
        Alert.alert('✅ Connecté à ' + device.name);
        navigation.navigate('TicketFormScreen', { device: { name: device.name, address: device.address } });
      }
    } catch (err: any) {
      Alert.alert('❌ Connexion échouée', err.message || 'Erreur inconnue');
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sélectionnez une imprimante appairée</Text>

      <TouchableOpacity style={styles.scanButton} onPress={scanDevices}>
        <Text style={styles.scanButtonText}>🔍 Scanner les appareils</Text>
      </TouchableOpacity>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => connectToDevice(item)}
            style={styles.deviceItem}
          >
            <Text style={styles.deviceText}>{item.name || 'Sans nom'} - {item.address}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ScanPrinterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  deviceItem: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  deviceText: {
    fontSize: 16,
    color: '#111',
  },
});
