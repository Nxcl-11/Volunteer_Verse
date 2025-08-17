"use client"
import { useRouter } from "next/navigation"

export function useLogout() {
    const router = useRouter()

    const handleLogout = () => {

        router.push("/login")
    }

    return handleLogout
}
