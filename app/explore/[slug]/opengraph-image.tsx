import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quiz on Qwizzed";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch quiz data
  let quizTitle = "Quiz";
  let quizDescription = "Take this quiz on Qwizzed";
  let organizerName = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/quiz/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (res.ok) {
      const quiz = await res.json();
      quizTitle = quiz.title || quizTitle;
      quizDescription = quiz.description || quizDescription;
      organizerName = quiz.organizer_name;
    }
  } catch (error) {
    console.error("Failed to fetch quiz for OG image:", error);
  }

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
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "white",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              marginBottom: "20px",
              opacity: 0.9,
              fontWeight: "600",
            }}
          >
            Qwizzed Quiz
          </div>
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              margin: "0 0 24px 0",
              letterSpacing: "-1px",
              lineHeight: 1.2,
              maxWidth: "1000px",
            }}
          >
            {quizTitle}
          </h1>
          {quizDescription && (
            <p
              style={{
                fontSize: "32px",
                margin: "0 0 20px 0",
                opacity: 0.9,
                maxWidth: "900px",
                lineHeight: 1.4,
              }}
            >
              {quizDescription.length > 120
                ? quizDescription.substring(0, 120) + "..."
                : quizDescription}
            </p>
          )}
          {organizerName && (
            <div
              style={{
                fontSize: "24px",
                marginTop: "20px",
                opacity: 0.85,
                fontStyle: "italic",
              }}
            >
              Organized by {organizerName}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
