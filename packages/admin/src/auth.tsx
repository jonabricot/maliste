import type { User } from "better-auth";
import { createContext as createRouterContext } from "react-router";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { authClient } from "./api/auth-client";

export const routerUserContext = createRouterContext<User | null>(null);

const AuthContext = createContext<{user: User|null}>({user: null}) // Create context

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User|null>(null) // User state

  useEffect(() => {
    (async () => {
        const session = await authClient.getSession()
        if (session && session.data && session.data.user) setUser(session.data.user)
    })()
  },[])

  return <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}