import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { getPlans, getPlanById } from "@/firebase/functions"
import type { FormData, PlanData } from "@/types/MemberProfile"

export const useAddMemberForm = () => {
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
  }, [watch("planId"), setValue]) // Added setValue to dependencies

  useEffect(() => {
    const paidAmount = Number.parseFloat(watch("paidAmount")) || 0
    const totalAmount = Number.parseFloat(watch("totalAmount")) || 0
    const dueAmount = totalAmount - paidAmount
    setValue("dueAmount", dueAmount.toFixed(2))
  }, [watch("paidAmount"), watch("totalAmount"), setValue]) // Added setValue to dependencies

  useEffect(() => {
    const admissionDate = watch("admissionDate")
    const planDuration = selectedPlan ? Number.parseInt(selectedPlan.duration) : 0
    if (admissionDate && planDuration) {
      const expiryDate = new Date(admissionDate)
      expiryDate.setDate(expiryDate.getDate() + planDuration)
      setValue("expiryDate", expiryDate)
    }
  }, [watch("admissionDate"), selectedPlan, setValue]) // Added setValue to dependencies

  return {
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
    selectedPlan,
  }
}

