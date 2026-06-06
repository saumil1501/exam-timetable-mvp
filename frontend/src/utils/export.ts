import jsPDF from 'jspdf';

export function exportTimetablePDF(
  timetable: any
) {
  const pdf = new jsPDF();

  pdf.setFontSize(18);

  pdf.text(
    timetable.name,
    14,
    20
  );

  pdf.setFontSize(12);

  pdf.text(
    'Examination Timetable',
    14,
    30
  );

  let y = 50;

  pdf.text('Date', 14, y);
  pdf.text('Session', 60, y);
  pdf.text('Start', 100, y);
  pdf.text('End', 130, y);
  pdf.text('Course', 160, y);

  y += 10;

  timetable.slots.forEach(
    (slot: any) => {

      const date =
        new Date(
          slot.examDate
        ).toLocaleDateString();

      pdf.text(
        date,
        14,
        y
      );

      pdf.text(
        slot.timeSlot,
        60,
        y
      );

      pdf.text(
        slot.startTime || '',
        100,
        y
      );

      pdf.text(
        slot.endTime || '',
        130,
        y
      );

      pdf.text(
        slot.courseId?.code || '',
        160,
        y
      );

      y += 10;

      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    }
  );

  pdf.save(
    `${timetable.name}.pdf`
  );
}

export function exportTimetablePNG(
  timetable: any
) {

  const canvas =
    document.createElement(
      'canvas'
    );

  const ctx =
    canvas.getContext('2d');

  canvas.width = 1400;
  canvas.height = 900;

  if (!ctx) return;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.fillStyle = '#000000';

  ctx.font =
    '28px Arial';

  ctx.fillText(
    timetable.name,
    50,
    50
  );

  ctx.font =
    '18px Arial';

  let y = 100;

  timetable.slots.forEach(
    (slot: any) => {

      const date =
        new Date(
          slot.examDate
        ).toLocaleDateString();

      ctx.fillText(
        `${date} | ${slot.timeSlot} | ${slot.startTime} - ${slot.endTime} | ${slot.courseId?.code}`,
        50,
        y
      );

      y += 40;
    }
  );

  const link =
    document.createElement(
      'a'
    );

  link.download =
    `${timetable.name}.png`;

  link.href =
    canvas.toDataURL(
      'image/png'
    );

  link.click();
}