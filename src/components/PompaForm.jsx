// src/components/PompaForm.jsx
import React, { useState, useEffect } from "react";
import { generatePDF } from "./PompaPDF";
import FormSection from "./FormSection";
import FormInput from "./FormInput";

// Definicje pól formularza dla łatwiejszego zarządzania
const sections = {
  basic: {
    title: "Podstawowe dane",
    fields: [
      { name: "imie", label: "Imię", required: true, type: "text" },
      { name: "telefon", label: "Telefon", required: true, type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "adres", label: "Adres", type: "text" },
    ],
  },
  expectations: {
    title: "Oczekiwania",
    checkboxes: ["Pompa ciepła", "Panele fotowoltaiczne", "Rekuperacja"],
  },
  building: {
    title: "Dane budynku",
    fields: [
      {
        name: "budynek",
        label: "Typ budynku",
        type: "select",
        options: [
          "",
          "Jednorodzinny",
          "Bliźniak",
          "Szeregowy",
          "Wielorodzinny (np. kamienica, blok)",
          "Gospodarczy",
          "Usługowy",
          "Inny",
        ],
      },
      {
        name: "dataBudowy",
        label: "Data budowy",
        type: "select",
        options: [
          "",
          "Przed 1945",
          "1945 - 1970",
          "1971 - 1990",
          "1991 - 2000",
          "2001 - 2010",
          "2011 - 2020",
          "Po 2020",
          "W trakcie budowy",
        ],
      },
      { name: "powierzchnia", label: "Powierzchnia całkowita", type: "text" },
      {
        name: "konstrukcja",
        label: "Konstrukcja budynku",
        type: "select",
        options: [
          "",
          "Murowana",
          "Drewniana (np. szkieletowa, z bali)",
          "Wielka płyta",
          "Mieszana",
          "Inna",
        ],
      },
      {
        name: "sciany",
        label: "Rodzaj ścian",
        type: "select",
        options: [
          "",
          "Cegła pełna",
          "Pustak ceramiczny (np. Porotherm, Leier)",
          "Beton komórkowy (np. Suporex, Ytong)",
          "Silikaty",
          "Pustak żużlobetonowy",
          "Drewno",
          "Inne",
        ],
      },
      {
        name: "ocieplenie",
        label: "Ocieplenie",
        type: "select",
        options: [
          "",
          "Styropian (biały, grafitowy)",
          "Wełna mineralna (skalna, szklana)",
          "Pianka poliuretanowa (PUR/PIR)",
          "Brak ocieplenia",
          "Nie wiem",
          "Inne",
        ],
      },
      { name: "docieplony", label: "Dom docieplony", type: "text" },
      { name: "okna", label: "Okna", type: "text", placeholder: "Wpisz rodzaj okien i ich ilość" },
      { name: "drzwi", label: "Drzwi", type: "text", placeholder: "Wpisz rodzaj drzwi i ich ilość" },
    ],
  },
  tech: {
    title: "Parametry techniczne",
    fields: [
      {
        name: "izolacjaDachu",
        label: "Izolacja dachu",
        type: "select",
        options: [
          "",
          "Wełna mineralna (skalna, szklana)",
          "Styropian / Styropapa",
          "Pianka poliuretanowa (PUR/PIR)",
          "Celuloza (włókna celulozowe)",
          "Brak ocieplenia",
          "Nie wiem",
          "Inne",
        ],
      },
      { name: "izolacjaPodlogi", label: "Izolacja podłogi", type: "text" },
      {
        name: "wentylacja",
        label: "Wentylacja",
        type: "select",
        options: [
          "",
          "Grawitacyjna",
          "Mechaniczna z odzyskiem ciepła (Rekuperacja)",
          "Mechaniczna (bez odzysku)",
          "Inna"
        ]
      },
      { name: "ileOsob", label: "CWU - ile osób", type: "text" },
      {
        name: "zrodlo",
        label: "Obecne źródło ogrzewania",
        type: "select",
        options: [
          "",
          "Kocioł węglowy",
          "Kocioł gazowy",
          "Kocioł olejowy",
          "Kocioł na pellet/drewno",
          "Ogrzewanie elektryczne (np. grzejniki, piece akumulacyjne)",
          "Kominek z płaszczem wodnym",
          "Miejska sieć ciepłownicza",
          "Brak - nowy budynek",
          "Inne"
        ]
      },
      { name: "system", label: "System ogrzewania", type: "text" },
      {
        name: "rodzajGrzejnika",
        label: "Rodzaj grzejnika",
        type: "select",
        options: [
          "",
          "Grzejniki panelowe stalowe",
          "Grzejniki aluminiowe",
          "Grzejniki żeliwne",
          "Grzejniki konwektorowe",
          "Ogrzewanie podłogowe",
          "Klimakonwektory",
          "Mieszane (np. podłogówka + grzejniki)",
          "Inne"
        ]
      },
    ],
  },
};

