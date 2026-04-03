'use client'
export const dynamic = "force-dynamic";

import { useState } from 'react'
import { supabase } from '@/supabase'

export default function DodajAuto() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!supabase) return alert("Błąd bazy!");
    setLoading(true)

    const formData = new FormData(e.target)
    const { error } = await supabase.from('cars').insert([{
      brand: formData.get('brand'),
      model: formData.get('model'),
      price: parseInt(formData.get('price')),
      year: parseInt(formData.get('year')),
      description: formData.get('description'),
    }])

    setLoading(false)
    if (!error) {
      alert("Dodano pomyślnie!");
      window.location.href = "/";
    } else {
      alert(error.message);
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Dodaj nowe auto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <input name="brand" placeholder="Marka" className="border p-2 rounded" required />
        <input name="model" placeholder="Model" className="border p-2 rounded" required />
        <input name="price" type="number" placeholder="Cena" className="border p-2 rounded" required />
        <input name="year" type="number" placeholder="Rocznik" className="border p-2 rounded" required />
        <textarea name="description" placeholder="Opis" className="border p-2 rounded" />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white p-3 rounded font-bold">
          {loading ? 'Dodawanie...' : 'Dodaj ogłoszenie'}
        </button>
      </form>
    </div>
  )
}