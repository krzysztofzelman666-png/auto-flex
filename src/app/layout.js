import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "AutoFlex – wynajem aut",
  description: "Elastyczny wynajem samochodów bez ukrytych kosztów",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={geistSans.variable} style={{ margin: 0, minHeight: "100vh" }}>
        <nav style={{
          background: "#0f172a",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px",
        }}>
          <span style={{ color: "#60a5fa", fontSize: "18px", fontWeight: "500", letterSpacing: "1px" }}>
            AUTO<span style={{ color: "#fff" }}>FLEX</span>
          </span>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <a href="/" style={{ color: "#94a3b8", fontSize: "14px", textDecoration: "none" }}>
              Lista ogłoszeń
            </a>
            <a href="/dodaj" style={{
              color: "#fff",
              fontSize: "14px",
              textDecoration: "none",
              background: "#2563eb",
              padding: "7px 16px",
              borderRadius: "6px",
            }}>
              + Dodaj auto
            </a>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}