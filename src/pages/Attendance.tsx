import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays, subDays, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// Mock attendance data for all employees (Admin view)
const mockAllEmployeesAttendance = [
  { id: '1', name: 'John Smith', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
  { id: '2', name: 'Emily Chen', checkIn: '09:30', checkOut: '18:30', workHours: '09:00', extraHours: '01:00' },
  { id: '3', name: 'Michael Brown', checkIn: '10:15', checkOut: '19:15', workHours: '09:00', extraHours: '01:00' },
  { id: '4', name: 'Sarah Wilson', checkIn: '09:45', checkOut: '18:45', workHours: '09:00', extraHours: '01:00' },
  { id: '5', name: 'David Lee', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
];

// Mock monthly attendance for employee view
const generateEmployeeMonthlyAttendance = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = eachDayOfInterval({ start, end });
  
  return days.map((day, index) => {
    const dayOfWeek = day.getDay();
    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { date: day, checkIn: '-', checkOut: '-', workHours: '-', extraHours: '-', status: 'weekend' };
    }
    // Random attendance
    const isAbsent = index % 15 === 0;
    if (isAbsent) {
      return { date: day, checkIn: '-', checkOut: '-', workHours: '-', extraHours: '-', status: 'absent' };
    }
    return {
      date: day,
      checkIn: '10:00',
      checkOut: '19:00',
      workHours: '09:00',
      extraHours: '01:00',
      status: 'present'
    };
  }).filter(d => d.status !== 'weekend');
};

const hrTabs = [
  { label: 'Employees', value: 'employees' },
  { label: 'Attendance', value: 'attendance' },
  { label: 'Time Off', value: 'time-off' },
];

const employeeTabs = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Attendance', value: 'attendance' },
  { label: 'Time Off', value: 'time-off' },
];

export default function Attendance() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'HR';

  const tabs = isAdmin ? hrTabs : employeeTabs;

  const handleTabChange = (value: string) => {
    if (isAdmin) {
      if (value === 'employees') navigate('/hr/dashboard');
      else if (value === 'attendance') navigate('/hr/attendance');
      else if (value === 'time-off') navigate('/hr/dashboard');
    } else {
      if (value === 'dashboard') navigate('/employee/dashboard');
      else if (value === 'attendance') navigate('/employee/attendance');
      else if (value === 'time-off') navigate('/employee/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar tabs={tabs} activeTab="attendance" onTabChange={handleTabChange} />
      
      <main className="container mx-auto px-6 py-8">
        {isAdmin ? <AdminAttendanceView /> : <EmployeeAttendanceView />}
      </main>
    </div>
  );
}

function AdminAttendanceView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = mockAllEmployeesAttendance.filter(
    emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrevDay = () => setSelectedDate(prev => subDays(prev, 1));
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Attendance</h1>
        <p className="text-muted-foreground mt-1">View all employees attendance for the day</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevDay}
            className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button 
            onClick={handleNextDay}
            className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {format(selectedDate, 'dd MMM yyyy')}
            </span>
          </div>
          <button className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium">
            Day
          </button>
        </div>
      </div>

      {/* Date Display */}
      <div className="mb-4">
        <p className="text-center text-lg font-medium text-foreground">
          {format(selectedDate, 'd MMMM yyyy')}
        </p>
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Emp</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Check In</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Check Out</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Work Hours</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Extra Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((record) => (
                <tr key={record.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{record.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{record.checkIn}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{record.checkOut}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{record.workHours}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{record.extraHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No employees found</p>
        </div>
      )}
    </div>
  );
}

function EmployeeAttendanceView() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const attendanceData = generateEmployeeMonthlyAttendance(selectedMonth);

  const handlePrevMonth = () => setSelectedMonth(prev => subMonths(prev, 1));
  const handleNextMonth = () => setSelectedMonth(prev => addMonths(prev, 1));

  // Calculate stats
  const presentDays = attendanceData.filter(d => d.status === 'present').length;
  const absentDays = attendanceData.filter(d => d.status === 'absent').length;
  const totalWorkingDays = attendanceData.length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Attendance</h1>
        <p className="text-muted-foreground mt-1">Your monthly attendance records</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevMonth}
            className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {format(selectedMonth, 'MMM yyyy')}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="px-4 py-2 bg-secondary rounded-lg">
            <span className="text-sm text-muted-foreground">Days Present: </span>
            <span className="text-sm font-semibold text-foreground">{presentDays}</span>
          </div>
          <div className="px-4 py-2 bg-secondary rounded-lg">
            <span className="text-sm text-muted-foreground">Leaves: </span>
            <span className="text-sm font-semibold text-foreground">{absentDays}</span>
          </div>
          <div className="px-4 py-2 bg-secondary rounded-lg">
            <span className="text-sm text-muted-foreground">Total Working Days: </span>
            <span className="text-sm font-semibold text-foreground">{totalWorkingDays}</span>
          </div>
        </div>
      </div>

      {/* Month Display */}
      <div className="mb-4">
        <p className="text-center text-lg font-medium text-foreground">
          {format(selectedMonth, 'MMMM yyyy')}
        </p>
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Check In</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Check Out</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Work Hours</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Extra Hours</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr key={index} className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {format(record.date, 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{record.checkIn}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{record.checkOut}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{record.workHours}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{record.extraHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}