import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../data/OpenSans-Regular"; // lub "./data/OpenSans-Regular"

export function generatePDF(form) {
  const doc = new jsPDF();

  // Dodaj czcionkę do VFS
  const base64 = window.OpenSansRegular.split(",")[1]; // usuń nagłówek "data:..."
  doc.addFileToVFS("OpenSans-Regular.ttf", base64);
  doc.addFont("OpenSans-Regular.ttf", "OpenSans", "normal");
  doc.setFont("OpenSans");
  doc.setFontSize(16);
  doc.text("Dane do doboru pompy ciepła", 14, 20);

  const data = Object.entries(form).map(([key, value]) => [
    key,
    Array.isArray(value) ? value.join(", ") : value || "-",
  ]);

  autoTable(doc, {
    startY: 30,
    head: [["Pole", "Wartość"]],
    body: data,
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold", fontSize: 12 },
    bodyStyles: { fontSize: 10, textColor: 50, font: "OpenSans" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    styles: { cellPadding: 3, font: "OpenSans" },
  });

  doc.save("dobor_pompy_ciepla.pdf");
}
