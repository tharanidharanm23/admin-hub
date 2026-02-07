import { useState } from 'react';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { Course, ViewMode } from '@/types/lms';
import { Button } from '@/components/ui/button';
import { CourseCard } from './CourseCard';
import { CourseListRow } from './CourseListRow';
import { CreateCourseModal } from './CreateCourseModal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CoursesViewProps {
  courses: Course[];
  searchQuery: string;
  onEditCourse: (course: Course) => void;
  onCreateCourse: (name: string) => void;
  onRemoveTag: (courseId: string, tagId: string) => void;
}

export function CoursesView({
  courses,
  searchQuery,
  onEditCourse,
  onCreateCourse,
  onRemoveTag,
}: CoursesViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCourses = filteredCourses.filter((c) => c.status === 'published');
  const draftCourses = filteredCourses.filter((c) => c.status === 'draft');

  const handleShare = (course: Course) => {
    const shareUrl = `${window.location.origin}/courses/${course.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Course link copied to clipboard!');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Courses</h1>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'kanban'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {/* Published Column */}
          <div className="kanban-column">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                Published
                <span className="text-muted-foreground font-normal">({publishedCourses.length})</span>
              </h2>
            </div>
            <div className="space-y-3">
              {publishedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={onEditCourse}
                  onShare={handleShare}
                  onRemoveTag={onRemoveTag}
                />
              ))}
              {publishedCourses.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No published courses</p>
              )}
            </div>
          </div>

          {/* Draft Column */}
          <div className="kanban-column">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                Draft
                <span className="text-muted-foreground font-normal">({draftCourses.length})</span>
              </h2>
            </div>
            <div className="space-y-3">
              {draftCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={onEditCourse}
                  onShare={handleShare}
                  onRemoveTag={onRemoveTag}
                />
              ))}
              {draftCourses.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No draft courses</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="card-surface overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header-cell">Course Name</th>
                <th className="table-header-cell">Tags</th>
                <th className="table-header-cell">Views</th>
                <th className="table-header-cell">Contents</th>
                <th className="table-header-cell">Duration</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <CourseListRow
                  key={course.id}
                  course={course}
                  onEdit={onEditCourse}
                  onShare={handleShare}
                  onRemoveTag={onRemoveTag}
                />
              ))}
            </tbody>
          </table>
          {filteredCourses.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No courses found
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        className="floating-action-btn"
        onClick={() => setCreateModalOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Course Modal */}
      <CreateCourseModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={onCreateCourse}
      />
    </div>
  );
}
