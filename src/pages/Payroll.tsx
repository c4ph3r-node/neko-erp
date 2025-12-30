import React, { useState } from 'react';
import { Plus, Search, Users, DollarSign, Calendar, FileText, Download, Eye, Edit, Clock, CheckCircle, AlertTriangle, UserPlus, Calculator, Printer, Trash2, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import EmployeeForm from '../components/Forms/EmployeeForm';
import PayrollRunForm from '../components/Forms/PayrollRunForm';
import TimesheetForm from '../components/Forms/TimesheetForm';
import LeaveRequestForm from '../components/Forms/LeaveRequestForm';
import { useGlobalState } from '../contexts/GlobalStateContext';

const mockEmployees = [
  {
    id: 1,
    employeeNumber: 'EMP-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    position: 'Software Engineer',
    department: 'Engineering',
    salary: 75000,
    payFrequency: 'monthly',
    hireDate: '2023-01-15',
    status: 'active',
    lastPayroll: '2025-01-01',
    ytdGross: 6250.00,
    ytdDeductions: 1875.00,
    ytdNet: 4375.00,
    address: '123 Main St, City, State 12345',
    taxId: '123-45-6789',
    bankAccount: {
      accountNumber: '****1234',
      routingNumber: '123456789',
      bankName: 'First National Bank'
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543'
    }
  },
  {
    id: 2,
    employeeNumber: 'EMP-002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1 (555) 234-5678',
    position: 'Marketing Manager',
    department: 'Marketing',
    salary: 65000,
    payFrequency: 'monthly',
    hireDate: '2022-08-20',
    status: 'active',
    lastPayroll: '2025-01-01',
    ytdGross: 5416.67,
    ytdDeductions: 1625.00,
    ytdNet: 3791.67,
    address: '456 Oak Ave, City, State 67890',
    taxId: '987-65-4321',
    bankAccount: {
      accountNumber: '****5678',
      routingNumber: '987654321',
      bankName: 'Community Bank'
    },
    emergencyContact: {
      name: 'Bob Smith',
      relationship: 'Brother',
      phone: '+1 (555) 876-5432'
    }
  }
];

const mockPayrollRuns = [
  {
    id: 1,
    payPeriod: 'January 2025',
    payPeriodStart: '2025-01-01',
    payPeriodEnd: '2025-01-31',
    payDate: '2025-01-31',
    status: 'processed',
    employeeCount: 15,
    totalGross: 125000.00,
    totalDeductions: 37500.00,
    totalNet: 87500.00,
    entries: [
      { employeeId: 1, employeeName: 'John Doe', grossPay: 6250.00, deductions: 1875.00, netPay: 4375.00 },
      { employeeId: 2, employeeName: 'Jane Smith', grossPay: 5416.67, deductions: 1625.00, netPay: 3791.67 }
    ]
  },
  {
    id: 2,
    payPeriod: 'December 2024',
    payPeriodStart: '2024-12-01',
    payPeriodEnd: '2024-12-31',
    payDate: '2024-12-31',
    status: 'paid',
    employeeCount: 15,
    totalGross: 125000.00,
    totalDeductions: 37500.00,
    totalNet: 87500.00,
    entries: []
  }
];

const mockTimeEntries = [
  { id: 1, employeeId: 1, employee: 'John Doe', date: '2025-01-15', hoursWorked: 8, overtime: 0, project: 'Website Redesign', approved: true },
  { id: 2, employeeId: 2, employee: 'Jane Smith', date: '2025-01-15', hoursWorked: 8, overtime: 2, project: 'Marketing Campaign', approved: false },
  { id: 3, employeeId: 1, employee: 'John Doe', date: '2025-01-14', hoursWorked: 8, overtime: 1, project: 'Website Redesign', approved: true }
];

const mockLeaveRequests = [
  { id: 1, employeeId: 1, employee: 'John Doe', type: 'Vacation', startDate: '2025-02-01', endDate: '2025-02-05', days: 5, status: 'pending', reason: 'Family vacation' },
  { id: 2, employeeId: 2, employee: 'Jane Smith', type: 'Sick Leave', startDate: '2025-01-20', endDate: '2025-01-22', days: 3, status: 'approved', reason: 'Medical appointment' }
];

const mockAttendance = [
  { id: 1, employeeId: 1, employee: 'John Doe', date: '2025-01-15', checkIn: '09:00', checkOut: '17:30', totalHours: 8.5, status: 'present' },
  { id: 2, employeeId: 2, employee: 'Jane Smith', date: '2025-01-15', checkIn: '08:45', checkOut: '18:00', totalHours: 9.25, status: 'present' }
];

export default function Payroll() {
  const { formatCurrency } = useGlobalState();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState(mockEmployees);
  const [payrollRuns, setPayrollRuns] = useState(mockPayrollRuns);
  const [timeEntries, setTimeEntries] = useState(mockTimeEntries);
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showTimesheetModal, setShowTimesheetModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [showPayrollCalendarModal, setShowPayrollCalendarModal] = useState(false);
  const [showPayrollDetailsModal, setShowPayrollDetailsModal] = useState(false);
  const [showLeaveCalendarModal, setShowLeaveCalendarModal] = useState(false);
  const [showManualAttendanceModal, setShowManualAttendanceModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [editingPayroll, setEditingPayroll] = useState<any>(null);

  const filteredEmployees = employees.filter(employee =>
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const avgSalary = totalPayroll / totalEmployees;

  // Employee CRUD Operations
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowEmployeeModal(true);
  };

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleSubmitEmployee = (employeeData: any) => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? { ...emp, ...employeeData } : emp));
    } else {
      const newEmployee = { ...employeeData, id: Date.now(), employeeNumber: `EMP-${String(employees.length + 1).padStart(3, '0')}` };
      setEmployees(prev => [...prev, newEmployee]);
    }
    setShowEmployeeModal(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (employeeId: number) => {
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    }
  };

  const handleViewEmployee = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setEditingEmployee(employee);
      setShowEmployeeModal(true);
    }
  };

  const handleSuspendEmployee = (employeeId: number) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, status: emp.status === 'suspended' ? 'active' : 'suspended' } : emp
    ));
  };

  const handleTerminateEmployee = (employeeId: number) => {
    if (confirm('Are you sure you want to terminate this employee?')) {
      setEmployees(prev => prev.map(emp => 
        emp.id === employeeId ? { ...emp, status: 'terminated' } : emp
      ));
    }
  };

  // Payroll CRUD Operations
  const handleCreatePayrollRun = () => {
    setEditingPayroll(null);
    setShowPayrollModal(true);
  };

  const handleSubmitPayrollRun = (payrollData: any) => {
    if (editingPayroll) {
      setPayrollRuns(prev => prev.map(run => run.id === editingPayroll.id ? { ...run, ...payrollData } : run));
    } else {
      const newPayrollRun = { ...payrollData, id: Date.now() };
      setPayrollRuns(prev => [...prev, newPayrollRun]);
    }
    setShowPayrollModal(false);
    setEditingPayroll(null);
  };

  const handleProcessPayroll = (payrollId: number) => {
    setPayrollRuns(prev => prev.map(run => 
      run.id === payrollId ? { ...run, status: 'processed' } : run
    ));
  };

  const handlePayPayroll = (payrollId: number) => {
    setPayrollRuns(prev => prev.map(run => 
      run.id === payrollId ? { ...run, status: 'paid' } : run
    ));
  };

  const handleDeletePayrollRun = (payrollId: number) => {
    const payrollRun = payrollRuns.find(run => run.id === payrollId);
    if (payrollRun?.status === 'paid') {
      alert('Cannot delete a paid payroll run');
      return;
    }
    if (confirm('Are you sure you want to delete this payroll run?')) {
      setPayrollRuns(prev => prev.filter(run => run.id !== payrollId));
    }
  };

  const handleViewPayrollRun = (payrollId: number) => {
    const payrollRun = payrollRuns.find(run => run.id === payrollId);
    if (payrollRun) {
      setEditingPayroll(payrollRun);
      setShowPayrollModal(true);
    }
  };

  // Timesheet Operations
  const handleAddTimeEntry = () => {
    setShowTimesheetModal(true);
  };

  const handleSubmitTimeEntry = (timeData: any) => {
    const newTimeEntry = { ...timeData, id: Date.now() };
    setTimeEntries(prev => [...prev, newTimeEntry]);
    setShowTimesheetModal(false);
  };

  const handleApproveTimeEntry = (entryId: number) => {
    setTimeEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, approved: true } : entry
    ));
  };

  const handleRejectTimeEntry = (entryId: number) => {
    setTimeEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, approved: false } : entry
    ));
  };

  const handleDeleteTimeEntry = (entryId: number) => {
    if (confirm('Are you sure you want to delete this time entry?')) {
      setTimeEntries(prev => prev.filter(entry => entry.id !== entryId));
    }
  };

  const handleEditTimeEntry = (entryId: number) => {
    const timeEntry = timeEntries.find(entry => entry.id === entryId);
    if (timeEntry) {
      setEditingEmployee(timeEntry);
      setShowTimesheetModal(true);
    }
  };

  // Leave Management Operations
  const handleAddLeaveRequest = () => {
    setShowLeaveModal(true);
  };

  const handleSubmitLeaveRequest = (leaveData: any) => {
    const newLeaveRequest = { ...leaveData, id: Date.now() };
    setLeaveRequests(prev => [...prev, newLeaveRequest]);
    setShowLeaveModal(false);
  };

  const handleApproveLeave = (leaveId: number) => {
    setLeaveRequests(prev => prev.map(leave => 
      leave.id === leaveId ? { ...leave, status: 'approved' } : leave
    ));
  };

  const handleRejectLeave = (leaveId: number) => {
    setLeaveRequests(prev => prev.map(leave => 
      leave.id === leaveId ? { ...leave, status: 'rejected' } : leave
    ));
  };

  const handleDeleteLeaveRequest = (leaveId: number) => {
    if (confirm('Are you sure you want to delete this leave request?')) {
      setLeaveRequests(prev => prev.filter(leave => leave.id !== leaveId));
    }
  };

  // const handleBulkApproveTimesheets = () => {
  //   setTimeEntries(prev => prev.map(entry => 
  //     entry.status === 'pending' ? { ...entry, status: 'approved' } : entry
  //   ));
  // };

  const handleViewLeaveRequest = (leaveId: number) => {
    const leaveRequest = leaveRequests.find(leave => leave.id === leaveId);
    if (leaveRequest) {
      setEditingEmployee(leaveRequest);
      setShowLeaveModal(true);
    }
  };

  const handleGeneratePayslips = (payrollId: number) => {
    alert(`Generating payslips for payroll run: ${payrollId}`);
    // Implementation for payslip generation
  };

  const handleExportPayroll = (payrollId: number) => {
    alert(`Exporting payroll data for payroll run: ${payrollId}`);
    // Implementation for payroll export
  };

  const handleBulkImportEmployees = () => {
    setShowBulkImportModal(true);
  };

  const handleBulkApproveTimesheets = () => {
    const pendingEntries = timeEntries.filter(entry => !entry.approved);
    if (pendingEntries.length === 0) {
      alert('No pending timesheets to approve');
      return;
    }
    if (confirm(`Are you sure you want to approve ${pendingEntries.length} pending timesheets?`)) {
      setTimeEntries(prev => prev.map(entry => ({ ...entry, approved: true })));
      alert('All pending timesheets approved successfully');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll & HR Management</h1>
          <p className="text-gray-600">Comprehensive employee management, payroll processing, and HR operations</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => navigate('/reports')}>
            <FileText className="w-4 h-4 mr-2" />
            Payroll Reports
          </Button>
          <Button variant="secondary" onClick={() => navigate('/reports')}>
            <Calculator className="w-4 h-4 mr-2" />
            Tax Reports
          </Button>
          <Button onClick={handleAddEmployee}>
            <UserPlus className="w-4 h-4 mr-2" />
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
              <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(avgSalary)}</p>
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
          <button
            onClick={() => setActiveTab('leave')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'leave'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Leave Management
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'attendance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Attendance
          </button>
        </nav>
      </div>

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
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
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={() => setShowBulkImportModal(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Employees
                </Button>
                <Button onClick={handleAddEmployee}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            </div>
          </Card>

          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">YTD Gross</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</p>
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
                        <p className="font-semibold text-gray-900">{formatCurrency(employee.salary)}</p>
                        <p className="text-xs text-gray-500">{employee.payFrequency}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-green-600">${employee.ytdGross.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewEmployee(employee.id)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditEmployee(employee)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleSuspendEmployee(employee.id)}
                            className="p-1 text-gray-500 hover:text-yellow-600"
                            title={employee.status === 'suspended' ? 'Activate Employee' : 'Suspend Employee'}
                          >
                            {employee.status === 'suspended' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
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
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={() => setShowPayrollCalendarModal(true)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Payroll Calendar
                </Button>
                <Button onClick={handleCreatePayrollRun}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Payroll Run
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payrollRuns.map((run) => (
                    <tr key={run.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{run.payPeriod}</p>
                        <p className="text-sm text-gray-500">{run.payPeriodStart} - {run.payPeriodEnd}</p>
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
                          run.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          run.status === 'processed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {run.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => { setEditingPayroll(run); setShowPayrollDetailsModal(true); }}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {run.status === 'processed' && (
                            <button 
                              onClick={() => handlePayPayroll(run.id)}
                              className="p-1 text-gray-500 hover:text-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleGeneratePayslips(run.id)}
                            className="p-1 text-gray-500 hover:text-purple-600"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleExportPayroll(run.id)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
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
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Time Tracking & Timesheets</h2>
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={() => handleBulkApproveTimesheets()}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Bulk Approve
                </Button>
                <Button onClick={handleAddTimeEntry}>
                  <Plus className="w-4 h-4 mr-2" />
                  Log Time
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Regular Hours</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeEntries.map((entry) => (
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
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          entry.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          {!entry.approved && (
                            <button 
                              onClick={() => handleApproveTimeEntry(entry.id)}
                              className="p-1 text-gray-500 hover:text-green-600"
                              title="Approve Time Entry"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {!entry.approved && (
                            <button 
                              onClick={() => handleRejectTimeEntry(entry.id)}
                              className="p-1 text-gray-500 hover:text-red-600"
                              title="Reject Time Entry"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleEditTimeEntry(entry.id)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title="Edit Time Entry"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTimeEntry(entry.id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                            title="Delete Time Entry"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Leave Management Tab */}
      {activeTab === 'leave' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Leave Management</h2>
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={() => setShowLeaveCalendarModal(true)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Leave Calendar
                </Button>
                <Button onClick={handleAddLeaveRequest}>
                  <Plus className="w-4 h-4 mr-2" />
                  Request Leave
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaveRequests.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{leave.employee}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{leave.type}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{leave.startDate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{leave.endDate}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-medium text-gray-900">{leave.days}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          leave.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {leave.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApproveLeave(leave.id)}
                                className="p-1 text-gray-500 hover:text-green-600"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleRejectLeave(leave.id)}
                                className="p-1 text-gray-500 hover:text-red-600"
                                title="Reject Leave Request"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleViewLeaveRequest(leave.id)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title="View Leave Request"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteLeaveRequest(leave.id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                            title="Delete Leave Request"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Attendance Tracking</h2>
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => navigate('/reports')}>
                <FileText className="w-4 h-4 mr-2" />
                Attendance Report
              </Button>
              <Button onClick={() => setShowManualAttendanceModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Manual Entry
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockAttendance.map((attendance) => (
                  <tr key={attendance.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">{attendance.employee}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{attendance.date}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{attendance.checkIn}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{attendance.checkOut}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-medium text-gray-900">{attendance.totalHours}h</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {attendance.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      <Modal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="xl"
      >
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleSubmitEmployee}
          onCancel={() => setShowEmployeeModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showPayrollModal}
        onClose={() => setShowPayrollModal(false)}
        title="Create Payroll Run"
        size="lg"
      >
        <PayrollRunForm
          onSubmit={handleSubmitPayrollRun}
          onCancel={() => setShowPayrollModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showTimesheetModal}
        onClose={() => setShowTimesheetModal(false)}
        title="Log Time Entry"
        size="lg"
      >
        <TimesheetForm
          employees={employees}
          onSubmit={handleSubmitTimeEntry}
          onCancel={() => setShowTimesheetModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Request Leave"
        size="lg"
      >
        <LeaveRequestForm
          employees={employees}
          onSubmit={handleSubmitLeaveRequest}
          onCancel={() => setShowLeaveModal(false)}
        />
      </Modal>
    </div>
  );
}