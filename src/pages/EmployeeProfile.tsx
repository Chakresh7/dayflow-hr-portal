import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockProfileData = {
  loginId: 'EMP042',
  mobile: '+1 (555) 987-6543',
  company: 'TechCorp Inc.',
  department: 'Engineering',
  manager: 'Sarah Johnson',
  location: 'San Francisco, CA',
  about: 'Software engineer with a passion for building scalable applications and solving complex problems. I thrive in collaborative environments and enjoy mentoring junior developers.',
  jobLove: 'I love the creative problem-solving aspect of my job. Every day presents new challenges that push me to learn and grow. Working with a talented team makes coming to work enjoyable.',
  interests: 'In my free time, I enjoy playing guitar, contributing to open-source projects, hiking in the Bay Area, and experimenting with new technologies.',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'GraphQL', 'PostgreSQL'],
  certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
};

export default function EmployeeProfile() {
  const { profile } = useAuth();
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
                <h1 className="text-2xl font-bold text-foreground">{profile?.name || 'My Name'}</h1>
                <p className="text-sm text-muted-foreground">{profile?.position || 'Software Engineer'}</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Login ID:</span> {profile?.employee_id || mockProfileData.loginId}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {profile?.email || 'email@example.com'}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {profile?.phone || mockProfileData.mobile}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Work Info */}
            <div className="lg:ml-auto grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Company</p>
                <p className="font-medium text-foreground">{profile?.company || mockProfileData.company}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium text-foreground">{profile?.department || mockProfileData.department}</p>
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
