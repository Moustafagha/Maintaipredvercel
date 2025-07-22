// A/B Testing Framework for MaintAI Platform

/**
 * A/B Testing Configuration
 * Define your experiments here
 */
export const AB_TESTS = {
  // Dashboard button color test
  dashboardButtonColor: {
    id: 'dashboard-button-color',
    name: 'Dashboard Button Color Test',
    description: 'Testing different button colors for better conversion',
    variants: {
      control: {
        id: 'control',
        name: 'Blue Buttons (Control)',
        weight: 50, // 50% of users
        config: {
          primaryButtonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
          secondaryButtonClass: 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        }
      },
      variant_a: {
        id: 'variant_a',
        name: 'Green Buttons (Variant A)',
        weight: 50, // 50% of users
        config: {
          primaryButtonClass: 'bg-green-600 hover:bg-green-700 text-white',
          secondaryButtonClass: 'bg-green-100 hover:bg-green-200 text-green-900'
        }
      }
    },
    active: true,
    startDate: '2025-01-01',
    endDate: '2025-12-31'
  },

  // Dashboard layout test
  dashboardLayout: {
    id: 'dashboard-layout',
    name: 'Dashboard Layout Test',
    description: 'Testing different dashboard layouts for better user engagement',
    variants: {
      control: {
        id: 'control',
        name: 'Standard Layout (Control)',
        weight: 50,
        config: {
          layout: 'standard',
          showQuickActions: true,
          cardSpacing: 'normal'
        }
      },
      variant_a: {
        id: 'variant_a',
        name: 'Compact Layout (Variant A)',
        weight: 50,
        config: {
          layout: 'compact',
          showQuickActions: false,
          cardSpacing: 'tight'
        }
      }
    },
    active: true,
    startDate: '2025-01-01',
    endDate: '2025-12-31'
  }
}

/**
 * User segmentation and assignment logic
 */
export class ABTestingManager {
  constructor() {
    this.userId = this.getUserId()
    this.assignments = this.loadAssignments()
  }

  /**
   * Get or create a unique user ID for consistent test assignment
   */
  getUserId() {
    let userId = localStorage.getItem('ab_test_user_id')
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
      localStorage.setItem('ab_test_user_id', userId)
    }
    return userId
  }

  /**
   * Load existing test assignments from localStorage
   */
  loadAssignments() {
    const stored = localStorage.getItem('ab_test_assignments')
    return stored ? JSON.parse(stored) : {}
  }

  /**
   * Save test assignments to localStorage
   */
  saveAssignments() {
    localStorage.setItem('ab_test_assignments', JSON.stringify(this.assignments))
  }

  /**
   * Hash function for consistent user assignment
   */
  hashUserId(testId) {
    const str = this.userId + testId
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Assign user to a test variant
   */
  assignVariant(testId) {
    // Check if user already has an assignment for this test
    if (this.assignments[testId]) {
      return this.assignments[testId]
    }

    const test = AB_TESTS[testId]
    if (!test || !test.active) {
      return null
    }

    // Check if test is within date range
    const now = new Date()
    const startDate = new Date(test.startDate)
    const endDate = new Date(test.endDate)
    
    if (now < startDate || now > endDate) {
      return null
    }

    // Use hash-based assignment for consistency
    const hash = this.hashUserId(testId)
    const variants = Object.values(test.variants)
    let cumulativeWeight = 0
    const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0)
    const threshold = (hash % 100) / 100 * totalWeight

    for (const variant of variants) {
      cumulativeWeight += variant.weight
      if (threshold <= cumulativeWeight) {
        this.assignments[testId] = variant.id
        this.saveAssignments()
        this.trackAssignment(testId, variant.id)
        return variant.id
      }
    }

    // Fallback to control
    const controlVariant = variants.find(v => v.id === 'control') || variants[0]
    this.assignments[testId] = controlVariant.id
    this.saveAssignments()
    this.trackAssignment(testId, controlVariant.id)
    return controlVariant.id
  }

  /**
   * Get the assigned variant for a test
   */
  getVariant(testId) {
    return this.assignVariant(testId)
  }

  /**
   * Get the configuration for a test variant
   */
  getVariantConfig(testId) {
    const variantId = this.getVariant(testId)
    if (!variantId) return null

    const test = AB_TESTS[testId]
    const variant = test?.variants[variantId]
    return variant?.config || null
  }

  /**
   * Check if user is in a specific variant
   */
  isInVariant(testId, variantId) {
    return this.getVariant(testId) === variantId
  }

  /**
   * Track test assignment (for analytics)
   */
  trackAssignment(testId, variantId) {
    const event = {
      type: 'ab_test_assignment',
      testId,
      variantId,
      userId: this.userId,
      timestamp: new Date().toISOString()
    }

    // Log to console for demo purposes
    console.log('A/B Test Assignment:', event)

    // Store in localStorage for demo analytics
    const events = JSON.parse(localStorage.getItem('ab_test_events') || '[]')
    events.push(event)
    localStorage.setItem('ab_test_events', JSON.stringify(events))

    // In a real application, you would send this to your analytics service
    // Example: analytics.track('A/B Test Assignment', event)
  }

  /**
   * Track conversion events
   */
  trackConversion(testId, conversionType, value = 1) {
    const variantId = this.getVariant(testId)
    if (!variantId) return

    const event = {
      type: 'ab_test_conversion',
      testId,
      variantId,
      conversionType,
      value,
      userId: this.userId,
      timestamp: new Date().toISOString()
    }

    // Log to console for demo purposes
    console.log('A/B Test Conversion:', event)

    // Store in localStorage for demo analytics
    const events = JSON.parse(localStorage.getItem('ab_test_events') || '[]')
    events.push(event)
    localStorage.setItem('ab_test_events', JSON.stringify(events))

    // In a real application, you would send this to your analytics service
    // Example: analytics.track('A/B Test Conversion', event)
  }

  /**
   * Get analytics data for all tests
   */
  getAnalytics() {
    const events = JSON.parse(localStorage.getItem('ab_test_events') || '[]')
    const analytics = {}

    // Group events by test
    events.forEach(event => {
      if (!analytics[event.testId]) {
        analytics[event.testId] = {
          assignments: {},
          conversions: {}
        }
      }

      if (event.type === 'ab_test_assignment') {
        if (!analytics[event.testId].assignments[event.variantId]) {
          analytics[event.testId].assignments[event.variantId] = 0
        }
        analytics[event.testId].assignments[event.variantId]++
      }

      if (event.type === 'ab_test_conversion') {
        if (!analytics[event.testId].conversions[event.variantId]) {
          analytics[event.testId].conversions[event.variantId] = []
        }
        analytics[event.testId].conversions[event.variantId].push({
          type: event.conversionType,
          value: event.value,
          timestamp: event.timestamp
        })
      }
    })

    return analytics
  }

  /**
   * Reset all test assignments (for testing purposes)
   */
  resetAssignments() {
    this.assignments = {}
    localStorage.removeItem('ab_test_assignments')
    localStorage.removeItem('ab_test_events')
  }
}

// Create a singleton instance
export const abTestingManager = new ABTestingManager()

/**
 * React hook for A/B testing
 */
export function useABTest(testId) {
  const variantId = abTestingManager.getVariant(testId)
  const config = abTestingManager.getVariantConfig(testId)
  
  const trackConversion = (conversionType, value) => {
    abTestingManager.trackConversion(testId, conversionType, value)
  }

  const isInVariant = (targetVariantId) => {
    return abTestingManager.isInVariant(testId, targetVariantId)
  }

  return {
    variantId,
    config,
    trackConversion,
    isInVariant
  }
}

