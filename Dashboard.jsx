import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import ABTestButton from './ABTestButton'
import ABTestAnalytics from './ABTestAnalytics'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { authUtils, dataUtils, analyticsAlgorithms } from '../lib/utils'
import { useABTest } from '../lib/ab-testing'
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Cog, 
  Database, 
  LogOut, 
  Monitor, 
  Shield, 
  TrendingUp,
  Wrench,
  Clock,
  DollarSign,
  Gauge
} from 'lucide-react'

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [machineData, setMachineData] = useState([])
  const [activities, setActivities] = useState([])
  const [predictiveData, setPredictiveData] = useState({})
  const [currentUser, setCurrentUser] = useState('')

  // A/B testing hooks
  const buttonColorTest = useABTest('dashboardButtonColor')
  const layoutTest = useABTest('dashboardLayout')

  useEffect(() => {
    // Initialize data
    setCurrentUser(authUtils.getCurrentUser())
    setMachineData(dataUtils.generateMachineData())
    setActivities(dataUtils.generateActivities())
    setPredictiveData(dataUtils.generatePredictiveData())

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMachineData(dataUtils.generateMachineData())
      setPredictiveData(dataUtils.generatePredictiveData())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    authUtils.logout()
    onLogout()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'maintenance': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getActivityStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'active': return 'text-red-600'
      case 'pending': return 'text-yellow-600'
      case 'in-progress': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const maintenanceSchedule = analyticsAlgorithms.calculateMaintenanceSchedule(machineData)
  const costSavings = analyticsAlgorithms.calculateCostSavings(machineData)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Cog className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">MaintAI Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="ab-tests">A/B Tests</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{machineData.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {machineData.filter(m => m.status === 'operational').length} operational
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(machineData.reduce((acc, m) => acc + m.efficiency, 0) / machineData.length)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +2.5% from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {machineData.filter(m => m.status === 'warning').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requires attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${Math.round(costSavings).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common maintenance tasks and system operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${layoutTest.config?.cardSpacing === 'tight' ? 'gap-2' : 'gap-4'}`}>
                  <ABTestButton 
                    variant="outline" 
                    className="h-20 flex-col"
                    testId="dashboardButtonColor"
                    conversionType="schedule_maintenance_click"
                  >
                    <Wrench className="h-6 w-6 mb-2" />
                    Schedule Maintenance
                  </ABTestButton>
                  <ABTestButton 
                    variant="outline" 
                    className="h-20 flex-col"
                    testId="dashboardButtonColor"
                    conversionType="view_reports_click"
                  >
                    <BarChart3 className="h-6 w-6 mb-2" />
                    View Reports
                  </ABTestButton>
                  <ABTestButton 
                    variant="outline" 
                    className="h-20 flex-col"
                    testId="dashboardButtonColor"
                    conversionType="data_export_click"
                  >
                    <Database className="h-6 w-6 mb-2" />
                    Data Export
                  </ABTestButton>
                  <ABTestButton 
                    variant="outline" 
                    className="h-20 flex-col"
                    testId="dashboardButtonColor"
                    conversionType="security_check_click"
                  >
                    <Shield className="h-6 w-6 mb-2" />
                    Security Check
                  </ABTestButton>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest maintenance activities and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        <Activity className={`h-5 w-5 ${getActivityStatusColor(activity.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">
                          {activity.technician} • {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Machine Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Machine Status</CardTitle>
                <CardDescription>Real-time monitoring of all machines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {machineData.map((machine) => (
                    <Card key={machine.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{machine.id}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(machine.status)}`}>
                          {machine.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Efficiency:</span>
                          <span className="font-medium">{machine.efficiency}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temperature:</span>
                          <span className="font-medium">{machine.temperature}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vibration:</span>
                          <span className="font-medium">{machine.vibration.toFixed(1)} Hz</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Maintenance:</span>
                          <span className="font-medium">{machine.lastMaintenance}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Predictive Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Predictive Insights</CardTitle>
                  <CardDescription>AI-powered maintenance predictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Failure Probability</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {(predictiveData.failureProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Recommended Maintenance</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {predictiveData.recommendedMaintenance} days
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Potential Savings</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">
                      ${predictiveData.costSavings?.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Schedule</CardTitle>
                  <CardDescription>Optimized maintenance recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {maintenanceSchedule.map((item) => (
                      <div key={item.machineId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.machineId}</p>
                          <p className="text-sm text-gray-500">
                            {item.recommendedDays} days • ${item.estimatedCost}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.urgency === 'high' ? 'bg-red-100 text-red-600' :
                          item.urgency === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {item.urgency}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Management</CardTitle>
                <CardDescription>Access control and security monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Access Control</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>Admin Access</span>
                        <span className="text-green-600 font-medium">Active</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>Technician Access</span>
                        <span className="text-green-600 font-medium">Active</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>Guest Access</span>
                        <span className="text-red-600 font-medium">Disabled</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Security Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>Firewall</span>
                        <span className="text-green-600 font-medium">Protected</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>SSL Certificate</span>
                        <span className="text-green-600 font-medium">Valid</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>Last Security Scan</span>
                        <span className="text-gray-600 font-medium">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* A/B Test Analytics Tab */}
          <TabsContent value="ab-tests" className="space-y-6">
            <ABTestAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default Dashboard

