import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const mockProfileData = {
  loginId: 'HR001',
  mobile: '+1 (555) 123-4567',
  company: 'TechCorp Inc.',
  department: 'Human Resources',
  manager: 'John Smith',
  location: 'New York, NY',
  about: 'Passionate HR professional with over 5 years of experience in talent acquisition, employee relations, and organizational development. Dedicated to fostering a positive work environment and helping employees reach their full potential.',
  jobLove: 'I love connecting with people and helping them grow in their careers. Every day brings new challenges and opportunities to make a positive impact on our team members\' lives.',
  interests: 'Outside of work, I enjoy hiking, reading leadership books, attending HR conferences, and volunteering at local career development workshops.',
  skills: ['Recruitment', 'Employee Relations', 'HRIS Systems', 'Performance Management', 'Onboarding', 'Conflict Resolution'],
  certifications: ['SHRM-CP', 'PHR Certified', 'LinkedIn Recruiter'],
};

const mockSalaryData = {
  monthlyWage: 50000,
  yearlyWage: 600000,
  workingDays: 5,
  breakTime: 1,
  components: [
    { name: 'Basic Salary', amount: 25000, percentage: 50, description: 'Define Basic salary from company cost compute it based on monthly Wages.' },
    { name: 'House Rent Allowance', amount: 12500, percentage: 50, description: 'HRA provided to employee based on basic salary' },
    { name: 'Standard Allowance', amount: 4167, percentage: 16.67, description: 'A standard allowance is a predetermined, fixed amount provided to employee as part of their salary' },
    { name: 'Performance Bonus', amount: 2082.50, percentage: 8.33, description: 'Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary' },
    { name: 'Leave Travel Allowance', amount: 2082.50, percentage: 8.33, description: 'LTA is paid by the company to employees to cover their travel expenses. and calculated as a % of the basic salary' },
    { name: 'Fixed Allowance', amount: 2918, percentage: 11.67, description: 'Fixed allowance portion of wages is determined after calculating all salary components.' },
  ],
  pfContribution: {
    employee: { amount: 3000, percentage: 12 },
    employer: { amount: 3000, percentage: 12 },
    description: 'PF is calculated based on the basic salary'
  },
  taxDeductions: {
    professionalTax: { amount: 200, description: 'Professional Tax deducted from the Gross salary' }
  }
};

function SalaryInfoTab() {
  return (
    <div className="space-y-6">
      {/* Wage Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Month Wage</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{mockSalaryData.monthlyWage.toLocaleString()}</span>
              <span className="text-muted-foreground">/ Month</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Yearly wage</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{mockSalaryData.yearlyWage.toLocaleString()}</span>
              <span className="text-muted-foreground">/ Yearly</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">No of working days in a week:</span>
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                value={mockSalaryData.workingDays} 
                className="w-20 text-right" 
                readOnly
              />
              <span className="text-muted-foreground">/hrs</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Break Time:</span>
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                value={mockSalaryData.breakTime} 
                className="w-20 text-right" 
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Salary Components & PF */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Salary Components */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Salary Components</h3>
          <div className="space-y-4">
            {mockSalaryData.components.map((component, index) => (
              <div key={index} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{component.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-foreground">{component.amount.toLocaleString()} ₹ / month</span>
                    <span className="text-muted-foreground w-16 text-right">{component.percentage.toFixed(2)} %</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{component.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PF & Tax Deductions */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Provident Fund (PF) Contribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Employee</span>
                <div className="flex items-center gap-4">
                  <span className="text-foreground">{mockSalaryData.pfContribution.employee.amount.toLocaleString()}</span>
                  <span className="text-muted-foreground">₹ / month</span>
                  <span className="text-muted-foreground">{mockSalaryData.pfContribution.employee.percentage.toFixed(2)} %</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground">Employer</span>
                <div className="flex items-center gap-4">
                  <span className="text-foreground">{mockSalaryData.pfContribution.employer.amount.toLocaleString()}</span>
                  <span className="text-muted-foreground">₹ / month</span>
                  <span className="text-muted-foreground">{mockSalaryData.pfContribution.employer.percentage.toFixed(2)} %</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{mockSalaryData.pfContribution.description}</p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Tax Deductions</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground">Professional Tax</span>
              <div className="flex items-center gap-2">
                <span className="text-foreground">{mockSalaryData.taxDeductions.professionalTax.amount.toLocaleString()}</span>
                <span className="text-muted-foreground">₹ / month</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{mockSalaryData.taxDeductions.professionalTax.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResumeTab() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left Column - About Sections */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">About</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-muted-foreground leading-relaxed">{mockProfileData.about}</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">What I love about my job</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-muted-foreground leading-relaxed">{mockProfileData.jobLove}</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">My interests and hobbies</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-muted-foreground leading-relaxed">{mockProfileData.interests}</p>
        </div>
      </div>

      {/* Right Column - Skills & Certifications */}
      <div className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {mockProfileData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {skill}
              </Badge>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-4 text-primary">
            + Add Skills
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Certification</h2>
          <div className="space-y-2">
            {mockProfileData.certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm text-foreground">{cert}</span>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-4 text-primary">
            + Add Certification
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HRProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('resume');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative">
                <div className="w-28 h-28 bg-secondary rounded-full flex items-center justify-center">
                  <User className="w-14 h-14 text-muted-foreground" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">{user?.name || 'My Name'}</h1>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Login ID:</span> {mockProfileData.loginId}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {user?.email || 'email@example.com'}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {mockProfileData.mobile}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Work Info */}
            <div className="lg:ml-auto grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Company</p>
                <p className="font-medium text-foreground">{mockProfileData.company}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium text-foreground">{mockProfileData.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Manager</p>
                <p className="font-medium text-foreground">{mockProfileData.manager}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium text-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {mockProfileData.location}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mt-6 border-t border-border pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="private">Private Info</TabsTrigger>
                <TabsTrigger value="salary">Salary</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'resume' && <ResumeTab />}
        {activeTab === 'salary' && <SalaryInfoTab />}
        {activeTab === 'private' && (
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-muted-foreground">Private information content goes here.</p>
          </div>
        )}
      </main>
    </div>
  );
}
