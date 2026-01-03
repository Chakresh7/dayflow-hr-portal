import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Search, Plus, User, MoreVertical, Clock, Calendar, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const tabs = [
  { label: 'Employees', value: 'employees' },
  { label: 'Attendance', value: 'attendance' },
  { label: 'Time Off', value: 'time-off' },
];

interface Employee {
  id: string;
  user_id: string;
  name: string;
  email: string;
  department: string | null;
  position: string | null;
  employee_id: string | null;
  avatar_url: string | null;
}

interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: string;
  reason: string | null;
  profiles: { name: string } | null;
}

export default function HRDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, name, email, department, position, employee_id, avatar_url');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    emp =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.department?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (emp.position?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
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
            loading={loading}
            onEmployeeAdded={fetchEmployees}
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
  loading,
  onEmployeeAdded,
}: {
  employees: Employee[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectEmployee: (employee: Employee) => void;
  loading: boolean;
  onEmployeeAdded: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    position: '',
    phone: '',
    role: 'EMPLOYEE' as 'EMPLOYEE' | 'HR',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role,
            phone: formData.phone,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update the profile with additional info
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            department: formData.department,
            position: formData.position,
          })
          .eq('user_id', authData.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }
      }

      toast.success('Employee added successfully');
      setIsDialogOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        department: '',
        position: '',
        phone: '',
        role: 'EMPLOYEE',
      });
      onEmployeeAdded();
    } catch (error: any) {
      console.error('Error adding employee:', error);
      toast.error(error.message || 'Failed to add employee');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Employees</h1>
          <p className="text-muted-foreground mt-1">Manage your team members</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary w-auto px-4 py-2.5 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Employee
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-lg">Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs">Temporary Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="h-9"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="department" className="text-xs">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="position" className="text-xs">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="role" className="text-xs">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: 'EMPLOYEE' | 'HR') => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Employee Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map(employee => (
            <div
              key={employee.id}
              onClick={() => onSelectEmployee(employee)}
              className="card-elevated p-5 cursor-pointer hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center overflow-hidden">
                  {employee.avatar_url ? (
                    <img src={employee.avatar_url} alt={employee.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <span className="status-badge status-active">active</span>
              </div>
              <h3 className="font-medium text-foreground mb-1">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{employee.position || 'No position'}</p>
              <p className="text-sm text-muted-foreground">{employee.department || 'No department'}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && employees.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No employees found</p>
          <p className="text-sm text-muted-foreground mt-1">Click "New Employee" to add your first team member</p>
        </div>
      )}
    </div>
  );
}

function TimeOffTab() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      // Fetch leave requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('leave_requests')
        .select('id, user_id, leave_type, start_date, end_date, status, reason')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Fetch all profiles to map names
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, name');

      if (profilesError) throw profilesError;

      // Create a map of user_id to name
      const profileMap = new Map(profilesData?.map(p => [p.user_id, p.name]) || []);

      // Combine the data
      const combinedData = (requestsData || []).map(request => ({
        ...request,
        profiles: { name: profileMap.get(request.user_id) || 'Unknown' },
      }));

      setLeaveRequests(combinedData);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ 
          status: newStatus,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;
      toast.success(`Leave request ${newStatus}`);
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error updating leave request:', error);
      toast.error('Failed to update leave request');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Time Off Requests</h1>
        <p className="text-muted-foreground mt-1">Review and manage leave requests</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && leaveRequests.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No leave requests found</p>
        </div>
      )}

      {!loading && leaveRequests.length > 0 && (
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
                {leaveRequests.map(request => (
                  <tr key={request.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {request.profiles?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{request.leave_type}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{request.start_date}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{request.end_date}</td>
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
                      {request.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleStatusUpdate(request.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(request.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function EmployeeDetailPanel({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  const [leaveBalance, setLeaveBalance] = useState<{ vacation_days: number; sick_days: number; personal_days: number; vacation_used: number; sick_used: number; personal_used: number } | null>(null);
  const [monthlyHours, setMonthlyHours] = useState<number>(0);

  useEffect(() => {
    fetchEmployeeStats();
  }, [employee.user_id]);

  const fetchEmployeeStats = async () => {
    try {
      // Fetch leave balance
      const { data: leaveData } = await supabase
        .from('leave_balances')
        .select('vacation_days, sick_days, personal_days, vacation_used, sick_used, personal_used')
        .eq('user_id', employee.user_id)
        .eq('year', new Date().getFullYear())
        .maybeSingle();

      setLeaveBalance(leaveData);

      // Fetch monthly attendance hours
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('total_hours')
        .eq('user_id', employee.user_id)
        .gte('date', startOfMonth.toISOString().split('T')[0]);

      const totalHours = attendanceData?.reduce((sum, record) => sum + (Number(record.total_hours) || 0), 0) || 0;
      setMonthlyHours(totalHours);
    } catch (error) {
      console.error('Error fetching employee stats:', error);
    }
  };

  const totalLeaveBalance = leaveBalance 
    ? (leaveBalance.vacation_days - leaveBalance.vacation_used) + 
      (leaveBalance.sick_days - leaveBalance.sick_used) + 
      (leaveBalance.personal_days - leaveBalance.personal_used)
    : 0;

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
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center overflow-hidden">
              {employee.avatar_url ? (
                <img src={employee.avatar_url} alt={employee.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{employee.position || 'No position'}</p>
              <span className="status-badge mt-2 status-active">active</span>
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
                {employee.employee_id && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Employee ID:</span>{' '}
                    <span className="text-foreground">{employee.employee_id}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="card-elevated p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Work Information</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Department:</span>{' '}
                  <span className="text-foreground">{employee.department || 'Not assigned'}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Position:</span>{' '}
                  <span className="text-foreground">{employee.position || 'Not assigned'}</span>
                </p>
              </div>
            </div>

            <div className="card-elevated p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{monthlyHours.toFixed(1)}h</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{totalLeaveBalance} days</p>
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
