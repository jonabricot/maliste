import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { authClient } from "./api/auth-client";
import { queryClient } from "./api/query";
import { UserType } from "api/types";

export const defaultAuthContext = {
  user: null, 
  login: null, 
  logout: null
}

export type AuthContextType = {
  user: UserType|null, 
  login: ((...parameters: Parameters<typeof authClient.signIn.email>) => ReturnType<typeof authClient.signIn.email>) | null, 
  logout: ((...parameters: Parameters<typeof authClient.signOut>) => ReturnType<typeof authClient.signOut>) | null
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserType|null>(null)
  const [hydrated, setHydrated] = useState(false)

  async function updateUser() {
    queryClient.invalidateQueries({queryKey: ['session']})
    setUser(await provideUser())
  }

  useEffect(() => {
    (async () => {
        await updateUser()
        setHydrated(true)
    })()
  }, [])

  async function login(...parameters: Parameters<typeof authClient.signIn.email>) {
    const response = await authClient.signIn.email(...parameters)
    if (response.data) await updateUser()
    return response
  }

  async function logout(...parameters: Parameters<typeof authClient.signOut>) {
    const response = await authClient.signOut(...parameters)
    if (response.data) await updateUser()
    return response
  }

  return <AuthContext.Provider value={{ user, login, logout }}>
      {hydrated && children}
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

    return null
}