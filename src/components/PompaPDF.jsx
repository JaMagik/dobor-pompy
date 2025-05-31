// src/components/PompaPDF.jsx

import { openSansRegular, openSansBold } from "../data/fonts.js";
import { logoBase64 } from "../data/logo.js";

const labels = {
  imie: "Imię i nazwisko",
  telefon: "Telefon",
  email: "Adres e-mail",
  adres: "Adres inwestycji",
  oczekiwania: "Interesujące mnie rozwiązania",
  budynek: "Typ budynku",
  dataBudowy: "Rok budowy",
  powierzchnia: "Powierzchnia ogrzewana (m²)",
  wysokosc: "Wysokość pomieszczeń (m)",
  konstrukcja: "Konstrukcja budynku",
  sciany: "Materiał ścian",
  ocieplenie: "Grubość ocieplenia ścian (cm)",
  docieplony: "Czy budynek jest docieplony?",
  okna: "Rodzaj okien",
  drzwi: "Rodzaj drzwi",
  izolacjaDachu: "Izolacja dachu/stropodachu",
  izolacjaPodlogi: "Izolacja podłogi na gruncie",
  temperaturaZima: "Utrzymywana temperatura zimą (°C)",
  wentylacja: "Rodzaj wentylacji",
  ileOsob: "Liczba osób (dla CWU)",
  zrodlo: "Obecne źródło ogrzewania",
  system: "System ogrzewania",
  tempPodlogowe: "Temperatura zasilania podłogówki (°C)",
  tempGrzejniki: "Temperatura zasilania grzejników (°C)",
  rodzajGrzejnika: "Rodzaj grzejników",
};

export function generatePDF(form, doc, autoTable) {
  let finalY = 0;

  // --- REJESTRACJA CZCIONEK ---
  doc.addFileToVFS("OpenSans-Regular.ttf", openSansRegular);
  doc.addFont("OpenSans-Regular.ttf", "OpenSans", "normal");
  doc.addFileToVFS("OpenSans-Bold.ttf", openSansBold);
  doc.addFont("OpenSans-Bold.ttf", "OpenSans", "bold");

  // --- FUNKCJE POMOCNICZE ---
  const drawBackground = () => {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    doc.setFillColor(243, 244, 246);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    const gradientWidth = 5;
    const rectHeight = 1;
    for (let i = 0; i < pageHeight; i += rectHeight) {
      const colorRatio = i / pageHeight;
      const r = 59 + (147 - 59) * colorRatio;
      const g = 130 + (51 - 130) * colorRatio;
      const b = 246 + (234 - 246) * colorRatio;
      doc.setFillColor(r, g, b);
      doc.rect(0, i, gradientWidth, rectHeight, 'F');
    }
  };

  const drawPageHeaderAndFooter = () => {
    const pageCount = doc.internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // ZMIANA: Poprawione dodawanie logo z zachowaniem proporcji
    if (logoBase64 && logoBase64.startsWith('data:image')) {
      const logoWidth = 50; // Ustaw stałą szerokość dla loga
      doc.addImage(logoBase64, 'PNG', 15, 15, logoWidth, 0);
    }

    doc.setFontSize(10);
    doc.setFont("OpenSans", "normal");
    doc.text(`Strona ${pageCount}`, pageWidth - 20, pageHeight - 10, { align: "right" });
  };

  const createSection = (title, data, startY) => {
    doc.setFont("OpenSans", "bold");
    doc.setFontSize(14);
    doc.text(title, 14, startY);

    const tableData = Object.entries(data).map(([key, value]) => {
      const formattedValue = Array.isArray(value) && value.length > 0 ? value.join(", ") : (value || "Nie podano");
      return [labels[key] || key, formattedValue];
    });

    autoTable(doc, {
      startY: startY + 5,
      head: [["Pole", "Wartość"]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255, font: "OpenSans", fontStyle: 'bold' },
      styles: { font: "OpenSans", fontStyle: 'normal', cellPadding: 3, valign: 'middle' },
      didDrawPage: drawPageHeaderAndFooter
    });
    return doc.lastAutoTable.finalY;
  };

  // --- RYSUJEMY STRONĘ 1 ---
  drawBackground();
  drawPageHeaderAndFooter();

  doc.setFont("OpenSans", "bold");
  doc.setFontSize(20);
  doc.text("Formularz Doboru Pompy Ciepła", 105, 40, { align: "center" });

  const clientData = { imie: form.imie, telefon: form.telefon, email: form.email, adres: form.adres };
  const expectationsData = { oczekiwania: form.oczekiwania };
  const buildingData = {
    budynek: form.budynek,
    dataBudowy: form.dataBudowy,
    powierzchnia: form.powierzchnia,
    wysokosc: form.wysokosc,
    konstrukcja: form.konstrukcja,
    sciany: form.sciany,
    ocieplenie: form.ocieplenie,
    docieplony: form.docieplony,
    okna: form.okna,
    drzwi: form.drzwi
  };

  finalY = createSection("Dane Klienta", clientData, 55);
  finalY = createSection("Oczekiwania", expectationsData, finalY + 15);
  finalY = createSection("Dane Budynku", buildingData, finalY + 15);

  // --- RYSUJEMY STRONĘ 2 ---
  doc.addPage();
  drawBackground();
  drawPageHeaderAndFooter();

  const techData = {
    izolacjaDachu: form.izolacjaDachu,
    izolacjaPodlogi: form.izolacjaPodlogi,
    temperaturaZima: form.temperaturaZima,
    wentylacja: form.wentylacja,
    ileOsob: form.ileOsob,
    zrodlo: form.zrodlo,
    system: form.system,
    tempPodlogowe: form.tempPodlogowe,
    tempGrzejniki: form.tempGrzejniki,
    rodzajGrzejnika: form.rodzajGrzejnika
  };
  createSection("Parametry Techniczne", techData, 30);

  // UWAGA! Nie robimy doc.save("..."), tylko zwracamy doc
}
