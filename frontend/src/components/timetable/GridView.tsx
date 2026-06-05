import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GridViewProps {
  timetable: any;
}

export default function GridView({ timetable }: GridViewProps) {
  const sortedSlots = [...timetable.slots].sort(
    (a, b) =>
      new Date(a.examDate).getTime() - new Date(b.examDate).getTime() ||
      a.slotNumber - b.slotNumber
  );

  const getBadgeColor = (timeSlot: string) => {
    switch (timeSlot) {
      case 'Morning':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'Afternoon':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'Evening':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Examination Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slot</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Course Code</TableHead>
              <TableHead>Course Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSlots.map((slot: any, index: number) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell>
                  <Badge variant="secondary">{slot.slotNumber}</Badge>
                </TableCell>

                <TableCell>
                  <div>
                    <div className="font-medium">
                      {new Date(slot.examDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Day {slot.day}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge className={`text-white ${getBadgeColor(slot.timeSlot)}`}>
                    {slot.timeSlot}
                  </Badge>
                </TableCell>

                <TableCell className="font-mono">
                  {slot.startTime || '-'}
                </TableCell>

                <TableCell className="font-mono">
                  {slot.endTime || '-'}
                </TableCell>

                <TableCell className="font-semibold">
                  {slot.courseId?.code}
                </TableCell>

                <TableCell>{slot.courseId?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}