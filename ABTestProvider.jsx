import React, { createContext, useContext, useEffect, useState } from 'react'
import { abTestingManager } from '../lib/ab-testing'

const ABTestContext = createContext()

export const ABTestProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize A/B testing manager
    setIsInitialized(true)
  }, [])

  const value = {
    abTestingManager,
    isInitialized
  }

  return (
    <ABTestContext.Provider value={value}>
      {children}
    </ABTestContext.Provider>
  )
}

export const useABTestContext = () => {
  const context = useContext(ABTestContext)
  if (!context) {
    throw new Error('useABTestContext must be used within an ABTestProvider')
  }
  return context
}

