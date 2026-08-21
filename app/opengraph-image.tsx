import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Default social share card, inherited by every route that doesn't set its own
 * `openGraph.images`. Drawn with next/og rather than a static file so the
 * business details stay in sync with lib/site.ts.
 *
 * No external font fetch — the build stays offline-safe.
 */
export const alt = `${site.name} — smash repairs and spray painting in ${site.address.suburb}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#080a09",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* green glow, echoing the logo */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 620,
            height: 620,
            borderRadius: 999,
            background: "#16c047",
            opacity: 0.18,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1,
            }}
          >
            <span
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: -1,
              }}
            >
              SOLDEN
            </span>
            <span
              style={{ fontSize: 18, fontWeight: 600, color: "#39ff14", marginTop: 4 }}
            >
              Paint &amp; Panel
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 74,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -2.5,
              lineHeight: 1.05,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Done right the first time.</span>
            <span style={{ color: "#16c047" }}>On time.</span>
          </span>
          <span
            style={{
              fontSize: 27,
              color: "rgba(255,255,255,0.65)",
              marginTop: 26,
            }}
          >
            Smash repairs &amp; spray painting in {site.address.suburb}, north
            Brisbane — family owned for over 30 years.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontSize: 22,
            color: "rgba(255,255,255,0.75)",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            paddingTop: 26,
          }}
        >
          <span style={{ color: "#39ff14", fontWeight: 600 }}>
            {site.phone.primary}
          </span>
          <span>{site.address.full}</span>
        </div>
      </div>
    ),
    size,
  );
}
