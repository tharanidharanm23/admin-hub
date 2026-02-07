import { User, Shield, Settings, Database, Bell, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type SettingsSection = 'profile' | 'roles' | 'platform';

export function SettingsView() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  const sections = [
    { id: 'profile' as const, label: 'Admin Profile', icon: User },
    { id: 'roles' as const, label: 'Role Management', icon: Shield },
    { id: 'platform' as const, label: 'Platform Settings', icon: Settings },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-64 border-r border-border p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Settings</h2>
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeSection === 'profile' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold text-foreground mb-6">Admin Profile</h1>

            <div className="card-surface p-6 space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>

              <Separator />

              {/* Profile Form */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="User" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="admin@learnhub.com" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 " />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'roles' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold text-foreground mb-6">Role Management</h1>

            <div className="card-surface p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-foreground">User Roles</h3>
                  <p className="text-sm text-muted-foreground">Manage roles and permissions</p>
                </div>
                <Button>Add Role</Button>
              </div>

              <div className="space-y-3">
                {['Super Admin', 'Course Admin', 'Content Manager', 'Viewer'].map((role) => (
                  <div key={role} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{role}</span>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'platform' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold text-foreground mb-6">Platform Settings</h1>

            <div className="space-y-4">
              {/* Branding */}
              <div className="card-surface p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Branding</h3>
                    <p className="text-sm text-muted-foreground">Customize your platform appearance</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input id="platformName" defaultValue="LearnHub" />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
                      <p className="text-sm text-muted-foreground">Click to upload logo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="card-surface p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Notifications</h3>
                    <p className="text-sm text-muted-foreground">Configure notification settings</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Notification settings coming soon...</p>
              </div>

              {/* Database */}
              <div className="card-surface p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Data & Storage</h3>
                    <p className="text-sm text-muted-foreground">Manage data and storage settings</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Data settings coming soon...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
