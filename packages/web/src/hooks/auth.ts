import { client } from "@/api/client"
import { useAppStore } from "@/store"
import { useEffect } from "react"

export function useAuth() {
    const store = useAppStore()

    async function createUser() {
        const response = await client.auth.anonymous.$get()
        const user = await response.json()
        if (user) {
            store.setUser({id: user.id, token: user.token!})
        }
    }

    async function checkUser() {
        if (!store.user) return
        const response = await client.auth.anonymous.$post({json: store.user})

        if (!response.ok) {
            store.resetUser()
        }
    }

    useEffect(() => {
        if (store._hydrated && !store.user) {
            createUser()
        }
        else if (store._hydrated && store.user) {
            checkUser()
        }

    }, [store._hydrated, store.user]) 
}