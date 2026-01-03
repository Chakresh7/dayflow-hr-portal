import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, Building2, MapPin, Users, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export default function HRProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('about');

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
                <TabsTrigger value="about">Resume</TabsTrigger>
                <TabsTrigger value="private">Private Info</TabsTrigger>
                <TabsTrigger value="salary">Salary</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content Grid */}
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
      </main>
    </div>
  );
}
