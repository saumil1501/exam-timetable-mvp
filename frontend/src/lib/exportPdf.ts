import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportPDF(id: string) {

  const element = document.getElementById(id);

  if (!element) return;

  const canvas = await html2canvas(element);

  const image = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape"
  });

  pdf.addImage(
    image,
    "PNG",
    10,
    10,
    270,
    150
  );

  pdf.save("exam-timetable.pdf");
}