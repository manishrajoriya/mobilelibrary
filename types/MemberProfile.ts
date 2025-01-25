export interface MemberDetails {
  addmissionDate: Date | string
  address: string
  contactNumber: string
  document?: string
  dueAmount: string
  email: string
  expiryDate: Date | string
  fullName: string
  id: string
  paidAmount: string
  planId?: string
  profileImage?: string
  seatNumber: string
  status: string
  totalAmount: string
  plan?: string
  createdAt?: Date
  updatedAt?: Date
}



export interface ProfileData {
  name: string;
  address: string;
  contactNumber: string;
  membershipId: string;
  admissionDate: string;
  gender: 'Male' | 'Female' | 'Other';
  plan: PlanDetails;
}

export interface PlanDetails {
  name: string;
  startDate: string;
  endDate: string;
  planAmount: string;
  discount: string;
  finalAmount: string;
  tax: string;
  paidAmount: string;
  dueAmount: string;
}

export interface DetailRowProps {
  label: string;
  value: string;
}

export interface BillDetails {
  billDate: string;
  invoiceNo: string;
  paidAmount: string;
}

