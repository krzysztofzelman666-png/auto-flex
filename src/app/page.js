"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase";

export default function Home() {
  const [dni, setDni] = useState(5);
  const [listaAut, setListaAut] = useState([]);
  const [user, setUser] = useState(null); // ← dodaj tę linię
  useEffect(() => {
    async function pobierzAuta() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error(error);
      if (data) {
        setListaAut(
          data.map((auto) => ({
            id: auto.id,
            nazwa: `${auto.brand} ${auto.model}`,
            cena: auto.price,
            rok: auto.year,
            opis: auto.description,
            imageUrl: auto.image_url,
          })),
        );
      }
    }
    pobierzAuta();
    supabase?.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
  }, []);

  return (
    <main style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* HERO */}
      <div style={{ background: "#0f172a", padding: "40px 24px 48px" }}>
        <p
          style={{
            color: "#60a5fa",
            fontSize: "13px",
            letterSpacing: "2px",
            margin: "0 0 8px",
            textTransform: "uppercase",
          }}
        >
          Wynajem samochodów
        </p>
        <h1
          style={{
            color: "#fff",
            fontSize: "28px",
            fontWeight: "500",
            margin: "0 0 16px",
          }}
        >
          Znajdź auto dla siebie
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "15px", margin: "0 0 28px" }}>
          Elastyczny wynajem bez ukrytych kosztów
        </p>

        {/* SUWAK */}
        <div
          style={{
            background: "#1e293b",
            borderRadius: "10px",
            padding: "16px 20px",
            maxWidth: "400px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span
            style={{ color: "#94a3b8", fontSize: "13px", whiteSpace: "nowrap" }}
          >
            Dni wynajmu:
          </span>
          <input
            type="range"
            min="1"
            max="30"
            value={dni}
            onChange={(e) => setDni(parseInt(e.target.value))}
            style={{ flex: 1 }}
          />
          <span
            style={{
              color: "#60a5fa",
              fontSize: "15px",
              fontWeight: "500",
              minWidth: "20px",
            }}
          >
            {dni}
          </span>
        </div>
      </div>

      {/* KARTY AUT */}
      <div style={{ padding: "28px 24px" }}>
        {listaAut.length === 0 ? (
          <p style={{ color: "#64748b" }}>Ładowanie aut lub brak danych...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {listaAut.map((auto) => (
              <div
                key={auto.id}
                style={{
                  background: "#fff",
                  border: "0.5px solid #e2e8f0",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {/* ZDJĘCIE LUB PLACEHOLDER */}
                <div style={{ height: "140px", overflow: "hidden" }}>
                  {auto.imageUrl ? (
                    <img
                      src={auto.imageUrl}
                      alt={auto.nazwa}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        background: "#1e3a5f",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "#60a5fa",
                          fontSize: "13px",
                          fontWeight: "500",
                          letterSpacing: "1px",
                        }}
                      >
                        {auto.rok ?? "—"}
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      color: "#0f172a",
                      margin: "0 0 4px",
                    }}
                  >
                    {auto.nazwa}
                  </p>
                  {auto.opis && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        margin: "0 0 12px",
                      }}
                    >
                      {auto.opis}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "4px",
                      margin: "0 0 12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "#2563eb",
                      }}
                    >
                      {(auto.cena * dni).toLocaleString("pl-PL")}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      PLN
                    </span>
                  </div>
                  {user?.email === "zelmer666@gmail.com" && (
                    <button
                      onClick={async () => {
                        if (!confirm("Czy na pewno chcesz usunąć to auto?"))
                          return;
                        const { error } = await supabase
                          .from("cars")
                          .delete()
                          .eq("id", auto.id);
                        if (error) {
                          alert("Błąd usuwania: " + error.message);
                        } else {
                          setListaAut((prev) =>
                            prev.filter((a) => a.id !== auto.id),
                          );
                        }
                      }}
                      style={{
                        width: "100%",
                        background: "transparent",
                        color: "#ef4444",
                        border: "1px solid #ef4444",
                        borderRadius: "6px",
                        padding: "8px",
                        fontSize: "13px",
                        cursor: "pointer",
                        marginTop: "8px",
                      }}
                    >
                      Usuń
                    </button>
                  )}
                </div>{" "}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
