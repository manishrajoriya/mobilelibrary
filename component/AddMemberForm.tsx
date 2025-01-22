import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert, ActivityIndicator } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"
import { addMember } from "@/firebase/functions"
import Toast from "react-native-toast-message"
import * as ImagePicker from "expo-image-picker"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/utils/firebaseConfig" // Make sure this import is correct for your project structure

interface FormData {
  fullName: string
  address: string
  contactNumber: string
  email: string
  plan: string
  totalAmount: string
  paidAmount: string
  dueAmount: string
  profileImage: string
  document: string
  admissionDate: Date
  expiryDate: Date
  status: string
  seatNumber: string
  planId: string
}

export default function AddMemberForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    address: "",
    contactNumber: "",
    email: "",
    plan: "",
    totalAmount: "",
    profileImage: "",
    document: "",
    paidAmount: "",
    dueAmount: "",
    admissionDate: new Date(),
    expiryDate: new Date(),
    status: "Live",
    seatNumber: "",
    planId: "",
  })

  const [showAdmissionDate, setShowAdmissionDate] = useState(false)
  const [showExpiryDate, setShowExpiryDate] = useState(false)
  const [isLoading, setIsLoading] = useState(false);


  const plans = ["Basic", "Standard", "Premium"]
  const statusOptions = ["Live", "Pending", "Expired"]

  const handleSubmit = async () => {
    try {
      await addMember({ data: formData })
      console.log(formData)
      Toast.show({
        type: "success",
        text1: "Member added successfully",
      })
      setFormData({
        fullName: "",
        address: "",
        contactNumber: "",
        email: "",
        plan: "",
        totalAmount: "",
        paidAmount: "",
        profileImage: "",
        document: "",
        dueAmount: "",
        admissionDate: new Date(),
        expiryDate: new Date(),
        status: "Live",
        seatNumber: "",
        planId: "",
      })
    } catch (error) {
      console.error("Error adding member: ", error)
      Toast.show({
        type: "error",
        text1: "Failed to add member",
        text2: "Please try again",
      })
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const pickImage = async () => {
    // Ask for camera and media library permissions
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
      Alert.alert("Permission Required", "Camera and media library permissions are required!")
      return
    }

    // Show action sheet to choose between camera and library
    Alert.alert("Select Image Source", "Choose the source of your image", [
      {
        text: "Camera",
        onPress: () => launchCamera(),
      },
      {
        text: "Photo Library",
        onPress: () => launchImageLibrary(),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ])
  }

  const launchCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    handleImagePickerResult(result)
  }

  const launchImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    handleImagePickerResult(result)
  }

  const handleImagePickerResult = async (result: ImagePicker.ImagePickerResult) => {
  if (!result.canceled && result.assets && result.assets.length > 0) {
    setIsLoading(true); // Start loading
    try {
      const uploadedUrl = await uploadImageToFirebase(result.assets[0].uri);
      setFormData({ ...formData, profileImage: uploadedUrl });
    } catch (error) {
      console.error("Image upload failed", error);
      Alert.alert("Upload Error", "Failed to upload image.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  }
};


  const pickDocument = async () => {
    // Ask for camera and media library permissions
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
      Alert.alert("Permission Required", "Camera and media library permissions are required!")
      return
    }

    // Show action sheet to choose between camera and library
    Alert.alert("Select Document Source", "Choose the source of your document", [
      {
        text: "Camera",
        onPress: () => launchCameraForDocument(),
      },
      {
        text: "Photo Library",
        onPress: () => launchImageLibraryForDocument(),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ])
  }

  const launchCameraForDocument = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    })

    handleDocumentPickerResult(result)
  }

  const launchImageLibraryForDocument = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    })

    handleDocumentPickerResult(result)
  }

  const handleDocumentPickerResult = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uploadedUrl = await uploadImageToFirebase(result.assets[0].uri)
      setFormData({ ...formData, document: uploadedUrl })
    }
  }

  const uploadImageToFirebase = async (uri: string): Promise<string> => {
    const response = await fetch(uri)
    const blob = await response.blob()
    const filename = uri.substring(uri.lastIndexOf("/") + 1)
    const storageRef = ref(storage, `images/${filename}`)

    try {
      const snapshot = await uploadBytes(storageRef, blob)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (error: any) {
      console.error("Error uploading image: ", error)
      if (error.code === "storage/unauthorized") {
        Alert.alert(
          "Upload Error",
          "You don't have permission to upload images. The image will be stored locally for now.",
          [{ text: "OK" }],
        )
      } else {
        Alert.alert("Upload Error", "Failed to upload image. The image will be stored locally for now.", [
          { text: "OK" },
        ])
      }
      return uri // Return the local URI as a fallback
    }
  }

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
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowAdmissionDate(true)}>
            <Text>{formatDate(formData.admissionDate)}</Text>
          </TouchableOpacity>
          {showAdmissionDate && (
            <DateTimePicker
              value={formData.admissionDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowAdmissionDate(false)
                if (selectedDate) {
                  setFormData({ ...formData, admissionDate: selectedDate })
                }
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expiry Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowExpiryDate(true)}>
            <Text>{formatDate(formData.expiryDate)}</Text>
          </TouchableOpacity>
          {showExpiryDate && (
            <DateTimePicker
              value={formData.expiryDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowExpiryDate(false)
                if (selectedDate) {
                  setFormData({ ...formData, expiryDate: selectedDate })
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Profile Image</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage} disabled={isLoading}>
            <Text style={styles.uploadButtonText}>{formData.profileImage ? "Change Image" : "Upload Image"}</Text>
          </TouchableOpacity>
          {isLoading && <ActivityIndicator size="large" color="#0f172a" />}
          {formData.profileImage && (
            <Text style={styles.fileName}>
              {formData.profileImage.startsWith("http") ? "Image uploaded to cloud" : "Image stored locally"}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Document</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument} disabled={isLoading}>
            <Text style={styles.uploadButtonText}>{formData.document ? "Change Document" : "Upload Document"}</Text>
          </TouchableOpacity>
          {isLoading && <ActivityIndicator size="large" color="#0f172a" />}
          {formData.document && (
            <Text style={styles.fileName}>
              {formData.document.startsWith("http") ? "Document uploaded to cloud" : "Document stored locally"}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        <Toast />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  flex1: {
    flex: 1,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  uploadButton: {
    backgroundColor: "#e1e1e1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#333",
  },
  fileName: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
})

