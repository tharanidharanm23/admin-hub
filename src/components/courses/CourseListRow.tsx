import { Eye, FileText, Clock, Share2, Edit, X, MoreHorizontal } from 'lucide-react';
import { Course } from '@/types/lms';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface CourseListRowProps {
  course: Course;
  onEdit: (course: Course) => void;
  onShare: (course: Course) => void;
  onRemoveTag: (courseId: string, tagId: string) => void;
}

export function CourseListRow({ course, onEdit, onShare, onRemoveTag }: CourseListRowProps) {
  return (
    <tr className="group hover:bg-muted/30 transition-colors">
      {/* Course Name */}
      <td className="table-cell">
        <span 
          className="font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
          onClick={() => onEdit(course)}
        >
          {course.name}
        </span>
      </td>

      {/* Tags */}
      <td className="table-cell">
        <div className="flex flex-wrap gap-1">
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
      </td>

      {/* Views */}
      <td className="table-cell">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Eye className="w-4 h-4" />
          <span>{course.views.toLocaleString()}</span>
        </div>
      </td>

      {/* Contents */}
      <td className="table-cell">
        <div className="flex items-center gap-1 text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span>{course.contentCount}</span>
        </div>
      </td>

      {/* Duration */}
      <td className="table-cell">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{course.totalDuration}</span>
        </div>
      </td>

      {/* Status */}
      <td className="table-cell">
        <span
          className={cn(
            'status-badge',
            course.status === 'published' ? 'status-published' : 'status-draft'
          )}
        >
          {course.status === 'published' ? 'Published' : 'Draft'}
        </span>
      </td>

      {/* Actions */}
      <td className="table-cell">
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onShare(course)}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onEdit(course)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(course)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(course)}>Share</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}
