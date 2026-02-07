import { useState } from 'react';
import { Plus, Video, FileText, Image, HelpCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Course, CourseContent, ContentCategory } from '@/types/lms';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AddContentModal } from './AddContentModal';
import { cn } from '@/lib/utils';

interface ContentTabProps {
  course: Course;
  onUpdate: (updates: Partial<Course>) => void;
}

const categoryIcons: Record<ContentCategory, React.ElementType> = {
  video: Video,
  document: FileText,
  image: Image,
  quiz: HelpCircle,
};

const categoryLabels: Record<ContentCategory, string> = {
  video: 'Video',
  document: 'Document',
  image: 'Image',
  quiz: 'Quiz',
};

export function ContentTab({ course, onUpdate }: ContentTabProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<ContentCategory>('video');
  const [editingContent, setEditingContent] = useState<CourseContent | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAddContent = (type: ContentCategory) => {
    setAddModalType(type);
    setEditingContent(null);
    setAddModalOpen(true);
  };

  const handleEditContent = (content: CourseContent) => {
    setAddModalType(content.category);
    setEditingContent(content);
    setAddModalOpen(true);
  };

  const handleSaveContent = (content: CourseContent) => {
    if (editingContent) {
      onUpdate({
        contents: course.contents.map((c) => (c.id === content.id ? content : c)),
      });
    } else {
      onUpdate({
        contents: [...course.contents, content],
        contentCount: course.contentCount + 1,
      });
    }
    setAddModalOpen(false);
    setEditingContent(null);
  };

  const handleDeleteContent = (contentId: string) => {
    onUpdate({
      contents: course.contents.filter((c) => c.id !== contentId),
      contentCount: Math.max(0, course.contentCount - 1),
    });
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Content Table */}
      {course.contents.length > 0 ? (
        <div className="card-surface overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header-cell">Content Title</th>
                <th className="table-header-cell">Category</th>
                <th className="table-header-cell text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {course.contents.map((content) => {
                const Icon = categoryIcons[content.category];
                return (
                  <tr key={content.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="table-cell font-medium">{content.title}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon className="w-4 h-4" />
                        <span>{categoryLabels[content.category]}</span>
                      </div>
                    </td>
                    <td className="table-cell text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditContent(content)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteConfirmId(content.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card-surface p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No content yet</h3>
          <p className="text-muted-foreground mb-4">Add videos, documents, images, or quizzes to your course</p>
        </div>
      )}

      {/* Add Content Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleAddContent('video')}>
            <Video className="w-4 h-4 mr-2" />
            Video
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddContent('document')}>
            <FileText className="w-4 h-4 mr-2" />
            Document
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddContent('image')}>
            <Image className="w-4 h-4 mr-2" />
            Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddContent('quiz')}>
            <HelpCircle className="w-4 h-4 mr-2" />
            Quiz
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Content Modal */}
      <AddContentModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingContent(null);
        }}
        contentType={addModalType}
        existingContent={editingContent}
        onSave={handleSaveContent}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteConfirmId && handleDeleteContent(deleteConfirmId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
