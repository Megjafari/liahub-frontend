import { createContext, useContext } from 'react'

type AuthModalContextType = {
  requireAuth: (isLoggedIn: boolean, action: () => void) => void
}

export const AuthModalContext = createContext<AuthModalContextType>({
  requireAuth: (_isLoggedIn, action) => action()
})

export const useAuthModalContext = () => useContext(AuthModalContext)