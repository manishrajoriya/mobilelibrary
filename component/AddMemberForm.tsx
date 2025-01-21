import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

interface FormData {
  fullName: string;
  address: string;
  contactNumber: string;
  email: string;
  plan: string;
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
  admissionDate: Date;
  expiryDate: Date;
  status: string;
  seatNumber: string;
}

export default function AddMemberForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    address: '',
    contactNumber: '',
    email: '',
    plan: '',
    totalAmount: '',
    paidAmount: '',
    dueAmount: '',
    admissionDate: new Date(),
    expiryDate: new Date(),
    status: 'Live',
    seatNumber: '',
  });

  const [showAdmissionDate, setShowAdmissionDate] = useState(false);
  const [showExpiryDate, setShowExpiryDate] = useState(false);

  const plans = ['Basic', 'Standard', 'Premium'];
  const statusOptions = ['Live', 'Pending', 'Expired'];

  const handleSubmit = () => {
    console.log(formData);
    // Handle form submission here
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            keyboardType="phone-pad"
            value={formData.contactNumber}
            onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Plan</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.plan}
              onValueChange={(value) => setFormData({ ...formData, plan: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select Plan" value="" />
              {plans.map((plan) => (
                <Picker.Item key={plan} label={plan} value={plan} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.flex1]}>
            <Text style={styles.label}>Total Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={formData.totalAmount}
              onChangeText={(text) => setFormData({ ...formData, totalAmount: text })}
            />
          </View>

          <View style={[styles.inputGroup, styles.flex1]}>
            <Text style={styles.label}>Paid Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={formData.paidAmount}
              onChangeText={(text) => setFormData({ ...formData, paidAmount: text })}
            />
          </View>

          <View style={[styles.inputGroup, styles.flex1]}>
            <Text style={styles.label}>Due Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={formData.dueAmount}
              onChangeText={(text) => setFormData({ ...formData, dueAmount: text })}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Admission Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowAdmissionDate(true)}
          >
            <Text>{formatDate(formData.admissionDate)}</Text>
          </TouchableOpacity>
          {showAdmissionDate && (
            <DateTimePicker
              value={formData.admissionDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowAdmissionDate(false);
                if (selectedDate) {
                  setFormData({ ...formData, admissionDate: selectedDate });
                }
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expiry Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowExpiryDate(true)}
          >
            <Text>{formatDate(formData.expiryDate)}</Text>
          </TouchableOpacity>
          {showExpiryDate && (
            <DateTimePicker
              value={formData.expiryDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowExpiryDate(false);
                if (selectedDate) {
                  setFormData({ ...formData, expiryDate: selectedDate });
                }
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              style={styles.picker}
            >
              {statusOptions.map((status) => (
                <Picker.Item key={status} label={status} value={status} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Seat Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Seat Number"
            keyboardType="numeric"
            value={formData.seatNumber}
            onChangeText={(text) => setFormData({ ...formData, seatNumber: text })}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  flex1: {
    flex: 1,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});