import { Eye, FileText, Clock, Share2, Edit, X } from 'lucide-react';
import { Course, Tag } from '@/types/lms';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onShare: (course: Course) => void;
  onRemoveTag: (courseId: string, tagId: string) => void;
}

export function CourseCard({ course, onEdit, onShare, onRemoveTag }: CourseCardProps) {
  return (
    <div className="course-card group">
      {/* Course Name */}
      <h3 
        className="text-base font-semibold text-foreground mb-2 cursor-pointer hover:text-primary transition-colors line-clamp-2"
        onClick={() => onEdit(course)}
      >
        {course.name}
      </h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {course.tags.map((tag) => (
          <span key={tag.id} className="tag-pill">
            {tag.name}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTag(course.id, tag.id);
              }}
              className="ml-0.5 hover:text-destructive transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          <span>{course.views.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          <span>{course.contentCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{course.totalDuration}</span>
        </div>
      </div>

      {/* Actions & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onShare(course);
            }}
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(course);
            }}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>

        {/* Status Badge */}
        <span
          className={cn(
            'status-badge',
            course.status === 'published' ? 'status-published' : 'status-draft'
          )}
        >
          {course.status === 'published' ? 'Published' : 'Draft'}
        </span>
      </div>
    </div>
  );
}
