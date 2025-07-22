import React from 'react'
import { Button } from './ui/button'
import { useABTest } from '../lib/ab-testing'
import { cn } from '../lib/utils'

const ABTestButton = ({ 
  children, 
  onClick, 
  className, 
  variant = "default", 
  size = "default",
  testId = "dashboardButtonColor",
  conversionType = "button_click",
  ...props 
}) => {
  const { config, trackConversion, isInVariant } = useABTest(testId)

  const handleClick = (e) => {
    // Track the conversion
    trackConversion(conversionType, 1)
    
    // Call the original onClick handler
    if (onClick) {
      onClick(e)
    }
  }

  // Apply A/B test styling if config is available
  let buttonClassName = className
  if (config && config.primaryButtonClass) {
    buttonClassName = cn(config.primaryButtonClass, className)
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={buttonClassName}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  )
}

export default ABTestButton

