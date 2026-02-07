import { useState, useEffect } from 'react';
import { Upload, Link, Plus, X } from 'lucide-react';
import { CourseContent, ContentCategory, Attachment } from '@/types/lms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { responsiblePersons } from '@/data/mockData';

interface AddContentModalProps {
  open: boolean;
  onClose: () => void;
  contentType: ContentCategory;
  existingContent: CourseContent | null;
  onSave: (content: CourseContent) => void;
}

export function AddContentModal({
  open,
  onClose,
  contentType,
  existingContent,
  onSave,
}: AddContentModalProps) {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [allowDownload, setAllowDownload] = useState(false);
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');

  useEffect(() => {
    if (existingContent) {
      setTitle(existingContent.title);
      setVideoUrl(existingContent.videoUrl || '');
      setDuration(existingContent.duration || '');
      setAllowDownload(existingContent.allowDownload || false);
      setResponsiblePerson(existingContent.responsiblePerson || '');
      setAttachments(existingContent.attachments || []);
    } else {
      setTitle('');
      setVideoUrl('');
      setDuration('');
      setAllowDownload(false);
      setResponsiblePerson('');
      setAttachments([]);
    }
  }, [existingContent, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content: CourseContent = {
      id: existingContent?.id || `content-${Date.now()}`,
      title,
      category: contentType,
      videoUrl: contentType === 'video' ? videoUrl : undefined,
      duration: contentType === 'video' ? duration : undefined,
      allowDownload: contentType !== 'video' ? allowDownload : undefined,
      responsiblePerson,
      attachments,
    };
    onSave(content);
  };

  const handleAddAttachment = (type: 'file' | 'link') => {
    if (type === 'link' && newAttachmentUrl) {
      setAttachments([
        ...attachments,
        { id: `att-${Date.now()}`, type: 'link', name: newAttachmentName || newAttachmentUrl, url: newAttachmentUrl },
      ]);
      setNewAttachmentName('');
      setNewAttachmentUrl('');
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const getTitle = () => {
    const action = existingContent ? 'Edit' : 'Add';
    const labels: Record<ContentCategory, string> = {
      video: 'Video',
      document: 'Document',
      image: 'Image',
      quiz: 'Quiz',
    };
    return `${action} ${labels[contentType]}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content Title */}
          <div className="space-y-2">
            <Label htmlFor="content-title">Content Title *</Label>
            <Input
              id="content-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>

          {/* Video-specific fields */}
          {contentType === 'video' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="video-url">Video Link (YouTube or hosted)</Label>
                <Input
                  id="video-url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 15:00"
                />
              </div>
            </>
          )}

          {/* Document/Image-specific fields */}
          {(contentType === 'document' || contentType === 'image') && (
            <>
              <div className="space-y-2">
                <Label>Upload {contentType === 'document' ? 'File' : 'Image'}</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-download">Allow Download</Label>
                <Switch
                  id="allow-download"
                  checked={allowDownload}
                  onCheckedChange={setAllowDownload}
                />
              </div>
            </>
          )}

          {/* Responsible Person */}
          <div className="space-y-2">
            <Label>Responsible Person</Label>
            <Select value={responsiblePerson} onValueChange={setResponsiblePerson}>
              <SelectTrigger>
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

          {/* Additional Attachments */}
          <div className="space-y-3">
            <Label>Additional Attachments</Label>
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="file" className="flex-1">Upload File</TabsTrigger>
                <TabsTrigger value="link" className="flex-1">Add Link</TabsTrigger>
              </TabsList>
              <TabsContent value="file" className="mt-2">
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Click to upload</p>
                </div>
              </TabsContent>
              <TabsContent value="link" className="mt-2 space-y-2">
                <Input
                  value={newAttachmentName}
                  onChange={(e) => setNewAttachmentName(e.target.value)}
                  placeholder="Link name (optional)"
                />
                <div className="flex gap-2">
                  <Input
                    value={newAttachmentUrl}
                    onChange={(e) => setNewAttachmentUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <Button type="button" size="sm" onClick={() => handleAddAttachment('link')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="space-y-2 mt-2">
                {attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2 text-sm">
                      <Link className="w-4 h-4 text-muted-foreground" />
                      <span>{att.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleRemoveAttachment(att.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {existingContent ? 'Save Changes' : 'Add Content'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
