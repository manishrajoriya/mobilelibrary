import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useForm, Controller } from "react-hook-form"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"
import { addMember, getPlans, getPlanById } from "@/firebase/functions"
import Toast from "react-native-toast-message"
import * as ImagePicker from "expo-image-picker"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/utils/firebaseConfig"

interface FormData {
  fullName: string
  address: string
  contactNumber: string
  email: string
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
  planName: string
}

type PlansData = {
  id: string
  name: string
  description: string | null
  duration: string
  amount: string
}

export default function AddMemberForm() {
  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      address: "",
      contactNumber: "",
      email: "",
     
      totalAmount: "",
      paidAmount: "",
      dueAmount: "",
      profileImage: "",
      document: "",
      admissionDate: new Date(),
      expiryDate: new Date(),
      status: "Live",
      seatNumber: "",
      planId: "",
      planName: "",
    },
  })

  const [showAdmissionDate, setShowAdmissionDate] = useState(false)
  const [showExpiryDate, setShowExpiryDate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [plans, setPlans] = useState<PlansData[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string>("")


  const statusOptions = ["Live", "Pending", "Expired"]

  useEffect(() => {
    const fetchPlans = async () => {
      const plansData = await getPlans()
      setPlans(plansData)
    }
    fetchPlans()
  }, [])

  useEffect(() => {
    if (selectedPlan.length === 0) return
    const fetchPlan = async () => {
      const planData = await getPlanById({ id: selectedPlan })
      setValue("totalAmount", planData.amount)
      setValue("planId", selectedPlan)
    }
    fetchPlan()
  }, [selectedPlan, setValue,])

  const onSubmit = async (data: FormData) => {
    try {
      await addMember({ data })
      Toast.show({
        type: "success",
        text1: "Member added successfully",
      })
      // Reset form
      Object.keys(data).forEach((key) => setValue(key as keyof FormData, ""))
      setValue("admissionDate", new Date())
      setValue("expiryDate", new Date())
      setValue("status", "Live")
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
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (cameraStatus !== "granted" || mediaLibraryStatus !== "granted") {
      Alert.alert("Permission Required", "Camera and media library permissions are required!")
      return
    }

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
      setIsLoading(true)
      try {
        const uploadedUrl = await uploadImageToFirebase(result.assets[0].uri)
        setValue("profileImage", uploadedUrl)
      } catch (error) {
        console.error("Image upload failed", error)
        Alert.alert("Upload Error", "Failed to upload image.")
      } finally {
        setIsLoading(false)
      }
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
      return uri
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="fullName"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="address"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="contactNumber"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="email"
        />

        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Plan</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue, itemIndex) => {
                    onChange(itemValue)
                    setSelectedPlan(plans[itemIndex].id)
                    setValue("planId", plans[itemIndex].id)
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Plan" value="" />
                  {plans.map((plan) => (
                    <Picker.Item key={plan.id} label={plan.name} value={plan.name} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          name="planName"
        />

        <View style={styles.row}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>Total Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  keyboardType="numeric"
                  editable={false}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
            name="totalAmount"
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>Paid Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
            name="paidAmount"
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>Due Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
            name="dueAmount"
          />
        </View>

        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Admission Date</Text>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowAdmissionDate(true)}>
                <Text>{formatDate(value)}</Text>
              </TouchableOpacity>
              {showAdmissionDate && (
                <DateTimePicker
                  value={value}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowAdmissionDate(false)
                    if (selectedDate) {
                      onChange(selectedDate)
                    }
                  }}
                />
              )}
            </View>
          )}
          name="admissionDate"
        />

        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expiry Date</Text>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowExpiryDate(true)}>
                <Text>{formatDate(value)}</Text>
              </TouchableOpacity>
              {showExpiryDate && (
                <DateTimePicker
                  value={value}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowExpiryDate(false)
                    if (selectedDate) {
                      onChange(selectedDate)
                    }
                  }}
                />
              )}
            </View>
          )}
          name="expiryDate"
        />

        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
                  {statusOptions.map((status) => (
                    <Picker.Item key={status} label={status} value={status} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          name="status"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Seat Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Seat Number"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="seatNumber"
        />

        <Controller
          control={control}
          render={({ field: { value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profile Image</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage} disabled={isLoading}>
                <Text style={styles.uploadButtonText}>{value ? "Change Image" : "Upload Image"}</Text>
              </TouchableOpacity>
              {isLoading && <ActivityIndicator size="large" color="#0f172a" />}
              {value && (
                <Text style={styles.fileName}>
                  {value.startsWith("http") ? "Image uploaded to cloud" : "Image stored locally"}
                </Text>
              )}
            </View>
          )}
          name="profileImage"
        />

         <Controller
          control={control}
          render={({ field: { value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Document</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage} disabled={isLoading}>
                <Text style={styles.uploadButtonText}>{value ? "Change Document" : "Upload Document"}</Text>
              </TouchableOpacity>
              {isLoading && <ActivityIndicator size="large" color="#0f172a" />}
              {value && (
                <Text style={styles.fileName}>
                  {value.startsWith("http") ? "Document uploaded to cloud" : "Document stored locally"}
                </Text>
              )}
            </View>
          )}
          name="document"
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#4b5563",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    height: 50,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  flex1: {
    flex: 1,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  uploadButton: {
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#1f2937",
  },
  fileName: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
  },
})

