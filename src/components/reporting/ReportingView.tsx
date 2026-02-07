import { useState, useMemo } from 'react';
import { Users, Clock, PlayCircle, CheckCircle, Settings2, X } from 'lucide-react';
import { Participant, ParticipantStatus, ReportingMetrics } from '@/types/lms';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface ReportingViewProps {
  participants: Participant[];
  metrics: ReportingMetrics;
}

type ColumnKey = 'sno' | 'courseName' | 'participantName' | 'enrolledDate' | 'startDate' | 'timeSpent' | 'completionPercentage' | 'completedDate' | 'status';

const allColumns: { key: ColumnKey; label: string; defaultVisible: boolean }[] = [
  { key: 'sno', label: 'S.No', defaultVisible: true },
  { key: 'courseName', label: 'Course Name', defaultVisible: true },
  { key: 'participantName', label: 'Participant Name', defaultVisible: true },
  { key: 'enrolledDate', label: 'Enrolled Date', defaultVisible: true },
  { key: 'startDate', label: 'Start Date', defaultVisible: true },
  { key: 'timeSpent', label: 'Time Spent', defaultVisible: true },
  { key: 'completionPercentage', label: 'Completion %', defaultVisible: true },
  { key: 'completedDate', label: 'Completed Date', defaultVisible: true },
  { key: 'status', label: 'Status', defaultVisible: true },
];

export function ReportingView({ participants, metrics }: ReportingViewProps) {
  const [activeFilter, setActiveFilter] = useState<ParticipantStatus | 'all'>('all');
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    new Set(allColumns.filter(c => c.defaultVisible).map(c => c.key))
  );

  const metricCards = [
    { id: 'all' as const, label: 'Total Participants', value: metrics.totalParticipants, icon: Users, color: 'text-foreground' },
    { id: 'yet-to-start' as const, label: 'Yet to Start', value: metrics.yetToStart, icon: Clock, color: 'text-warning' },
    { id: 'in-progress' as const, label: 'In Progress', value: metrics.inProgress, icon: PlayCircle, color: 'text-info' },
    { id: 'completed' as const, label: 'Completed', value: metrics.completed, icon: CheckCircle, color: 'text-success' },
  ];

  const filteredParticipants = useMemo(() => {
    if (activeFilter === 'all') return participants;
    return participants.filter((p) => p.status === activeFilter);
  }, [participants, activeFilter]);

  const toggleColumn = (key: ColumnKey) => {
    const newColumns = new Set(visibleColumns);
    if (newColumns.has(key)) {
      newColumns.delete(key);
    } else {
      newColumns.add(key);
    }
    setVisibleColumns(newColumns);
  };

  const getStatusBadge = (status: ParticipantStatus) => {
    const styles = {
      'yet-to-start': 'bg-warning/10 text-warning',
      'in-progress': 'bg-info/10 text-info',
      'completed': 'bg-success/10 text-success',
    };
    const labels = {
      'yet-to-start': 'Yet to Start',
      'in-progress': 'In Progress',
      'completed': 'Completed',
    };
    return (
      <span className={cn('status-badge', styles[status])}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Reporting</h1>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => setActiveFilter(card.id)}
              className={cn(
                'metric-card text-left',
                activeFilter === card.id && 'active'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={cn('w-5 h-5', card.color)} />
                <span className="text-2xl font-bold text-foreground">{card.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </button>
          );
        })}
      </div>

      {/* Table Header with Column Selector */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredParticipants.length} of {participants.length} participants
        </p>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="w-4 h-4 mr-2" />
              Columns
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Customize Columns</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-3">
              {allColumns.map((column) => (
                <label
                  key={column.key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox
                    checked={visibleColumns.has(column.key)}
                    onCheckedChange={() => toggleColumn(column.key)}
                  />
                  <span className="text-sm">{column.label}</span>
                </label>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Data Table */}
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {visibleColumns.has('sno') && <th className="table-header-cell">S.No</th>}
                {visibleColumns.has('courseName') && <th className="table-header-cell">Course Name</th>}
                {visibleColumns.has('participantName') && <th className="table-header-cell">Participant Name</th>}
                {visibleColumns.has('enrolledDate') && <th className="table-header-cell">Enrolled Date</th>}
                {visibleColumns.has('startDate') && <th className="table-header-cell">Start Date</th>}
                {visibleColumns.has('timeSpent') && <th className="table-header-cell">Time Spent</th>}
                {visibleColumns.has('completionPercentage') && <th className="table-header-cell">Completion %</th>}
                {visibleColumns.has('completedDate') && <th className="table-header-cell">Completed Date</th>}
                {visibleColumns.has('status') && <th className="table-header-cell">Status</th>}
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((participant, index) => (
                <tr key={participant.id} className="hover:bg-muted/30 transition-colors">
                  {visibleColumns.has('sno') && <td className="table-cell">{index + 1}</td>}
                  {visibleColumns.has('courseName') && <td className="table-cell font-medium">{participant.courseName}</td>}
                  {visibleColumns.has('participantName') && <td className="table-cell">{participant.participantName}</td>}
                  {visibleColumns.has('enrolledDate') && (
                    <td className="table-cell">{format(participant.enrolledDate, 'MMM d, yyyy')}</td>
                  )}
                  {visibleColumns.has('startDate') && (
                    <td className="table-cell">
                      {participant.startDate ? format(participant.startDate, 'MMM d, yyyy') : '—'}
                    </td>
                  )}
                  {visibleColumns.has('timeSpent') && <td className="table-cell">{participant.timeSpent}</td>}
                  {visibleColumns.has('completionPercentage') && (
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${participant.completionPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-9">
                          {participant.completionPercentage}%
                        </span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.has('completedDate') && (
                    <td className="table-cell">
                      {participant.completedDate ? format(participant.completedDate, 'MMM d, yyyy') : '—'}
                    </td>
                  )}
                  {visibleColumns.has('status') && <td className="table-cell">{getStatusBadge(participant.status)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredParticipants.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No participants found
          </div>
        )}
      </div>
    </div>
  );
}
