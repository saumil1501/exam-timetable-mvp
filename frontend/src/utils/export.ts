import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPDF(elementId: string, fileName: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('landscape');
  pdf.addImage(imgData, 'PNG', 10, 10, 270, 180);
  pdf.save(fileName);
}

export async function exportToPNG(elementId: string, fileName: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 });
  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL();
  link.click();
}