'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Calculator,
  Download,
  Upload,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Calendar,
  Banknote,
  Receipt,
  PiggyBank,
  Building,
  Target,
  Settings
} from "lucide-react"

// Mock payroll data for PNG standards
const payrollData = {
  currentPeriod: 'September 2024',
  totalEmployees: 187,
  totalGrossPay: 2847500,
  totalNetPay: 2245600,
  totalTax: 398700,
  totalNasfund: 142375,
  totalWorkerComp: 14238,
  totalOtherDeductions: 46587,
  payrollStatus: 'processing', // 'not_started', 'processing', 'review', 'approved', 'paid', 'completed'
  lastProcessed: '2024-08-25',
  nextPayDate: '2024-09-30'
}

// PNG Tax brackets for 2024
const pngTaxBrackets = [
  { min: 0, max: 12500, rate: 0, description: 'Tax Free Threshold' },
  { min: 12501, max: 20000, rate: 22, description: '22% Tax Rate' },
  { min: 20001, max: 33000, rate: 30, description: '30% Tax Rate' },
  { min: 33001, max: 70000, rate: 35, description: '35% Tax Rate' },
  { min: 70001, max: Infinity, rate: 42, description: '42% Tax Rate' }
]

// Payroll process steps
const payrollSteps = [
  {
    id: 1,
    title: 'Employee Setup',
    description: 'Verify employee data and setup',
    status: 'completed',
    duration: '1 day',
    icon: Users,
    tasks: ['Verify employee records', 'Check new hires', 'Update terminations', 'Validate salary changes']
  },
  {
    id: 2,
    title: 'Time & Attendance',
    description: 'Collect and verify time data',
    status: 'completed',
    duration: '2 days',
    icon: Clock,
    tasks: ['Import attendance data', 'Verify overtime hours', 'Process leave applications', 'Calculate working days']
  },
  {
    id: 3,
    title: 'Gross Pay Calculation',
    description: 'Calculate basic pay and allowances',
    status: 'completed',
    duration: '1 day',
    icon: Calculator,
    tasks: ['Calculate basic salary', 'Process allowances', 'Calculate overtime pay', 'Add bonus payments']
  },
  {
    id: 4,
    title: 'PNG Tax Calculation',
    description: 'Apply PNG PAYE tax rates',
    status: 'in_progress',
    duration: '1 day',
    icon: Receipt,
    tasks: ['Apply tax brackets', 'Calculate PAYE', 'Process tax credits', 'Generate tax statements']
  },
  {
    id: 5,
    title: 'Statutory Deductions',
    description: 'NASFUND & Workers Compensation',
    status: 'pending',
    duration: '1 day',
    icon: PiggyBank,
    tasks: ['Calculate NASFUND (8.4%)', 'Workers Compensation (0.5%)', 'Other statutory deductions', 'Validate calculations']
  },
  {
    id: 6,
    title: 'Voluntary Deductions',
    description: 'Process voluntary deductions',
    status: 'pending',
    duration: '1 day',
    icon: Banknote,
    tasks: ['Loan repayments', 'Union dues', 'Insurance premiums', 'Other deductions']
  },
  {
    id: 7,
    title: 'Net Pay & Reports',
    description: 'Finalize calculations and reports',
    status: 'pending',
    duration: '1 day',
    icon: FileText,
    tasks: ['Calculate net pay', 'Generate payslips', 'Create payroll reports', 'Generate bank files']
  },
  {
    id: 8,
    title: 'Approval & Payment',
    description: 'Final approval and payment processing',
    status: 'pending',
    duration: '1 day',
    icon: CheckCircle,
    tasks: ['Management approval', 'Bank file submission', 'Payment confirmation', 'Post-payroll tasks']
  }
]

const staffBreakdown = [
  { category: 'Academic Staff', count: 89, grossPay: 1401750, avgSalary: 15750 },
  { category: 'Non-Academic Staff', count: 67, grossPay: 1042200, avgSalary: 15550 },
  { category: 'Laborers & Support', count: 31, grossPay: 403550, avgSalary: 13020 }
]

