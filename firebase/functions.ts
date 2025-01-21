import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


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
    const currentUser = auth().currentUser;

    if (!currentUser) {
      throw new Error('User not authenticated. Redirecting to sign-in...');
    }

    // Retrieve the admin details (assuming they're stored in Firestore)
    const adminDoc = await firestore()
      .collection('admins')
      .doc(currentUser.uid)
      .get();

    if (!adminDoc.exists) {
      throw new Error('Admin details not found.');
    }

    const adminData = adminDoc.data();

    // Create the plan in the Firestore database
    const planRef = await firestore().collection('plans').add({
      name: data.name,
      description: data.description,
      duration: data.duration,
      amount: data.amount,
      adminId: currentUser.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    console.log('Plan created successfully with ID:', planRef.id);
    return { id: planRef.id, ...data, adminId: currentUser.uid };
  } catch (error: any) {
    console.error('Unable to create plan:', error.message);
    throw error; // Re-throw the error for handling by the caller
  }
}