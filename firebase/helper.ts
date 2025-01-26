import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/utils/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";
import { SeatData } from "@/types/MemberProfile";

// Upload image to Firebase Storage
export const uploadImageToFirebase = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const filename = uri.substring(uri.lastIndexOf("/") + 1);
  const storageRef = ref(storage, `uploads/${filename}`);

  try {
    const snapshot = await uploadBytes(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
};

// Fetch available seats
export const fetchSeats = async (): Promise<SeatData[]> => {
  const seatsCollection = collection(db, "seats");
  const snapshot = await getDocs(seatsCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SeatData));
};