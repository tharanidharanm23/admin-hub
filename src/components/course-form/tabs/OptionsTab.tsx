import { Course, AccessType } from '@/types/lms';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { responsiblePersons } from '@/data/mockData';
import { Users, Lock, UserCheck, CreditCard, Globe } from 'lucide-react';

interface OptionsTabProps {
  course: Course;
  onUpdate: (updates: Partial<Course>) => void;
}

const visibilityOptions = [
  { value: 'everyone', label: 'Everyone', description: 'Visible to all visitors', icon: Globe },
  { value: 'signed-in', label: 'Signed-in Users', description: 'Only visible to logged-in users', icon: Users },
];

const accessOptions = [
  { value: 'open', label: 'Open Access', description: 'Anyone can enroll freely', icon: Globe },
  { value: 'invitation', label: 'By Invitation', description: 'Users need an invitation to enroll', icon: UserCheck },
  { value: 'paid', label: 'Paid', description: 'Users must pay to access', icon: CreditCard },
];

export function OptionsTab({ course, onUpdate }: OptionsTabProps) {
  const getVisibility = () => {
    if (course.accessType === 'everyone' || course.accessType === 'signed-in') {
      return course.accessType;
    }
    return 'everyone';
  };

  const getAccessRule = () => {
    if (['open', 'invitation', 'paid'].includes(course.accessType)) {
      return course.accessType;
    }
    return 'open';
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Show Course To */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Course Visibility</h3>
          <p className="text-sm text-muted-foreground">Who can see this course in the catalog</p>
        </div>
        <RadioGroup
          value={getVisibility()}
          onValueChange={(value) => onUpdate({ accessType: value as AccessType })}
          className="space-y-3"
        >
          {visibilityOptions.map((option) => {
            const Icon = option.icon;
            return (
              <label
                key={option.value}
                className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value={option.value} className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{option.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{option.description}</p>
                </div>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Access Rules */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Access Rules</h3>
          <p className="text-sm text-muted-foreground">How users can enroll in this course</p>
        </div>
        <RadioGroup
          value={getAccessRule()}
          onValueChange={(value) => {
            onUpdate({ accessType: value as AccessType });
            if (value !== 'paid') {
              onUpdate({ price: undefined });
            }
          }}
          className="space-y-3"
        >
          {accessOptions.map((option) => {
            const Icon = option.icon;
            return (
              <label
                key={option.value}
                className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value={option.value} className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{option.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{option.description}</p>
                </div>
              </label>
            );
          })}
        </RadioGroup>

        {/* Price Field (only if Paid) */}
        {course.accessType === 'paid' && (
          <div className="pl-7 pt-2 space-y-2">
            <Label htmlFor="price">Price (INR)</Label>
            <div className="relative w-48">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="price"
                type="number"
                value={course.price || ''}
                onChange={(e) => onUpdate({ price: Number(e.target.value) })}
                placeholder="0"
                className="pl-7"
              />
            </div>
          </div>
        )}
      </div>

      {/* Responsible Role */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Course Administrator</h3>
          <p className="text-sm text-muted-foreground">Assign the owner of this course</p>
        </div>
        <Select
          value={course.responsiblePerson || ''}
          onValueChange={(value) => onUpdate({ responsiblePerson: value })}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select administrator" />
          </SelectTrigger>
          <SelectContent>
            {responsiblePersons.map((person) => (
              <SelectItem key={person} value={person}>
                {person}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
