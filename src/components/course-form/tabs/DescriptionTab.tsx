import { Course } from '@/types/lms';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface DescriptionTabProps {
  course: Course;
  onUpdate: (updates: Partial<Course>) => void;
}

export function DescriptionTab({ course, onUpdate }: DescriptionTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Course Description</Label>
        <p className="text-sm text-muted-foreground">
          Provide a detailed description of what students will learn in this course.
        </p>
      </div>
      <Textarea
        id="description"
        value={course.description || ''}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Write your course description here...

You can describe:
• What students will learn
• Prerequisites
• Course objectives
• Who this course is for"
        className="min-h-[400px] resize-none"
      />
      <p className="text-xs text-muted-foreground">
        Supports basic text formatting. Use clear paragraphs and bullet points for better readability.
      </p>
    </div>
  );
}
