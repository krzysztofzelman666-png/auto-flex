"use client";

import { useState } from "react";

const SAMOCHODY_BAZA = [
  {
    id: 1,
    nazwa: "Tesla Model 3",
    cena: 299,
    paliwo: "Elektryczny",
    status: "Dostępny",
  },
  {
    id: 2,
    nazwa: "BMW M4",
    cena: 599,
    paliwo: "Benzyna",
    status: "Wypożyczony",
  },
  {
    id: 3,
    nazwa: "Audi RS6",
    cena: 899,
    paliwo: "Hybryda",
    status: "Dostępny",
  },
  {
    id: 4,
    nazwa: "Fiat 500",
    cena: 120,
    paliwo: "Elektryczny",
    status: "Dostępny",
  },
];

export default function Home() {
  const [dni, setDni] = useState(1);
  const [listaAut, setListaAut] = useState(SAMOCHODY_BAZA);
  const [historia, setHistoria] = useState([]);
  const [szukaj, setSzukaj] = useState("");
  const [polubione, setPolubione] = useState({});
  const sumaZarobku = historia.reduce(
    (acc, curr) => acc + Number(curr.koszt),
    0,
  );
  const liczbaWynajmow = historia.length;

  // Logika filtrowania
  const przefiltrowaneAuta = listaAut.filter((auto) =>
    auto.nazwa.toLowerCase().includes(szukaj.toLowerCase()),
  );
  const toggleLike = (id) => {
    setPolubione((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleBooking = (auto) => {
    if (auto.status === "Wypożyczony") return;

    const finalnyKoszt = (
      dni > 5 ? auto.cena * dni * 0.9 : auto.cena * dni
    ).toFixed(0);

    // Aktualizacja statusu auta
    const nowaLista = listaAut.map((a) =>
      a.id === auto.id ? { ...a, status: "Wypożyczony" } : a,
    );
    setListaAut(nowaLista);

    // Dodanie do historii
    const nowyWpis = {
      id: Date.now(),
      auto: auto.nazwa,
      dni: dni,
      koszt: finalnyKoszt,
      godzina: new Date().toLocaleTimeString(),
    };

    setHistoria([nowyWpis, ...historia]);
    alert(`Sukces! Zarezerwowano ${auto.nazwa} na ${dni} dni.`);
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20 text-slate-900 font-sans">
      {/* 1. Nawigacja */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50 p-4 flex justify-between items-center px-10 shadow-sm">
        <div className="font-bold text-xl uppercase tracking-tighter italic">
          Auto<span className="text-blue-600">Flex</span>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">
          Zaloguj
        </button>
      </nav>

      <div className="pt-32 flex flex-col items-center px-6">
        {/* 2. Panel Kalkulatora (Suwak) */}
        <div className="w-full max-w-xl bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 mb-8 text-center">
          <h1 className="text-3xl font-black mb-4 uppercase text-slate-800">
            Czas wynajmu
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6 text-blue-600">
            <span className="text-6xl font-black leading-none">{dni}</span>
            <span className="text-slate-400 font-bold text-xl uppercase tracking-widest pt-2">
              Dni
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={dni}
            onChange={(e) => setDni(parseInt(e.target.value))}
            className="w-full h-3 bg-blue-50 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 w-full max-w-xl mb-8">
          <div className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Całkowity przychód
            </p>
            <p className="text-3xl font-black text-green-600">
              {sumaZarobku} PLN
            </p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Aktywne rezerwacje
            </p>
            <p className="text-3xl font-black text-blue-600">
              {liczbaWynajmow}
            </p>
          </div>
        </div>

        {/* 3. Wyszukiwarka */}
        <div className="w-full max-w-xl mb-12">
          <div className="relative group">
            <input
              type="text"
              placeholder="Szukaj modelu (np. Tesla, BMW...)"
              className="w-full p-5 pl-14 rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none text-lg text-slate-800"
              onChange={(e) => setSzukaj(e.target.value)}
            />
            <span className="absolute left-5 top-5 text-2xl opacity-30 group-focus-within:opacity-100 transition-opacity">
              🔍
            </span>
          </div>
          <p className="text-center mt-3 text-slate-400 text-sm font-medium">
            Znaleziono:{" "}
            <span className="text-blue-600 font-bold">
              {przefiltrowaneAuta.length}
            </span>{" "}
            aut
          </p>
        </div>

        {/* 4. Lista Aut (Siatka) */}
        <div className="max-w-6xl w-full mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {przefiltrowaneAuta.map((auto) => {
              const cenaZrabatem = (
                dni > 5 ? auto.cena * dni * 0.9 : auto.cena * dni
              ).toFixed(0);

              return (
                <div
                  key={auto.id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100 group transition-all hover:shadow-2xl"
                >
                  <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-400 font-black uppercase text-2xl p-4 opacity-30">
                    {auto.nazwa}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <button
                        onClick={() => toggleLike(auto.id)}
                        className="text-2xl transition-transform active:scale-125"
                      >
                        {polubione[auto.id] ? "❤️" : "🤍"}
                      </button>
                      <h3 className="text-xl font-bold">{auto.nazwa}</h3>
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest ${auto.status === "Dostępny" ? "bg-green-100 text-green-700" : "bg-red-50 text-red-400"}`}
                      >
                        {auto.status}
                      </span>
                    </div>

                    <p className="text-slate-400 text-sm mb-6 font-medium italic">
                      {auto.paliwo}
                    </p>

                    <div className="flex justify-between items-end border-t pt-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">
                          Koszt całkowity
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-800">
                            {cenaZrabatem}
                          </span>
                          <span className="text-sm font-bold text-slate-400">
                            PLN
                          </span>
                        </div>
                        {dni > 5 && (
                          <p className="text-[10px] text-blue-600 font-bold uppercase mt-1">
                            -10% RABATU
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleBooking(auto)}
                        disabled={auto.status !== "Dostępny"}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                          auto.status === "Dostępny"
                            ? "bg-slate-900 text-white hover:bg-blue-600 active:scale-95 shadow-md shadow-slate-200"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {auto.status === "Dostępny" ? "Rezerwuj" : "Zajęty"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Panel Logów Systemowych */}
        <div className="max-w-6xl w-full mx-auto mt-12 p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 mb-10">
          <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-slate-800">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            LOGI SYSTEMOWE (DASHBOARD ADMINA)
          </h2>

          {historia.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 italic text-sm">
                System oczekuje na rezerwacje...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {historia.map((wpis) => (
                <div
                  key={wpis.id}
                  className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border-l-8 border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                      {wpis.godzina}
                    </div>
                    <span className="font-black text-slate-700">
                      {wpis.auto}
                    </span>
                    <span className="text-slate-500 text-sm ml-2">
                      wynajęty na{" "}
                      <span className="font-bold">{wpis.dni} dni</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-blue-600 text-xl">
                      {wpis.koszt} PLN
                    </div>
                    <div className="text-[10px] text-green-600 font-bold uppercase">
                      Opłacono
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
