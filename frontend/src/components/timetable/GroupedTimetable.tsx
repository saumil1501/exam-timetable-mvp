import { Card } from "@/components/ui/card";

export default function GroupedTimetable({ timetable }: any) {
  const grouped: Record<string, any[]> = {};

  timetable.slots.forEach((slot: any) => {
    const key = `${slot.day}-${slot.timeSlot}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(slot);
  });

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {Object.entries(grouped).map(([key, slots]) => {
        const [day, time] = key.split("-");

        return (
          <Card key={key} className="p-5">
            <h3 className="font-bold text-lg">
              Day {day}
            </h3>

            <p className="text-blue-600 font-medium mb-4">
              {time}
            </p>

            <div className="space-y-2">
              {slots.map((slot: any) => (
                <div
                  key={slot.courseId._id}
                  className="rounded-lg bg-slate-100 dark:bg-slate-800 p-3"
                >
                  {slot.courseId.code}
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}