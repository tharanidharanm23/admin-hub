import { useState } from 'react';
import { Course } from '@/types/lms';
import { CourseFormHeader } from './CourseFormHeader';
import { ContentTab } from './tabs/ContentTab';
import { DescriptionTab } from './tabs/DescriptionTab';
import { OptionsTab } from './tabs/OptionsTab';
import { QuizTab } from './tabs/QuizTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, AlignLeft, Settings, HelpCircle } from 'lucide-react';

interface CourseFormViewProps {
  course: Course;
  onBack: () => void;
  onUpdate: (updates: Partial<Course>) => void;
}

export function CourseFormView({ course, onBack, onUpdate }: CourseFormViewProps) {
  const [activeTab, setActiveTab] = useState('content');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <CourseFormHeader course={course} onBack={onBack} onUpdate={onUpdate} />

      {/* Tabs */}
      <div className="px-6 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50 p-1 h-auto">
            <TabsTrigger value="content" className="gap-2 data-[state=active]:bg-card">
              <FileText className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="description" className="gap-2 data-[state=active]:bg-card">
              <AlignLeft className="w-4 h-4" />
              Description
            </TabsTrigger>
            <TabsTrigger value="options" className="gap-2 data-[state=active]:bg-card">
              <Settings className="w-4 h-4" />
              Options
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-2 data-[state=active]:bg-card">
              <HelpCircle className="w-4 h-4" />
              Quiz
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="content" className="mt-0">
              <ContentTab course={course} onUpdate={onUpdate} />
            </TabsContent>
            <TabsContent value="description" className="mt-0">
              <DescriptionTab course={course} onUpdate={onUpdate} />
            </TabsContent>
            <TabsContent value="options" className="mt-0">
              <OptionsTab course={course} onUpdate={onUpdate} />
            </TabsContent>
            <TabsContent value="quiz" className="mt-0">
              <QuizTab course={course} onUpdate={onUpdate} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
