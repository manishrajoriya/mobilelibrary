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
import { useForm, Controller, useWatch } from "react-hook-form"
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

type PlanData = {
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
      plan: "",
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
      
    },
  })

  const [showAdmissionDate, setShowAdmissionDate] = useState(false)
  const [showExpiryDate, setShowExpiryDate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [plans, setPlans] = useState<PlanData[]>([])
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null)

  const statusOptions = ["Live", "Pending", "Expired"]

  useEffect(() => {
    const fetchPlans = async () => {
      const plansData = await getPlans()
      setPlans(plansData)
    }
    fetchPlans()
  }, [])

  useEffect(() => {
    const planId = watch("planId")
    if (planId) {
      const fetchPlan = async () => {
        const planData = await getPlanById({ id: planId })
        setSelectedPlan(planData)
        setValue("totalAmount", planData.amount)
      }
      fetchPlan()
    }
  }, [watch("planId")])

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

  const pickImage = async (field: "profileImage" | "document") => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera roll permissions are required!")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      
      quality: 1,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setIsLoading(true)
      try {
        const uploadedUrl = await uploadImageToFirebase(result.assets[0].uri)
        setValue(field, uploadedUrl)
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
      return await getDownloadURL(snapshot.ref)
    } catch (error: any) {
      console.error("Error uploading image: ", error)
      Alert.alert("Upload Error", "Failed to upload image. The image will be stored locally for now.")
      return uri
    }
  }

  const watchProfileImage = watch("profileImage")
  const watchDocument = watch("document")

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Controller
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Full Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
          name="fullName"
        />

        <Controller
          control={control}
          rules={{ required: "Address is required" }}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
          name="address"
        />

        <Controller
          control={control}
          rules={{ required: "Contact number is required" }}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Contact Number"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
          name="contactNumber"
        />

        <Controller
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
          name="email"
        />

        <Controller
          control={control}
          rules={{ required: "Plan is required" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Plan</Text>
              <View style={[styles.pickerContainer, error && styles.inputError]}>
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue, itemIndex) => {
                    onChange(itemValue)
                    setValue("planId", plans[itemIndex - 1]?.id || "")
                    
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Plan" value="" />
                  {plans.map((plan) => (
                    <Picker.Item key={plan.id} label={plan.name} value={plan.name} />
                  ))}
                </Picker>
              </View>
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
          name="plan"
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
            rules={{ required: "Paid amount is required" }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>Paid Amount</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="0.00"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {error && <Text style={styles.errorText}>{error.message}</Text>}
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
          rules={{ required: "Admission date is required" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Admission Date</Text>
              <TouchableOpacity
                style={[styles.dateButton, error && styles.inputError]}
                onPress={() => setShowAdmissionDate(true)}
              >
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
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
          name="admissionDate"
        />

        <Controller
          control={control}
          rules={{ required: "Expiry date is required" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expiry Date</Text>
              <TouchableOpacity
                style={[styles.dateButton, error && styles.inputError]}
                onPress={() => setShowExpiryDate(true)}
              >
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
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
          name="expiryDate"
        />

        <Controller
          control={control}
          rules={{ required: "Status is required" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={[styles.pickerContainer, error && styles.inputError]}>
                <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
                  {statusOptions.map((status) => (
                    <Picker.Item key={status} label={status} value={status} />
                  ))}
                </Picker>
              </View>
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
          name="status"
        />

        <Controller
          control={control}
          rules={{ required: "Seat number is required" }}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Seat Number</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Seat Number"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
          name="seatNumber"
        />

        <View style={styles.uploadButtonsContainer}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImage("profileImage")}
                disabled={isLoading}
              >
                <Text style={styles.uploadButtonText}>{value ? "Change Image" : "Upload Image"}</Text>
              </TouchableOpacity>
            )}
            name="profileImage"
          />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage("document")} disabled={isLoading}>
                <Text style={styles.uploadButtonText}>{value ? "Change Document" : "Upload Document"}</Text>
              </TouchableOpacity>
            )}
            name="document"
          />
        </View>
        {isLoading && <ActivityIndicator size="large" color="#0f172a" />}

        {watchProfileImage && (
          <Text style={styles.fileName}>
            {watchProfileImage.startsWith("http") ? "Image uploaded to cloud" : "Image stored locally"}
          </Text>
        )}
        {watchDocument && (
          <Text style={styles.fileName}>
            {watchDocument.startsWith("http") ? "Document uploaded to cloud" : "Document stored locally"}
          </Text>
        )}

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
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
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
  uploadButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  fileName: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
  },
  uploadButtonText: {
    color: "#4b5563",
    fontSize: 14,
  },
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
  },
 
})

