import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';

// ON PREND MAINTENANT DES NAMED EXPORTS
import {
  BluetoothManager,
  BluetoothDevice,
} from 'react-native-bluetooth-escpos-printer';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanPrinterScreen'>;

const ScanPrinterScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);

  const requestBluetoothPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    return Object.values(granted).every(
      v => v === PermissionsAndroid.RESULTS.GRANTED
    );
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const ok = await requestBluetoothPermission();
        if (!ok) throw new Error('Permissions Bluetooth refusées');

        await BluetoothManager.enableBluetooth();
        const raw = await BluetoothManager.getDeviceList();
        const paired = raw
          .map(item => JSON.parse(item) as BluetoothDevice)
          .filter(Boolean);

        const pt210 = paired.find(d =>
          d.name.toUpperCase().includes('PT-210')
        );
        if (!pt210) throw new Error('PT-210 non appairée');

        await BluetoothManager.connectPrinter(pt210.address);
        setDevice(pt210);
      } catch (err: any) {
        Alert.alert('Erreur', err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleContinue = () => {
    if (device) {
      navigation.navigate('TicketFormScreen', { device });
    } else {
      Alert.alert('Erreur', 'Aucune imprimante connectée');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion à PT-210</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20
  },
  title: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'
  },
  button: {
    backgroundColor: '#2196F3', padding: 15, borderRadius: 10
  },
  buttonText: {
    color: 'white', fontWeight: 'bold'
  },
});

export default ScanPrinterScreen;
