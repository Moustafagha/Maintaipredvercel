import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { abTestingManager, AB_TESTS } from '../lib/ab-testing'
import { BarChart3, RefreshCw, Trash2 } from 'lucide-react'

const ABTestAnalytics = () => {
  const [analytics, setAnalytics] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const loadAnalytics = () => {
    setIsLoading(true)
    const data = abTestingManager.getAnalytics()
    setAnalytics(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  const resetData = () => {
    if (confirm('Are you sure you want to reset all A/B test data? This action cannot be undone.')) {
      abTestingManager.resetAssignments()
      loadAnalytics()
    }
  }

  const calculateConversionRate = (testId, variantId) => {
    const assignments = analytics[testId]?.assignments[variantId] || 0
    const conversions = analytics[testId]?.conversions[variantId]?.length || 0
    return assignments > 0 ? ((conversions / assignments) * 100).toFixed(2) : '0.00'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">A/B Test Analytics</h2>
          <p className="text-gray-600">Monitor the performance of your experiments</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadAnalytics} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="destructive" onClick={resetData}>
            <Trash2 className="h-4 w-4 mr-2" />
            Reset Data
          </Button>
        </div>
      </div>

      {Object.keys(analytics).length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No A/B Test Data Yet</h3>
              <p className="text-gray-600">
                Start interacting with the dashboard to generate A/B test data.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(analytics).map(([testId, data]) => {
            const test = AB_TESTS[testId]
            if (!test) return null

            return (
              <Card key={testId}>
                <CardHeader>
                  <CardTitle>{test.name}</CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(test.variants).map(([variantId, variant]) => {
                      const assignments = data.assignments[variantId] || 0
                      const conversions = data.conversions[variantId]?.length || 0
                      const conversionRate = calculateConversionRate(testId, variantId)

                      return (
                        <div key={variantId} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{variant.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              variantId === 'control' 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-green-100 text-green-600'
                            }`}>
                              {variantId === 'control' ? 'Control' : 'Variant'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Assignments</p>
                              <p className="font-semibold text-lg">{assignments}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Conversions</p>
                              <p className="font-semibold text-lg">{conversions}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Conversion Rate</p>
                              <p className="font-semibold text-lg">{conversionRate}%</p>
                            </div>
                          </div>

                          {data.conversions[variantId] && data.conversions[variantId].length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs text-gray-600 mb-1">Recent Conversions:</p>
                              <div className="flex flex-wrap gap-1">
                                {data.conversions[variantId].slice(-5).map((conversion, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-xs rounded"
                                  >
                                    {conversion.type.replace('_', ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current User Assignment</CardTitle>
          <CardDescription>Your current A/B test assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>User ID:</strong> {abTestingManager.userId}</p>
            {Object.entries(AB_TESTS).map(([testId, test]) => {
              const variantId = abTestingManager.getVariant(testId)
              const variant = test.variants[variantId]
              
              return (
                <div key={testId} className="flex justify-between items-center py-2 border-b">
                  <span>{test.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    variantId === 'control' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {variant?.name || 'Not Assigned'}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ABTestAnalytics

