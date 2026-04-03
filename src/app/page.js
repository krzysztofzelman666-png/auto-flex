"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase"; 

export default function Home() {
  const [dni, setDni] = useState(1);
  const [listaAut, setListaAut] = useState([]); 
  const [szukaj, setSzukaj] = useState("");

  useEffect(() => {
    async function pobierzAuta() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        const sformatowane = data.map(auto => ({
          id: auto.id,
          nazwa: `${auto.brand} ${auto.model}`,
          cena: auto.price
        }));
        setListaAut(sformatowane);
      }
    }
    pobierzAuta();
  }, []);

  const przefiltrowaneAuta = listaAut.filter((auto) =>
    auto.nazwa.toLowerCase().includes(szukaj.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8 uppercase italic">Auto<span className="text-blue-600">Flex</span></h1>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
          <label className="block mb-2 font-bold text-sm uppercase text-slate-400">Liczba dni: {dni}</label>
          <input type="range" min="1" max="30" value={dni} onChange={(e) => setDni(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
        </div>

        <input type="text" placeholder="Szukaj auta..." className="w-full p-4 rounded-xl border mb-10 outline-none focus:border-blue-500" onChange={(e) => setSzukaj(e.target.value)} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {przefiltrowaneAuta.map((auto) => (
            <div key={auto.id} className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="text-xl font-bold mb-2">{auto.nazwa}</h3>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <span className="text-2xl font-black">{auto.cena * dni} PLN</span>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold">Wybierz</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}