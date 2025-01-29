import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { addLibrary } from "@/firebase/functions"; // Import addLibrary function
import useStore from "@/hooks/store";


type FormData = {
  name: string;
  address: string;
  description: string;
};

const AddLibraryScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const currentUser = useStore((state: any) => state.currentUser);
  const activeLibrary = useStore((state: any) => state.activeLibrary);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await addLibrary({ data, currentUser });
      alert("Library added successfully!");
      
    } catch (error) {
      alert("Failed to add library. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Library</Text>

      {/* Name Input */}
      <Controller
        control={control}
        rules={{ required: "Library name is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Library Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="name"
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      {/* Address Input */}
      <Controller
        control={control}
        rules={{ required: "Address is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Library Address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="address"
      />
      {errors.address && <Text style={styles.error}>{errors.address.message}</Text>}

      {/* Description Input */}
      <Controller
        control={control}
        rules={{ required: "Description is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Library Description"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="description"
      />
      {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add Library</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default AddLibraryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 5, marginBottom: 10, borderWidth: 1, borderColor: "#ddd" },
  error: { color: "red", fontSize: 12, marginBottom: 10 },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
