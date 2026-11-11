import { authClient } from "@/api/auth-client";
import { useAppStore } from "@/store"
import { useEffect } from "react"

export function useAuth() {
    const store = useAppStore()

    async function provideUser() {
        const session = await authClient.getSession()

        if (session.data) {
            store.setUser({id: session.data.user.id, token: session.data.session.token})
            return
        } 

        const register = await authClient.signIn.anonymous();
        if (register.data) {
            store.setUser({id: register.data.user.id, token: register.data.token})
        }
    }

    // async function createUser() {
    //     const { data } = await authClient.signIn.anonymous();
    //     // const response = await client.auth.anonymous.$get()
    //     // const user = await response.json()
    //     if (data) {
    //         store.setUser({id: data.user.id, token: data.token})
    //     }
    // }

    // async function checkUser() {
    //     if (!store.user) return
    //     const { data } = await authClient.getSession();
    //     // const response = await client.auth.anonymous.$post({json: store.user})

    //     if (!data) {
    //         store.resetUser()
    //     }
    // }

    useEffect(() => {
        provideUser()
    }, [store._hydrated]) 
}