export default function PompaForm() {
  const [form, setForm] = useState({
    imie: "", telefon: "", email: "", oczekiwania: [], budynek: "",
    adres: "", dataBudowy: "", powierzchnia: "",
    konstrukcja: "", sciany: "", ocieplenie: "", docieplony: "",
    okna: "", drzwi: "", izolacjaDachu: "", izolacjaPodlogi: "",
    wentylacja: "", ileOsob: "", zrodlo: "",
    system: "", rodzajGrzejnika: "",
  });

  const [isSubmittable, setIsSubmittable] = useState(false);
  const [cardId, setCardId] = useState(null); // <- nowy stan

  // Pobierz cardId z Power-Upa
  useEffect(() => {
    if (window.TrelloPowerUp) {
      const t = window.TrelloPowerUp.iframe();
      t.card('id').then(card => {
        setCardId(card.id);
      });
    }
  }, []);

  // Efekt do sprawdzania walidacji
  useEffect(() => {
    if (form.imie.trim() !== "" && form.telefon.trim() !== "") {
      setIsSubmittable(true);
    } else {
      setIsSubmittable(false);
    }
  }, [form.imie, form.telefon]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        oczekiwania: checked
          ? [...prev.oczekiwania, value]
          : prev.oczekiwania.filter((item) => item !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  // Funkcja generująca PDF i uploadująca do Trello!
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isSubmittable) return;

    // 1. Wygeneruj PDF (ale zamiast doc.save, pobierz blob!)
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;
    const { generatePDF } = await import("./PompaPDF");

    // --- Uwaga: generujemy PDF jako Blob (hack na pobranie z jsPDF)
    const doc = new jsPDF();
    generatePDF(form, doc, autoTable); // musisz przerobić funkcję generatePDF na przyjmującą istniejący obiekt doc
    const pdfBlob = doc.output("blob");

    if (!cardId) {
      alert("Nie znaleziono ID karty Trello.");
      return;
    }

    // 2. Upload do Trello
    const formData = new FormData();
    formData.append('file', pdfBlob, 'dobor-pompy.pdf');

    // Podmień na swój własny token użytkownika (pobierz z https://trello.com/app-key)
    const apiKey = "8a9a4adfbb1f91abc631181c4b722364";
    const token = import.meta.env.VITE_TRELLO_TOKEN;

    try {
      const res = await fetch(
        `https://api.trello.com/1/cards/${cardId}/attachments?key=${apiKey}&token=${token}`,
        { method: 'POST', body: formData }
      );
      if (!res.ok) throw new Error('Błąd uploadu do Trello');
      alert("PDF został dodany do karty Trello!");
    } catch (err) {
      alert("Błąd przy dodawaniu PDF do Trello: " + err.message);
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Dane do doboru pompy ciepła</h2>

      <form onSubmit={handleSubmit}>
        <FormSection title={sections.basic.title}>
          {sections.basic.fields.map((field) => (
            <FormInput
              key={field.name}
              {...field}
              value={form[field.name]}
              onChange={handleChange}
            />
          ))}
        </FormSection>

        <FormSection title={sections.expectations.title}>
          <div className="checkbox-group">
            {sections.expectations.checkboxes.map((item) => (
              <label key={item} className="checkbox-label">
                <input
                  type="checkbox"
                  name="oczekiwania"
                  value={item}
                  checked={form.oczekiwania.includes(item)}
                  onChange={handleChange}
                />
                {item}
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection title={sections.building.title}>
          {sections.building.fields.map((field) => (
            <FormInput
              key={field.name}
              {...field}
              value={form[field.name]}
              onChange={handleChange}
            />
          ))}
        </FormSection>

        <FormSection title={sections.tech.title}>
          {sections.tech.fields.map((field) => (
            <FormInput
              key={field.name}
              {...field}
              value={form[field.name]}
              onChange={handleChange}
            />
          ))}
        </FormSection>

        <button type="submit" className="submit-btn" disabled={!isSubmittable}>
          Wygeneruj PDF i zapisz w Trello
        </button>
      </form>
    </div>
  );
}
