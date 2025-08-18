import React, { useState } from 'react';
import { Plus, Search, Users, DollarSign, Calendar, FileText, Download, Eye, Edit } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const mockEmployees = [
  {
    id: 1,
    employeeNumber: 'EMP-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    position: 'Software Engineer',
    department: 'Engineering',
    salary: 75000,
    payFrequency: 'monthly',
    hireDate: '2023-01-15',
    status: 'active',
    lastPayroll: '2025-01-01',
    ytdGross: 6250.00,
    ytdDeductions: 1875.00,
    ytdNet: 4375.00
  },
  {
    id: 2,
    employeeNumber: 'EMP-002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    position: 'Marketing Manager',
    department: 'Marketing',
    salary: 65000,
    payFrequency: 'monthly',
    hireDate: '2022-08-20',
    status: 'active',
    lastPayroll: '2025-01-01',
    ytdGross: 5416.67,
    ytdDeductions: 1625.00,
    ytdNet: 3791.67
  },
  {
    id: 3,
    employeeNumber: 'EMP-003',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@company.com',
    position: 'Accountant',
    department: 'Finance',
    salary: 55000,
    payFrequency: 'monthly',
    hireDate: '2023-03-10',
    status: 'active',
    lastPayroll: '2025-01-01',
    ytdGross: 4583.33,
    ytdDeductions: 1375.00,
    ytdNet: 3208.33
  }
];

const mockPayrollRuns = [
  {
    id: 1,
    payPeriod: 'January 2025',
    payDate: '2025-01-31',
    status: 'processed',
    employeeCount: 15,
    totalGross: 125000.00,
    totalDeductions: 37500.00,
    totalNet: 87500.00
  },
  {
    id: 2,
    payPeriod: 'December 2024',
    payDate: '2024-12-31',
    status: 'paid',
    employeeCount: 15,
    totalGross: 125000.00,
    totalDeductions: 37500.00,
    totalNet: 87500.00
  },
  {
    id: 3,
    payPeriod: 'November 2024',
    payDate: '2024-11-30',
    status: 'paid',
    employeeCount: 14,
    totalGross: 116667.00,
    totalDeductions: 35000.00,
    totalNet: 81667.00
  }
];

const mockTimeEntries = [
  { id: 1, employee: 'John Doe', date: '2025-01-15', hoursWorked: 8, overtime: 0, project: 'Website Redesign' },
  { id: 2, employee: 'Jane Smith', date: '2025-01-15', hoursWorked: 8, overtime: 2, project: 'Marketing Campaign' },
  { id: 3, employee: 'Bob Johnson', date: '2025-01-15', hoursWorked: 7.5, overtime: 0, project: 'Financial Audit' },
  { id: 4, employee: 'John Doe', date: '2025-01-14', hoursWorked: 8, overtime: 1, project: 'Website Redesign' }
];

export default function Payroll() {
  const [activeTab, setActiveTab] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = mockEmployees.filter(employee =>
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
  const totalPayroll = mockEmployees.reduce((sum, emp) => sum + emp.salary, 0);
  const avgSalary = totalPayroll / totalEmployees;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll & HR</h1>
          <p className="text-gray-600">Manage employees, payroll processing, and HR operations</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <FileText className="w-4 h-4 mr-2" />
            Payroll Reports
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalEmployees}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Employees</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{activeEmployees}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Payroll</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">${(totalPayroll / 12).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Salary</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">${avgSalary.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('employees')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'employees'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payroll'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payroll Runs
          </button>
          <button
            onClick={() => setActiveTab('timesheet')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'timesheet'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Time Tracking
          </button>
        </nav>
      </div>

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          {/* Search */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </Card>

          {/* Employees Table */}
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salary
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      YTD Gross
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{employee.employeeNumber}</p>
                          <p className="text-sm text-gray-500">{employee.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{employee.position}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{employee.department}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-900">${employee.salary.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{employee.payFrequency}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-green-600">${employee.ytdGross.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          employee.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-500 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Payroll Runs Tab */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Payroll Processing</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Payroll Run
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pay Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pay Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gross Pay
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Pay
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockPayrollRuns.map((run) => (
                    <tr key={run.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{run.payPeriod}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{run.payDate}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm text-gray-900">{run.employeeCount}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-900">${run.totalGross.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-green-600">${run.totalNet.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          run.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : run.status === 'processed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {run.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-500 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-green-600">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Time Tracking Tab */}
      {activeTab === 'timesheet' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Time Tracking</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Log Time
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Regular Hours
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overtime
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockTimeEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">{entry.employee}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{entry.date}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{entry.project}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm text-gray-900">{entry.hoursWorked}h</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm text-orange-600">{entry.overtime}h</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-medium text-gray-900">{entry.hoursWorked + entry.overtime}h</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}