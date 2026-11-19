import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { authClient } from "./api/auth-client";
import type { UserType } from "api/types";
import { queryClient } from "./api/query";


const AuthContext = createContext<{user: UserType|null}>({user: null})

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserType|null>(null)

  useEffect(() => {
    (async () => {
        const user = await provideUser()
        if (user) setUser(user)
    })()
  }, [])

  return <AuthContext.Provider value={{ user }}>
      {user && children}
    </AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

async function provideUser() {
    const session = await queryClient.query({ queryKey: ['session'], queryFn: () => authClient.getSession() })
    if (session && session.data && session.data.user) {
        return session.data.user as unknown as UserType
    }

    const anonymous = await authClient.signIn.anonymous()
    if (anonymous.data) {
        return anonymous.data.user as unknown as UserType
    }

    return null
}