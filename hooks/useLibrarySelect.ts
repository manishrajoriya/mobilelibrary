import { useState, useEffect } from "react"
import { getLibraries } from "@/firebase/functions"
import useStore from "@/hooks/store"
import { useRouter } from "expo-router"

export interface Library {
  id: string
  name: string
  address: string
  description: string
}

export function useLibrarySelection() {
  const [libraries, setLibraries] = useState<Library[]>([])
  const [loading, setLoading] = useState(true)
  const currentUser = useStore((state: any) => state.currentUser)
  const activeLibrary = useStore((state: any) => state.activeLibrary)
  const setActiveLibrary = useStore((state: any) => state.setActiveLibrary)
  const router = useRouter()

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const data = await getLibraries({ currentUser })
        if (Array.isArray(data)) {
          setLibraries(data)
          // If no library is selected and we have libraries, select the first one
          if (!activeLibrary && data.length > 0) {
            setActiveLibrary(data[0])
          }
        } else {
          throw new Error("Invalid data format")
        }
      } catch (error) {
        console.error("Error fetching libraries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLibraries()
  }, [currentUser, activeLibrary, setActiveLibrary])

  const handleLibrarySelect = (libraryId: string) => {
    const selected = libraries.find((lib) => lib.id === libraryId)
    if (selected) {
      setActiveLibrary(selected)
    }
    router.replace("/")
  }

  return {
    libraries,
    loading,
    activeLibrary,
    handleLibrarySelect,
  }
}

