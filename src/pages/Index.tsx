import { useState } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { CoursesView } from '@/components/courses/CoursesView';
import { CourseFormView } from '@/components/course-form/CourseFormView';
import { ReportingView } from '@/components/reporting/ReportingView';
import { SettingsView } from '@/components/settings/SettingsView';
import { Course } from '@/types/lms';
import { mockCourses, mockParticipants, mockMetrics } from '@/data/mockData';
import { toast } from 'sonner';

type ActiveTab = 'courses' | 'reporting' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleCreateCourse = (name: string) => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name,
      tags: [],
      status: 'draft',
      views: 0,
      contentCount: 0,
      totalDuration: '0h 00m',
      description: '',
      contents: [],
      accessType: 'everyone',
      quiz: {
        questions: [],
        rewards: {
          firstAttempt: 100,
          secondAttempt: 75,
          thirdAttempt: 50,
          fourthAndAbove: 25,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCourses([newCourse, ...courses]);
    setEditingCourse(newCourse);
    toast.success('Course created! Start adding content.');
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
  };

  const handleUpdateCourse = (updates: Partial<Course>) => {
    if (editingCourse) {
      const updatedCourse = { ...editingCourse, ...updates, updatedAt: new Date() };
      setEditingCourse(updatedCourse);
      setCourses(courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    }
  };

  const handleRemoveTag = (courseId: string, tagId: string) => {
    setCourses(
      courses.map((c) =>
        c.id === courseId ? { ...c, tags: c.tags.filter((t) => t.id !== tagId) } : c
      )
    );
  };

  const handleBackFromForm = () => {
    setEditingCourse(null);
  };

  // If editing a course, show the form view
  if (editingCourse) {
    return (
      <CourseFormView
        course={editingCourse}
        onBack={handleBackFromForm}
        onUpdate={handleUpdateCourse}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {activeTab === 'courses' && (
        <CoursesView
          courses={courses}
          searchQuery={searchQuery}
          onEditCourse={handleEditCourse}
          onCreateCourse={handleCreateCourse}
          onRemoveTag={handleRemoveTag}
        />
      )}

      {activeTab === 'reporting' && (
        <ReportingView participants={mockParticipants} metrics={mockMetrics} />
      )}

      {activeTab === 'settings' && <SettingsView />}
    </div>
  );
};

export default Index;
