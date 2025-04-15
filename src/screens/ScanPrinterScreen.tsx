import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const ScanPrintersScreen = ({ navigation }: any) => {
  const [devices, setDevices] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const bleManager = useRef<BleManager | null>(null);

  // Initialisation et nettoyage du BleManager
  useEffect(() => {
    bleManager.current = new BleManager();

    return () => {
      if (bleManager.current) {
        bleManager.current.stopDeviceScan();
        bleManager.current.destroy();
        bleManager.current = null;
      }
    };
  }, []);

  const startScan = useCallback(async () => {
    if (!bleManager.current) {
      Alert.alert('Erreur', 'Bluetooth non initialisé');
      return;
    }

    setIsScanning(true);
    setDevices([]);

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Erreur', 'Permission de localisation refusée');
        setIsScanning(false);
        return;
      }
    }

    bleManager.current.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Scan error:', error);
        setIsScanning(false);
        return;
      }

      if (device?.name?.includes('Printer') || device?.name?.includes('BT')) {
        setDevices(prevDevices => {
          const exists = prevDevices.some(d => d.id === device.id);
          return exists ? prevDevices : [...prevDevices, device];
        });
      }
    });

    setTimeout(() => {
      bleManager.current?.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  }, []);

  const connectToDevice = async (device: any) => {
    if (!bleManager.current) {
      Alert.alert('Erreur', 'Bluetooth non initialisé');
      return;
    }

    try {
      const connectedDevice = await bleManager.current.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      navigation.navigate('PrinterSelectionScreen', { device: connectedDevice });
    } catch (err) {
      console.error('Connection error:', err);
      Alert.alert('Erreur', 'Connexion à l\'imprimante échouée');
    }
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.noDevicesText}>
        {isScanning ? 'Recherche en cours...' : 'Aucune imprimante trouvée'}
      </Text>
    </View>
  );

  const renderDeviceItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => connectToDevice(item)}
      style={styles.deviceItem}
    >
      <Text style={styles.deviceName}>{item.name || 'Appareil inconnu'}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Imprimantes Bluetooth détectées</Text>

      {isScanning && (
        <View style={styles.scanningInfo}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.scanningText}>Scan en cours...</Text>
        </View>
      )}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderDeviceItem}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        onPress={startScan}
        style={[styles.rescanButton, isScanning && styles.disabledButton]}
        disabled={isScanning}
      >
        <Text style={styles.rescanButtonText}>
          {isScanning ? 'Recherche...' : 'Relancer la recherche'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scanningInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanningText: {
    marginLeft: 8,
    color: '#0000ff',
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDevicesText: {
    textAlign: 'center',
    color: '#666',
  },
  deviceItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  deviceName: {
    fontSize: 16,
    color: '#333',
  },
  deviceId: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  rescanButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  rescanButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ScanPrintersScreen;
