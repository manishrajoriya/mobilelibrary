import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SeatManagementScreen: React.FC = () => {
  const [numberOfSeats, setNumberOfSeats] = useState<string>("");
  const [seats, setSeats] = useState<number[]>([]);

  const handleAddSeats = () => {
    const numSeats = parseInt(numberOfSeats, 10);

    if (isNaN(numSeats) || numSeats <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid number of seats.");
      return;
    }

    if (seats.length + numSeats > 50) {
      Alert.alert("Limit Exceeded", "You can only add up to 50 seats.");
      return;
    }

    const newSeats = Array.from({ length: numSeats }, (_, i) => seats.length + i + 1);
    setSeats((prevSeats) => [...prevSeats, ...newSeats]);
    setNumberOfSeats("");
  };

  const handleRemoveSeat = (seatNumber: number) => {
    setSeats((prevSeats) => prevSeats.filter((seat) => seat !== seatNumber));
  };

  const renderSeat = ({ item }: { item: number }) => (
    <TouchableOpacity onPress={() => handleRemoveSeat(item)} style={styles.seatItem}>
      <MaterialIcons name="chair" size={40} color="#007BFF" />
      <Text style={styles.seatNumber}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library Seat Management</Text>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter number of seats"
          value={numberOfSeats}
          onChangeText={setNumberOfSeats}
          style={styles.input}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={handleAddSeats} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Seats</Text>
        </TouchableOpacity>
      </View>

      {/* Seat Display */}
      <FlatList
        data={seats}
        renderItem={renderSeat}
        keyExtractor={(item) => item.toString()}
        numColumns={4}
        contentContainerStyle={styles.seatList}
      />

      {/* Total Seats */}
      <Text style={styles.totalSeats}>Total Seats: {seats.length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  seatList: {
    alignItems: "center",
  },
  seatItem: {
    margin: 10,
    alignItems: "center",
  },
  seatNumber: {
    marginTop: 5,
    fontSize: 16,
    color: "#333",
  },
  totalSeats: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20,
    color: "#333",
  },
});

export default SeatManagementScreen;