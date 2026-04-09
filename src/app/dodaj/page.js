"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import { useState } from "react";
import { supabase } from "@/supabase";
import { useRouter } from "next/navigation";

export default function DodajAuto() {
  const router = useRouter();
  useEffect(() => {
    supabase?.auth.getUser().then(({ data }) => {
      if (!data?.user) router.push("/login");
    });
  }, []);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Plik musi być mniejszy niż 5MB");
        return;
      }
      setFile(selectedFile);
      setError("");

      // Podgląd obrazu
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) return alert("Błąd bazy!");

    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.target);
      let imageUrl = null;

      // Wgraj obraz, jeśli został wybrany
      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Pobierz publiczny URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("car-images").getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Dodaj auto do bazy
      const { error } = await supabase.from("cars").insert([
        {
          brand: formData.get("brand"),
          model: formData.get("model"),
          price: parseInt(formData.get("price")),
          year: parseInt(formData.get("year")),
          description: formData.get("description"),
          image_url: imageUrl,
        },
      ]);

      if (error) throw error;

      alert("Dodano pomyślnie!");
      router.push("/");
    } catch (err) {
      setError(err.message);
      alert(`Błąd: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Dodaj nowe auto</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <input
          name="brand"
          placeholder="Marka"
          className="border p-2 rounded"
          required
        />
        <input
          name="model"
          placeholder="Model"
          className="border p-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Cena"
          className="border p-2 rounded"
          required
        />
        <input
          name="year"
          type="number"
          placeholder="Rocznik"
          className="border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Opis"
          className="border p-2 rounded"
        />

        {/* NOWE POLE DLA OBRAZÓW */}
        <div className="border-2 border-dashed border-gray-300 p-4 rounded">
          <label className="block text-sm font-medium mb-2">
            Wrzuć zdjęcie samochodu
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Dodawanie..." : "Dodaj ogłoszenie"}
        </button>
      </form>
    </div>
  );
}
