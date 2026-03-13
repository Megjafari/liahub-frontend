import { useState, useCallback } from 'react'

type PendingAction = (() => void) | null

export function useAuthModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const requireAuth = useCallback((isLoggedIn: boolean, action: () => void) => {
    if (isLoggedIn) {
      action()
    } else {
      setPendingAction(() => action)
      setIsOpen(true)
    }
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setPendingAction(null)
  }, [])

  const onLoginSuccess = useCallback(() => {
    if (pendingAction) {
      pendingAction()
    }
    closeModal()
  }, [pendingAction, closeModal])

  return { isOpen, requireAuth, closeModal, onLoginSuccess }
}