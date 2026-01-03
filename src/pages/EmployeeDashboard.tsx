import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { User, Clock, Calendar, DollarSign, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

export default function EmployeeDashboard() {
  const { profile } = useAuth();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Welcome back, {profile?.name?.split(' ')[0]}</h1>
          <p className="text-muted-foreground mt-1">{currentDate}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="card-elevated p-4 text-left hover:border-foreground/20 transition-colors">
            <Clock className="w-5 h-5 text-foreground mb-2" />
            <span className="text-sm font-medium text-foreground">Clock In</span>
          </button>
          <button className="card-elevated p-4 text-left hover:border-foreground/20 transition-colors">
            <Calendar className="w-5 h-5 text-foreground mb-2" />
            <span className="text-sm font-medium text-foreground">Request Leave</span>
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <ProfileCard profile={profile} />

          {/* Attendance Card */}
          <AttendanceCard />

          {/* Leave Requests Card */}
          <LeaveRequestsCard />

          {/* Payroll Card */}
          <PayrollCard />
        </div>
      </main>
    </div>
  );
}

function ProfileCard({ profile }: { profile: any }) {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground">Profile</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          View <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">{profile?.name}</h3>
          <p className="text-sm text-muted-foreground">{profile?.position}</p>
          <p className="text-sm text-muted-foreground">{profile?.department}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="text-foreground">{profile?.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Employee ID</p>
            <p className="text-foreground">{profile?.employee_id || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceCard() {
  const todayAttendance = {
    checkIn: '09:00 AM',
    checkOut: null,
    totalHours: '6h 30m',
    status: 'present',
  };

  const weeklyStats = [
    { day: 'Mon', hours: 8 },
    { day: 'Tue', hours: 7.5 },
    { day: 'Wed', hours: 8 },
    { day: 'Thu', hours: 6.5 },
    { day: 'Fri', hours: 0 },
  ];

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground">Attendance</h2>
        <span className="status-badge status-active">Today</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Check In</p>
          <p className="text-lg font-medium text-foreground">{todayAttendance.checkIn}</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Check Out</p>
          <p className="text-lg font-medium text-foreground">{todayAttendance.checkOut || '--:--'}</p>
        </div>
      </div>

      {/* Weekly Stats */}
      <div>
        <p className="text-sm text-muted-foreground mb-3">This Week</p>
        <div className="flex items-end justify-between gap-2 h-16">
          {weeklyStats.map((stat, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-secondary rounded-t"
                style={{ height: `${(stat.hours / 8) * 100}%`, minHeight: stat.hours > 0 ? '8px' : '2px' }}
              />
              <span className="text-xs text-muted-foreground">{stat.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeaveRequestsCard() {
  const leaveRequests = [
    { type: 'Vacation', dates: 'Jan 20 - Jan 25', status: 'pending' },
    { type: 'Sick Leave', dates: 'Jan 10', status: 'approved' },
    { type: 'Personal', dates: 'Dec 28', status: 'rejected' },
  ];

  const leaveBalance = { vacation: 12, sick: 5, personal: 3 };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground">Leave Requests</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Leave Balance */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-secondary/50 rounded-lg">
          <p className="text-2xl font-semibold text-foreground">{leaveBalance.vacation}</p>
          <p className="text-xs text-muted-foreground">Vacation</p>
        </div>
        <div className="text-center p-3 bg-secondary/50 rounded-lg">
          <p className="text-2xl font-semibold text-foreground">{leaveBalance.sick}</p>
          <p className="text-xs text-muted-foreground">Sick</p>
        </div>
        <div className="text-center p-3 bg-secondary/50 rounded-lg">
          <p className="text-2xl font-semibold text-foreground">{leaveBalance.personal}</p>
          <p className="text-xs text-muted-foreground">Personal</p>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="space-y-3">
        {leaveRequests.map((request, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-medium text-foreground">{request.type}</p>
              <p className="text-xs text-muted-foreground">{request.dates}</p>
            </div>
            {request.status === 'approved' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : request.status === 'rejected' ? (
              <XCircle className="w-5 h-5 text-red-500" />
            ) : (
              <span className="status-badge status-pending">{request.status}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PayrollCard() {
  const payrollInfo = {
    lastPayDate: 'January 1, 2024',
    netPay: '$5,420.00',
    nextPayDate: 'February 1, 2024',
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground">Payroll</h2>
        <DollarSign className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Last Pay</p>
          <p className="text-2xl font-semibold text-foreground">{payrollInfo.netPay}</p>
          <p className="text-xs text-muted-foreground mt-1">{payrollInfo.lastPayDate}</p>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Next Pay Date</p>
            <p className="text-sm font-medium text-foreground">{payrollInfo.nextPayDate}</p>
          </div>
          <button className="btn-secondary text-sm">View Payslips</button>
        </div>
      </div>
    </div>
  );
}
