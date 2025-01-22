// import firestore from '@react-native-firebase/firestore';
import { db } from "@/utils/firebaseConfig";
import { collection, addDoc,getDoc, where, query, getDocs, startAfter,
   type QueryDocumentSnapshot,
  type DocumentData, limit, orderBy, 
  or} from "firebase/firestore"; 
import { auth } from "@/utils/firebaseConfig";
import {getAuth, } from "firebase/auth"
import { useAuth } from "./authContext";


// Define the plan data type
type PlanData = {
  name: string;
  description: string;
  duration: string;
  amount: string;
};

export async function createPlan({ data }: { data: PlanData }) {
  try {
    // Get the current user
    const currentUser =  getAuth().currentUser
    if (!currentUser) {
      throw new Error('User not authenticated. Redirecting to sign-in...');
    }


    // Create the plan in the Firestore database
   const planRef = await addDoc(collection(db, 'plans'), {
     name: data.name,
     description: data.description,
     duration: data.duration,
     amount: data.amount,
     admin: currentUser.uid
   });

    console.log('Plan created successfully with ID:', planRef.id);
    return { id: planRef.id, ...data,  };
  } catch (error: any) {
    console.error('Unable to create plan:', error.message);
    throw error; // Re-throw the error for handling by the caller
  }
}


export async function getPlans() {
  try {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated. Redirecting to sign-in...');
    }
    
    const q = query(collection(db, 'plans'), where('admin', '==', currentUser.uid));
    const plansSnapshot = await getDocs(q);
    
    const plans = plansSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name, description: doc.data().description, duration: doc.data().duration, amount: doc.data().amount  }));
    console.log('Plans fetched successfully:', plans);
    
    return plans;
  } catch (error: any) {
    console.error('Unable to get plans:', error.message);
    throw error; // Re-throw the error for handling by the caller
  }
}

export async function addMember({ data }: { data: any }) {
  try {
    // Get the current user
    const currentUser =  getAuth().currentUser
    if (!currentUser) {
      throw new Error('User not authenticated. Redirecting to sign-in...');
    }

    // Create the plan in the Firestore database
   const memberRef = await addDoc(collection(db, 'members'), {
        admin: currentUser.uid,
        fullName: data?.fullName,
        address:  data?.address,
        contactNumber: data?.contactNumber,
        email: data?.email,
        addmissionDate: data?.admissionDate,
        expiryDate: data?.expiryDate,
        status: data?.status,
        seatNumber: data?.seatNumber,
        profileImage: data?.profileImage,
        document: data?.document,
        dueAmount: data?.dueAmount,
        totalAmount: data?.totalAmount,
        paidAmount: data?.paidAmount,
        planId: data?.planId,
        createdAt: new Date(),
        updatedAt: new Date()
   });

    console.log('Member created successfully with ID:', memberRef.id);
    return memberRef.id;
  } catch (error: any) {
    console.error('Unable to create member:', error.message);
    throw error; // Re-throw the error for handling by the caller
  }
}


export async function getMembers(lastVisible?: QueryDocumentSnapshot<DocumentData>, pageSize = 5) {
  try {
    const currentUser = getAuth().currentUser
    if (!currentUser) {
      throw new Error("User not authenticated. Redirecting to sign-in...")
    }

    let q = query(
      collection(db, "members"),
      where("admin", "==", currentUser.uid),
      //  // Add an orderBy clause to ensure consistent pagination
       orderBy("createdAt", "desc"),
      limit(pageSize),
    )

    if (lastVisible) {
      q = query(q, startAfter(lastVisible))
    }

    const membersSnapshot = await getDocs(q)

    const members = membersSnapshot.docs.map((doc) => ({
      id: doc.id,
      fullName: doc.data().fullName,
      address: doc.data().address,
      contactNumber: doc.data().contactNumber,
      email: doc.data().email,
      addmissionDate: doc.data().addmissionDate.toDate(),
      expiryDate: doc.data().expiryDate.toDate(),
      status: doc.data().status,
      seatNumber: doc.data().seatNumber,
      profileImage: doc.data().profileImage,
      document: doc.data().document,
      dueAmount: doc.data().dueAmount,
      totalAmount: doc.data().totalAmount,
      paidAmount: doc.data().paidAmount,
      planId: doc.data().planId,
    }))

    const lastVisibleDoc = membersSnapshot.docs[membersSnapshot.docs.length - 1]
    const hasMore = membersSnapshot.docs.length === pageSize

    return { members, lastVisibleDoc, hasMore }
  } catch (error: any) {
    console.error("Unable to get members:", error.message)
    throw error
  }
}


export async function totalMemberCount() {
  try {
    const currentUser = getAuth().currentUser
    if (!currentUser) {
      throw new Error("User not authenticated. Redirecting to sign-in...")
    }
    const q = query(collection(db, "members"), where("admin", "==", currentUser.uid),)
    const membersSnapshot = await getDocs(q)
    return membersSnapshot.size
  } catch (error: any) {
    console.error("Unable to get member count:", error.message)
    throw error
  }
}

export async function liveMemberCount() {
  try {
    const currentUser = getAuth().currentUser
    if (!currentUser) {
      throw new Error("User not authenticated. Redirecting to sign-in...")
    }
    const q = query(collection(db, "members"), where("admin", "==", currentUser.uid), where("status", "==", "Live"))
    const membersSnapshot = await getDocs(q)
    return membersSnapshot.size
  } catch (error: any) {
    console.error("Unable to get live member count:", error.message)
    throw error
  }
}

export async function InactiveMemberCount() {
  try {
    const currentUser = getAuth().currentUser
    if (!currentUser) {
      throw new Error("User not authenticated. Redirecting to sign-in...")
    }
    const q = query(collection(db, "members"), where("admin", "==", currentUser.uid), where("status", "==", "Inactive"))
    const membersSnapshot = await getDocs(q)
    return membersSnapshot.size
  } catch (error: any) {
    console.error("Unable to get inactive member count:", error.message)
    throw error
  }
}