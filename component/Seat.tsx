import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import Expo Vector Icons
import { fetchSeats } from '@/firebase/functions'; // Adjust the import path

const SeatsPage = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const renderSeat = ({ item }) => (
    <View style={styles.seatItem}>
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
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seats</Text>

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
  loader: {
    marginTop: 20,
  },
});

export default SeatsPage;