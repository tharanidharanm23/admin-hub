import { ArrowLeft, Eye, Upload, X, Plus } from 'lucide-react';
import { Course, Tag } from '@/types/lms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { responsiblePersons } from '@/data/mockData';
import { useState } from 'react';
import { toast } from 'sonner';

interface CourseFormHeaderProps {
  course: Course;
  onBack: () => void;
  onUpdate: (updates: Partial<Course>) => void;
}

export function CourseFormHeader({ course, onBack, onUpdate }: CourseFormHeaderProps) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !course.tags.some(t => t.name.toLowerCase() === newTag.toLowerCase())) {
      onUpdate({
        tags: [...course.tags, { id: `t-${Date.now()}`, name: newTag.trim() }],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onUpdate({
      tags: course.tags.filter((t) => t.id !== tagId),
    });
  };

  const handlePublishToggle = (checked: boolean) => {
    onUpdate({ status: checked ? 'published' : 'draft' });
    toast.success(checked ? 'Course published!' : 'Course moved to draft');
  };

  const handlePreview = () => {
    toast.info('Opening student preview...');
    // In a real app, this would open the student view
  };

  return (
    <div className="bg-card border-b border-border px-6 py-4">
      {/* Top Row: Back button and actions */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Courses</span>
        </button>

        <div className="flex items-center gap-4">
          {/* Publish Toggle */}
          <div className="flex items-center gap-2">
            <Label htmlFor="publish-toggle" className="text-sm text-muted-foreground">
              {course.status === 'published' ? 'Published' : 'Draft'}
            </Label>
            <Switch
              id="publish-toggle"
              checked={course.status === 'published'}
              onCheckedChange={handlePublishToggle}
            />
          </div>

          {/* Preview Button */}
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Course Details */}
      <div className="grid grid-cols-12 gap-6">
        {/* Course Image */}
        <div className="col-span-2">
          <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
            {course.imageUrl ? (
              <img
                src={course.imageUrl}
                alt={course.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center p-2">
                <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Upload image</span>
              </div>
            )}
          </div>
        </div>

        {/* Course Info */}
        <div className="col-span-10 space-y-4">
          {/* Title */}
          <Input
            value={course.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="text-xl font-semibold h-auto py-2 border-transparent bg-transparent hover:bg-muted/50 focus:bg-background focus:border-input"
            placeholder="Course title"
          />

          {/* Tags & Responsible Person */}
          <div className="flex items-start gap-6">
            {/* Tags */}
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-2 block">Tags</Label>
              <div className="flex flex-wrap items-center gap-2">
                {course.tags.map((tag) => (
                  <span key={tag.id} className="tag-pill">
                    {tag.name}
                    <button
                      onClick={() => handleRemoveTag(tag.id)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-1">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add tag"
                    className="h-7 w-24 text-xs"
                  />
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleAddTag}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Responsible Person */}
            <div className="w-48">
              <Label className="text-xs text-muted-foreground mb-2 block">Responsible Person</Label>
              <Select
                value={course.responsiblePerson || ''}
                onValueChange={(value) => onUpdate({ responsiblePerson: value })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select person" />
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
        </div>
      </div>
    </div>
  );
}
