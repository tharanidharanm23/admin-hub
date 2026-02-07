import { useState } from 'react';
import { Plus, Trash2, Award, GripVertical, Check } from 'lucide-react';
import { Course, QuizQuestion, QuizOption } from '@/types/lms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface QuizTabProps {
  course: Course;
  onUpdate: (updates: Partial<Course>) => void;
}

export function QuizTab({ course, onUpdate }: QuizTabProps) {
  const [activeTab, setActiveTab] = useState<'questions' | 'rewards'>('questions');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    course.quiz.questions[0]?.id || null
  );

  const selectedQuestion = course.quiz.questions.find((q) => q.id === selectedQuestionId);

  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      text: 'New Question',
      options: [
        { id: `o-${Date.now()}-1`, text: 'Option 1', isCorrect: false },
        { id: `o-${Date.now()}-2`, text: 'Option 2', isCorrect: false },
      ],
    };
    onUpdate({
      quiz: {
        ...course.quiz,
        questions: [...course.quiz.questions, newQuestion],
      },
    });
    setSelectedQuestionId(newQuestion.id);
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    onUpdate({
      quiz: {
        ...course.quiz,
        questions: course.quiz.questions.map((q) =>
          q.id === questionId ? { ...q, ...updates } : q
        ),
      },
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    const newQuestions = course.quiz.questions.filter((q) => q.id !== questionId);
    onUpdate({
      quiz: {
        ...course.quiz,
        questions: newQuestions,
      },
    });
    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(newQuestions[0]?.id || null);
    }
  };

  const handleAddOption = (questionId: string) => {
    const question = course.quiz.questions.find((q) => q.id === questionId);
    if (question && question.options.length < 6) {
      handleUpdateQuestion(questionId, {
        options: [
          ...question.options,
          { id: `o-${Date.now()}`, text: `Option ${question.options.length + 1}`, isCorrect: false },
        ],
      });
    }
  };

  const handleUpdateOption = (questionId: string, optionId: string, updates: Partial<QuizOption>) => {
    const question = course.quiz.questions.find((q) => q.id === questionId);
    if (question) {
      handleUpdateQuestion(questionId, {
        options: question.options.map((o) => (o.id === optionId ? { ...o, ...updates } : o)),
      });
    }
  };

  const handleRemoveOption = (questionId: string, optionId: string) => {
    const question = course.quiz.questions.find((q) => q.id === questionId);
    if (question && question.options.length > 2) {
      handleUpdateQuestion(questionId, {
        options: question.options.filter((o) => o.id !== optionId),
      });
    }
  };

  const handleUpdateRewards = (field: keyof typeof course.quiz.rewards, value: number) => {
    onUpdate({
      quiz: {
        ...course.quiz,
        rewards: {
          ...course.quiz.rewards,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="flex gap-6 h-[500px]">
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-border pr-4">
        {/* Tab Switcher */}
        <div className="flex mb-4 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('questions')}
            className={cn(
              'flex-1 py-1.5 text-sm font-medium rounded-md transition-colors',
              activeTab === 'questions' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            )}
          >
            Questions
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={cn(
              'flex-1 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1',
              activeTab === 'rewards' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            )}
          >
            <Award className="w-3.5 h-3.5" />
            Rewards
          </button>
        </div>

        {activeTab === 'questions' && (
          <>
            {/* Question List */}
            <div className="space-y-1 mb-4">
              {course.quiz.questions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => setSelectedQuestionId(question.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-sm transition-colors truncate',
                    selectedQuestionId === question.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {index + 1}. {question.text}
                </button>
              ))}
            </div>

            {/* Add Question Button */}
            <Button onClick={handleAddQuestion} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure points awarded based on attempt number.
            </p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">First Attempt</Label>
                <Input
                  type="number"
                  value={course.quiz.rewards.firstAttempt}
                  onChange={(e) => handleUpdateRewards('firstAttempt', Number(e.target.value))}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Second Attempt</Label>
                <Input
                  type="number"
                  value={course.quiz.rewards.secondAttempt}
                  onChange={(e) => handleUpdateRewards('secondAttempt', Number(e.target.value))}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Third Attempt</Label>
                <Input
                  type="number"
                  value={course.quiz.rewards.thirdAttempt}
                  onChange={(e) => handleUpdateRewards('thirdAttempt', Number(e.target.value))}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Fourth & Above</Label>
                <Input
                  type="number"
                  value={course.quiz.rewards.fourthAndAbove}
                  onChange={(e) => handleUpdateRewards('fourthAndAbove', Number(e.target.value))}
                  className="h-9"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Panel - Question Editor */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'questions' && selectedQuestion ? (
          <div className="space-y-6">
            {/* Question Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Question Text</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive h-8"
                  onClick={() => handleDeleteQuestion(selectedQuestion.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
              <Input
                value={selectedQuestion.text}
                onChange={(e) => handleUpdateQuestion(selectedQuestion.id, { text: e.target.value })}
                placeholder="Enter your question"
                className="text-base"
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              <Label>Answer Options</Label>
              <p className="text-sm text-muted-foreground">
                Check the box to mark the correct answer.
              </p>
              <div className="space-y-2">
                {selectedQuestion.options.map((option, index) => (
                  <div
                    key={option.id}
                    className={cn(
                      'quiz-option group',
                      option.isCorrect && 'correct'
                    )}
                  >
                    <Checkbox
                      checked={option.isCorrect}
                      onCheckedChange={(checked) =>
                        handleUpdateOption(selectedQuestion.id, option.id, { isCorrect: !!checked })
                      }
                      className="mt-0.5"
                    />
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        handleUpdateOption(selectedQuestion.id, option.id, { text: e.target.value })
                      }
                      className="flex-1 border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                      placeholder={`Option ${index + 1}`}
                    />
                    {option.isCorrect && (
                      <Check className="w-4 h-4 text-success" />
                    )}
                    {selectedQuestion.options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveOption(selectedQuestion.id, option.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {selectedQuestion.options.length < 6 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddOption(selectedQuestion.id)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              )}
            </div>
          </div>
        ) : activeTab === 'questions' ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="mb-4">No questions yet</p>
              <Button onClick={handleAddQuestion}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Question
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-sm">
              <Award className="w-12 h-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Quiz Rewards</h3>
              <p className="text-muted-foreground">
                Configure the points students receive based on which attempt they complete the quiz on.
                First attempts get the most points, with decreasing rewards for subsequent tries.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
