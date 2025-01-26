import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { fetchSeats,  allotSeat } from '@/firebase/functions'; // Adjust the import path

const AllocateSeatsPage = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null); // Track selected seat
  const [memberId, setMemberId] = useState(''); // Input for member ID

  // Fetch seats on component mount
  useEffect(() => {
    loadSeats();
  }, []);

  const loadSeats = async () => {
    setLoading(true);
    try {
      const fetchedSeats = await fetchSeats();
      setSeats(fetchedSeats);
    } catch (error) {
      console.error('Error fetching seats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllotSeat = async () => {
    if (!selectedSeat || !memberId) {
      Alert.alert('Error', 'Please select a seat and enter a member ID.');
      return;
    }

    setLoading(true);
    try {
      const result = await allotSeat(selectedSeat, memberId);
      Alert.alert('Success', result);
      await loadSeats(); // Refresh the seat list
      setSelectedSeat(null); // Reset selected seat
      setMemberId(''); // Clear member ID input
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSeat = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.seatItem,
        selectedSeat === item.id && styles.selectedSeatItem, // Highlight selected seat
      ]}
      onPress={() => setSelectedSeat(item.id)} // Set selected seat on press
      disabled={item.isAllocated} // Disable selection if seat is already allocated
    >
      <MaterialIcons
        name={item.isAllocated ? 'event-seat' : 'chair'}
        size={24}
        color={item.isAllocated ? 'red' : 'green'} // Red for allocated, green for available
      />
      <Text style={styles.seatText}>{item.seatId}</Text>
      {item.isAllocated ? (
        <Text style={styles.allocatedText}>Allocated to: {item.allocatedTo}</Text>
      ) : (
        <Text style={styles.availableText}>Available</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allocate Seats</Text>

      {/* Seat List */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={seats}
          renderItem={renderSeat}
          keyExtractor={(item) => item.id}
          style={styles.seatList}
        />
      )}

      {/* Member ID Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Member ID"
        value={memberId}
        onChangeText={setMemberId}
      />

      {/* Allocate Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleAllotSeat}
        disabled={loading || !selectedSeat || !memberId}
      >
        <Text style={styles.buttonText}>Allocate Seat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  seatList: {
    marginTop: 16,
  },
  seatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedSeatItem: {
    backgroundColor: '#e0f7fa', // Highlight selected seat
  },
  seatText: {
    marginLeft: 8,
    fontSize: 16,
  },
  allocatedText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'red', // Red for allocated seats
  },
  availableText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'green', // Green for available seats
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
});

export default AllocateSeatsPage;