export default function PayrollDashboard() {
  const [selectedStep, setSelectedStep] = useState(4)

  const getStepStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-green-500', textColor: 'text-green-600', label: 'Completed' }
      case 'in_progress':
        return { color: 'bg-blue-500', textColor: 'text-blue-600', label: 'In Progress' }
      case 'pending':
        return { color: 'bg-gray-300', textColor: 'text-gray-600', label: 'Pending' }
      default:
        return { color: 'bg-gray-300', textColor: 'text-gray-600', label: 'Not Started' }
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">PNG Payroll Processing Dashboard</h1>
        <p className="text-gray-600">
          Complete payroll processing workflow for {payrollData.currentPeriod} - PNG Standard Compliance
        </p>
      </div>

      {/* Current Payroll Status */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Current Payroll Status: {payrollData.currentPeriod}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-blue-600">{payrollData.totalEmployees}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Gross Pay</p>
              <p className="text-2xl font-bold text-green-600">K {payrollData.totalGrossPay.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Net Pay</p>
              <p className="text-2xl font-bold text-blue-600">K {payrollData.totalNetPay.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Next Pay Date</p>
              <p className="text-lg font-bold text-purple-600">{payrollData.nextPayDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Process Flow */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Payroll Processing Workflow</h2>

        {/* Process Timeline */}
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
          {payrollSteps.map((step, index) => {
            const status = getStepStatus(step.status)
            const isSelected = selectedStep === step.id

            return (
              <div
                key={step.id}
                className={`relative cursor-pointer transition-all ${
                  isSelected ? 'transform scale-105' : ''
                }`}
                onClick={() => setSelectedStep(step.id)}
              >
                <Card className={`${isSelected ? 'border-blue-400 shadow-lg' : 'border-gray-200'}`}>
                  <CardContent className="p-4 text-center">
                    <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step.status === 'completed' ? 'bg-green-100' :
                      step.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <step.icon className={`w-5 h-5 ${status.textColor}`} />
                    </div>
                    <h3 className="text-xs font-medium text-gray-900 mb-1">{step.title}</h3>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${status.textColor}`}
                    >
                      {status.label}
                    </Badge>
                  </CardContent>
                </Card>

                {/* Arrow connector */}
                {index < payrollSteps.length - 1 && (
                  <ArrowRight className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hidden lg:block" />
                )}
              </div>
            )
          })}
        </div>

        {/* Selected Step Details */}
        {selectedStep && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(payrollSteps[selectedStep - 1].icon, { className: "w-5 h-5" })}
                Step {selectedStep}: {payrollSteps[selectedStep - 1].title}
              </CardTitle>
              <CardDescription>
                {payrollSteps[selectedStep - 1].description} | Duration: {payrollSteps[selectedStep - 1].duration}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Tasks in this step:</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {payrollSteps[selectedStep - 1].tasks.map((task, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{task}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Start Step
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* PNG Tax & Deductions Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* PNG Tax Brackets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              PNG Tax Brackets 2024
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pngTaxBrackets.map((bracket, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">
                      K {bracket.min.toLocaleString()} - {bracket.max === Infinity ? 'Above' : `K ${bracket.max.toLocaleString()}`}
                    </p>
                    <p className="text-xs text-gray-600">{bracket.description}</p>
                  </div>
                  <Badge variant={bracket.rate === 0 ? "secondary" : "default"}>
                    {bracket.rate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statutory Deductions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              PNG Statutory Deductions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">NASFUND Superannuation</p>
                  <p className="text-xs text-gray-600">Employee contribution</p>
                </div>
                <div className="text-right">
                  <Badge variant="default">8.4%</Badge>
                  <p className="text-xs text-gray-600">K {payrollData.totalNasfund.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Workers Compensation</p>
                  <p className="text-xs text-gray-600">Employer contribution</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">0.5%</Badge>
                  <p className="text-xs text-gray-600">K {payrollData.totalWorkerComp.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">PAYE Tax</p>
                  <p className="text-xs text-gray-600">As per PNG tax brackets</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">Variable</Badge>
                  <p className="text-xs text-gray-600">K {payrollData.totalTax.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Payroll Breakdown by Staff Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {staffBreakdown.map((staff, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{staff.category}</h3>
                  <Badge variant="secondary">{staff.count} employees</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Gross Pay:</span>
                    <span className="text-sm font-medium">K {staff.grossPay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Salary:</span>
                    <span className="text-sm font-medium">K {staff.avgSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Payroll Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import Time Data
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calculator className="mr-2 h-4 w-4" />
              Run Payroll Calculation
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Bank File
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Payroll Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">Tax tables updated</p>
              <p className="text-xs text-yellow-600">PNG 2024 tax rates are now active</p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800">5 pending approvals</p>
              <p className="text-xs text-blue-600">Salary adjustments awaiting approval</p>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">Deadline: 3 days</p>
              <p className="text-xs text-red-600">Complete payroll by September 27th</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
