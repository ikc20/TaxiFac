import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Formik } from 'formik';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TicketData, BluetoothDevice } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketFormScreen'>;

const DEFAULT_DEVICE: BluetoothDevice = {
  name: 'PT-210_3833',
  address: 'DC:0D:30:F2:02:E9',
};

export default function TicketFormScreen({ route, navigation }: Props) {
  const device = route.params?.device ?? DEFAULT_DEVICE;
  const now = useMemo(() => new Date(), []);
  const [pickerFor, setPickerFor] = useState<'debut' | 'fin' | null>(null);

  const formatDateTime = (d: Date) =>
    d.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Formulaire du ticket</Text>
      <Text style={styles.subheader}>
        Imprimante : <Text style={styles.deviceName}>{device.name}</Text>
      </Text>

      <Formik<Omit<TicketData, 'debut' | 'fin'> & { debut: Date; fin: Date }>
        initialValues={{
          nom: 'MOHAMED SAHEL',
          immat: 'GS-124-AC',
          stat: '13257-PARIS',
          debut: now,
          fin: now,
          prixCourse: '',
          supplement: '',
          tva: '10',
        }}
        onSubmit={values => {
          const ticketData: TicketData = {
            ...values,
            debut: formatDateTime(values.debut),
            fin: formatDateTime(values.fin),
          };
          navigation.navigate('PreviewAndPrintScreen', { ticketData, device });
        }}
      >
        {({ handleChange, handleSubmit, values, setFieldValue }) => (
          <>
            {['nom', 'immat', 'stat'].map(field => (
              <View key={field} style={styles.fieldContainer}>
                <Text style={styles.label}>
                  {field === 'nom' ? 'Nom' : field === 'immat' ? 'Immatriculation' : 'Statut'}
                </Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={handleChange(field)}
                  value={values[field as 'nom' | 'immat' | 'stat']}
                />
              </View>
            ))}


            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Début</Text>
              <TouchableOpacity style={styles.textInput} onPress={() => setPickerFor('debut')}>
                <Text style={{ color: '#000' }}>{formatDateTime(values.debut)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Fin</Text>
              <TouchableOpacity style={styles.textInput} onPress={() => setPickerFor('fin')}>
                <Text style={{ color: '#000' }}>{formatDateTime(values.fin)}</Text>
              </TouchableOpacity>
            </View>

            <Modal isVisible={!!pickerFor} onBackdropPress={() => setPickerFor(null)}>
              <View style={{ backgroundColor: '#000', padding: 20, borderRadius: 8 }}>
                <DatePicker
                  date={values[pickerFor || 'debut']}
                  mode="datetime"
                  locale="fr"
                  onDateChange={(date) => setFieldValue(pickerFor!, date)}
                />
                <TouchableOpacity
                  style={styles.validateButton}
                  onPress={() => setPickerFor(null)}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Valider</Text>
                </TouchableOpacity>
              </View>
            </Modal>

            {([
              { key: 'prixCourse', label: 'Prix (€)' },
              { key: 'supplement', label: 'Supplément (€)' },
              { key: 'tva', label: 'TVA (%)' },
            ] as { key: keyof Pick<TicketData, 'prixCourse' | 'supplement' | 'tva'>; label: string }[]).map(
              ({ key, label }) => (
                <View key={key} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={handleChange(key)}
                    value={values[key]}
                    keyboardType="numeric"
                  />
                </View>
              )
            )}


            <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit()}>
              <Text style={styles.submitText}>Aperçu & Imprimer</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
    color: '#111',
  },
  subheader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
  },
  deviceName: {
    fontWeight: '600',
    color: '#2563EB',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  validateButton: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
