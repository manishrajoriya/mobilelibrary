import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "@/utils/firebaseConfig"; // Import Firebase config and auth
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Define the shape of each item
interface Item {
  id?: string; // Firestore will generate this ID
  description: string;
  amount: number;
  type: "Earning" | "Expense";
  userId: string;
}

export default function Finance() {
  const [items, setItems] = useState<Item[]>([]);
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isEarning, setIsEarning] = useState<boolean>(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const itemsCollection = collection(db, "finance");

  // Fetch the current user ID on app load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchItems(user.uid);
      } else {
        setUserId(null);
        setItems([]);
      }
    });

    return unsubscribe; // Unsubscribe from the auth listener
  }, []);

  // Fetch items for the current user
  const fetchItems = async (uid: string) => {
    try {
      const q = query(itemsCollection, where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const data: Item[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Item[];
      setItems(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Add or update an item
 const handleAddOrUpdate = async () => {
  if (!description || !amount) {
    Alert.alert("Error", "Please enter both description and amount.");
    return;
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    Alert.alert("Error", "Please enter a valid amount greater than 0.");
    return;
  }

  try {
    if (editingIndex !== null) {
      // Update an existing item
      const updatedItem: Item = {
        ...items[editingIndex],
        description,
        amount: parsedAmount,
        type: isEarning ? "Earning" : "Expense", // Explicitly set the type here
      };

      if (updatedItem.id) {
        await updateDoc(doc(db, "items", updatedItem.id), {
          description: updatedItem.description,
          amount: updatedItem.amount,
          type: updatedItem.type,
        });
      }

      const updatedItems = [...items];
      updatedItems[editingIndex] = updatedItem;
      setItems(updatedItems);
      setEditingIndex(null);
    } else {
      // Add a new item
      const newItem: Omit<Item, "id"> = {
        description,
        amount: parsedAmount,
        type: isEarning ? "Earning" : "Expense", // Explicitly set the type here
        userId: userId!,
      };

      const docRef = await addDoc(itemsCollection, newItem);
      setItems([...items, { ...newItem, id: docRef.id }]);
    }

    setDescription("");
    setAmount("");
  } catch (error) {
    console.error("Error adding or updating item:", error);
  }
};


  // Delete an item
  const handleDelete = async (index: number) => {
    const item = items[index];
    if (!item.id) return;

    Alert.alert("Confirm Delete", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "finance", item.id!));
            setItems((prevItems) => prevItems.filter((_, i) => i !== index));
          } catch (error) {
            console.error("Error deleting item:", error);
          }
        },
      },
    ]);
  };

  // Calculate the total balance
  const calculateTotal = (): number => {
    return items.reduce(
      (acc, item) => (item.type === "Earning" ? acc + item.amount : acc - item.amount),
      0
    );
  };

  // Render a single item
  const renderItem = ({ item, index }: { item: Item; index: number }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text
          style={[
            styles.itemAmount,
            item.type === "Earning" ? styles.earning : styles.expense,
          ]}
        >
          {item.type === "Earning" ? "+" : "-"}₹{item.amount.toFixed(2)}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEdit(index)}>
          <Ionicons name="pencil" size={20} color="#4285F4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(index)} style={{ marginLeft: 16 }}>
          <Ionicons name="trash" size={20} color="#EA4335" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleEdit = (index: number) => {
    const item = items[index];
    setDescription(item.description);
    setAmount(item.amount.toString());
    setIsEarning(item.type === "Earning");
    setEditingIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Earnings & Expenses Tracker</Text>
      <Text style={styles.balance}>
        Balance: ₹{calculateTotal().toFixed(2)}
      </Text>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, isEarning ? styles.active : {}]}
            onPress={() => setIsEarning(true)}
          >
            <Text style={styles.toggleText}>Earning</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isEarning ? styles.active : {}]}
            onPress={() => setIsEarning(false)}
          >
            <Text style={styles.toggleText}>Expense</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdate}>
          <Text style={styles.addButtonText}>
            {editingIndex !== null ? "Update" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* List of Items */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id!}
        style={styles.list}
      />
    </View>
  );
}


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  balance: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  typeToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    alignItems: "center",
  },
  active: {
    backgroundColor: "#e0f7fa",
    borderColor: "#00796b",
  },
  toggleText: {
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#34A853",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  earning: {
    color: "#34A853",
  },
  expense: {
    color: "#EA4335",
  },
  actions: {
    flexDirection: "row",
  },
});
