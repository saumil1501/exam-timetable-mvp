import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

interface CalendarViewProps {
  timetable: any;
}

export default function CalendarView({ timetable }: CalendarViewProps) {
  const events =
    timetable?.slots?.map((slot: any) => ({
      title: `${slot.courseId?.code}`,
      start: slot.examDate,
      allDay: true,
      backgroundColor:
        slot.timeSlot === 'Morning'
          ? '#3B82F6'
          : slot.timeSlot === 'Afternoon'
          ? '#F97316'
          : '#8B5CF6',
      borderColor:
        slot.timeSlot === 'Morning'
          ? '#3B82F6'
          : slot.timeSlot === 'Afternoon'
          ? '#F97316'
          : '#8B5CF6',
      extendedProps: {
        courseName: slot.courseId?.name,
        session: slot.timeSlot,
        startTime: slot.startTime,
        endTime: slot.endTime,
      },
    })) || [];

  return (
    <div className="rounded-xl bg-background p-4 calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        // 👇 these two lines ensure day names show
        dayHeaders={true}
        dayHeaderClassNames="text-black"
        dayHeaderFormat={{ weekday: 'short' }} // 'short' = Mon, 'long' = Monday, 'narrow' = M
        eventContent={(eventInfo) => (
          <div className="rounded p-1 text-xs text-white w-full overflow-hidden">
            <div className="font-bold truncate">{eventInfo.event.title}</div>
            <div className="text-[10px] opacity-90">
              {eventInfo.event.extendedProps.startTime} -{' '}
              {eventInfo.event.extendedProps.endTime}
            </div>
          </div>
        )}
      />
    </div>
  );
}