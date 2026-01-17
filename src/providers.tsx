'use client'

import { createContext, useContext, ReactNode } from 'react'

interface ContextProps {
  // Add your context types here
}

const Context = createContext<ContextProps>({} as ContextProps)

export function AppProvider({ children }: { children: ReactNode }) {
  const value = {
    // Your context values here
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useAppContext = () => useContext(Context)