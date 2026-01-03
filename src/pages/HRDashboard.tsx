import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Search, Plus, User, MoreVertical, Clock, Calendar, X } from 'lucide-react';

// Mock employee data
const mockEmployees = [
  { id: '1', name: 'John Smith', email: 'john@dayflow.com', department: 'Engineering', position: 'Software Developer', status: 'active' },
  { id: '2', name: 'Emily Chen', email: 'emily@dayflow.com', department: 'Design', position: 'UI/UX Designer', status: 'active' },
  { id: '3', name: 'Michael Brown', email: 'michael@dayflow.com', department: 'Marketing', position: 'Marketing Manager', status: 'active' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@dayflow.com', department: 'Sales', position: 'Sales Representative', status: 'inactive' },
  { id: '5', name: 'David Lee', email: 'david@dayflow.com', department: 'Engineering', position: 'Senior Developer', status: 'active' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa@dayflow.com', department: 'HR', position: 'HR Coordinator', status: 'active' },
];

const tabs = [
  { label: 'Employees', value: 'employees' },
  { label: 'Attendance', value: 'attendance' },
  { label: 'Time Off', value: 'time-off' },
];

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: string;
}

export default function HRDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = mockEmployees.filter(
    emp =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (value: string) => {
    if (value === 'attendance') {
      navigate('/hr/attendance');
    } else {
      setActiveTab(value);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="container mx-auto px-6 py-8">
        {activeTab === 'employees' && (
          <EmployeesTab
            employees={filteredEmployees}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectEmployee={setSelectedEmployee}
          />
        )}

        {activeTab === 'time-off' && <TimeOffTab />}
      </main>

      {/* Employee Detail Panel */}
      {selectedEmployee && (
        <EmployeeDetailPanel employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      )}
    </div>
  );
}

function EmployeesTab({
  employees,
  searchQuery,
  onSearchChange,
  onSelectEmployee,
}: {
  employees: Employee[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectEmployee: (employee: Employee) => void;
}) {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Employees</h1>
          <p className="text-muted-foreground mt-1">Manage your team members</p>
        </div>
        <button className="btn-primary w-auto px-4 py-2.5 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Employee
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(employee => (
          <div
            key={employee.id}
            onClick={() => onSelectEmployee(employee)}
            className="card-elevated p-5 cursor-pointer hover:border-foreground/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className={`status-badge ${employee.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                {employee.status}
              </span>
            </div>
            <h3 className="font-medium text-foreground mb-1">{employee.name}</h3>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
            <p className="text-sm text-muted-foreground">{employee.department}</p>
          </div>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No employees found</p>
        </div>
      )}
    </div>
  );
}

function TimeOffTab() {
  const timeOffRequests = [
    { name: 'John Smith', type: 'Vacation', startDate: '2024-01-20', endDate: '2024-01-25', status: 'pending' },
    { name: 'Emily Chen', type: 'Sick Leave', startDate: '2024-01-18', endDate: '2024-01-18', status: 'approved' },
    { name: 'Michael Brown', type: 'Personal', startDate: '2024-01-22', endDate: '2024-01-22', status: 'rejected' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Time Off Requests</h1>
        <p className="text-muted-foreground mt-1">Review and manage leave requests</p>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Employee</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Start Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">End Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeOffRequests.map((request, index) => (
                <tr key={index} className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{request.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{request.type}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{request.startDate}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{request.endDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`status-badge ${
                        request.status === 'approved'
                          ? 'status-active'
                          : request.status === 'pending'
                          ? 'status-pending'
                          : 'status-inactive'
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EmployeeDetailPanel({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Employee Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{employee.position}</p>
              <span className={`status-badge mt-2 ${employee.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                {employee.status}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="card-elevated p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Email:</span>{' '}
                  <span className="text-foreground">{employee.email}</span>
                </p>
              </div>
            </div>

            <div className="card-elevated p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Work Information</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Department:</span>{' '}
                  <span className="text-foreground">{employee.department}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Position:</span>{' '}
                  <span className="text-foreground">{employee.position}</span>
                </p>
              </div>
            </div>

            <div className="card-elevated p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">160h</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">12 days</p>
                    <p className="text-xs text-muted-foreground">Leave balance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button className="btn-secondary flex-1">Edit</button>
            <button className="btn-primary flex-1">Message</button>
          </div>
        </div>
      </div>
    </>
  );
}
