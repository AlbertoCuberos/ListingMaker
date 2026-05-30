import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050508",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 400,
            background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Rocket + name row */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
          <span style={{ fontSize: 96 }}>🚀</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 64, fontWeight: 800, color: "#ffffff", lineHeight: 1 }}>
              Listing<span style={{ color: "#f97316" }}>Maker</span>
            </span>
            <span style={{ fontSize: 22, color: "#f97316", fontWeight: 600, letterSpacing: 2 }}>
              listingmaker.app
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "#9ca3af",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Create Amazon listings that sell.{" "}
          <span style={{ color: "#ffffff", fontWeight: 700 }}>In 60 seconds.</span>
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
          {["COSMO Algorithm", "Rufus AI", "6 Markets"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(249,115,22,0.1)",
                border: "1px solid rgba(249,115,22,0.3)",
                borderRadius: 999,
                padding: "8px 20px",
                color: "#fb923c",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
