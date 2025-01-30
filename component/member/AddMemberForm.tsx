import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { addMember } from "@/firebase/functions";
import Toast from "react-native-toast-message";
import { useAddMemberForm } from "@/hooks/useAddMemberForm";

import { pickImage, uploadImageToFirebase, pickImageSource } from "./ImageUpload";
import type { FormData } from "@/types/MemberProfile";
import useStore from "@/hooks/store";

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function AddMemberForm() {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    showAdmissionDate,
    setShowAdmissionDate,
    showExpiryDate,
    setShowExpiryDate,
    isLoading,
    setIsLoading,
    plans,
  } = useAddMemberForm();
  const currentUser = useStore((state: any) => state.currentUser);
  const activeLibrary = useStore((state: any) => state.activeLibrary);

  // const statusOptions = ["Live", "Pending", "Expired"];

  const onSubmit = async (data: FormData) => {
    try {
      await addMember({ data, currentUser, libraryId: activeLibrary.id });
      Toast.show({
        type: "success",
        text1: "Member added successfully",
      });
      // Reset form
      Object.keys(data).forEach((key) => setValue(key as keyof FormData, ""));
      setValue("admissionDate", new Date());
      setValue("expiryDate", new Date());
      
    } catch (error) {
      console.error("Error adding member: ", error);
      Toast.show({
        type: "error",
        text1: "Failed to add member",
        text2: "Please try again",
      });
    }
  };

  const handleImagePick = async (field: "profileImage" | "document") => {
    try {
      const source = await pickImageSource();
      const uri = await pickImage(source);
      if (uri) {
        setIsLoading(true);
        const uploadedUrl = await uploadImageToFirebase(uri);
        setValue(field, uploadedUrl);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const watchProfileImage = watch("profileImage");
  const watchDocument = watch("document");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        {/* Name */}
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

        {/* Address */}
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

        {/* Contact Number */}
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

        {/* Email */}
        <Controller
          control={control}
        //   rules={{
            
        //     pattern: {
        //       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        //       message: "Invalid email address",
        //     },
        //   }}
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

        {/* Plan Selection */}
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
                    onChange(itemValue);
                    setValue("planId", plans[itemIndex - 1]?.id || "");
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

        {/* Total, Paid, and Due Amount */}
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

        {/* Admission Date */}
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
                    setShowAdmissionDate(false);
                    if (selectedDate) {
                      onChange(selectedDate);
                    }
                  }}
                />
              )}
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
          name="admissionDate"
        />

        {/* Expiry Date */}
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
                    setShowExpiryDate(false);
                    if (selectedDate) {
                      onChange(selectedDate);
                    }
                  }}
                />
              )}
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
          name="expiryDate"
        />

        {/* Status */}
        {/* <Controller
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
        /> */}

        {/* Seat Number */}
        {/* <Controller
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
        /> */}

        {/* Upload Buttons */}
        <View style={styles.uploadButtonsContainer}>
          <TouchableOpacity onPress={() => handleImagePick("profileImage")} disabled={isLoading}>
            <Text style={styles.uploadButtonText}>Upload Profile Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImagePick("document")} disabled={isLoading}>
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </TouchableOpacity>
        </View>

        {/* Display Uploaded Files */}
        {isLoading && <ActivityIndicator size="large" color="#6d28d9" />}
        {watchProfileImage && (
          <View style={styles.uploadedFileContainer}>
            <Text style={styles.uploadedFileText}>Profile Image:</Text>
            <Image source={{ uri: watchProfileImage }} style={styles.uploadedImage} />
          </View>
        )}
        {watchDocument && (
          <View style={styles.uploadedFileContainer}>
            <Text style={styles.uploadedFileText}>Document:</Text>
            <Text style={styles.uploadedFileLink}>{watchDocument}</Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isLoading} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff", // Light purple background
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#6d28d9", // Dark purple button
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  uploadButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uploadButtonText: {
    color: "#000", 
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#000", 
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
  uploadedFileContainer: {
    marginTop: 10,
  },
  uploadedFileText: {
    fontSize: 14,
    color: "#6b7280",
  },
  uploadedFileLink: {
    fontSize: 14,
    color: "#6d28d9", // Dark purple link
    textDecorationLine: "underline",
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 8,
  },
});