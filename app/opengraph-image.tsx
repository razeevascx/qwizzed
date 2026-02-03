import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Qwizzed - Quiz Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          <h1
            style={{
              fontSize: "96px",
              fontWeight: "bold",
              color: "white",
              margin: "0 0 20px 0",
              letterSpacing: "-2px",
            }}
          >
            Qwizzed
          </h1>
          <p
            style={{
              fontSize: "42px",
              color: "white",
              margin: 0,
              opacity: 0.95,
            }}
          >
            Create, share, and take interactive quizzes
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
