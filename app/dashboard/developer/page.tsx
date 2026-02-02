import { ArrowLeft, Zap, Share2, BarChart3, Shield, Code } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/tutorial/code-block";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DocumentationPage() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Developer</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Documentation</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Complete guide to Qwizzed features and integrations
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-semibold transition hover:bg-muted/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      {/* Public Quiz API */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Public Discovery API</h2>
          <p className="text-muted-foreground">
            Fetch all published, public quizzes for display in your own
            application.
          </p>
        </div>

        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Discovery Endpoint</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Retrieve a list of all published, public quizzes programmatically.
          </p>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Endpoint:</h4>
            <CodeBlock code={`GET /api/quiz`} />
            <h4 className="text-sm font-semibold">Sample Response:</h4>
            <CodeBlock
              code={`[
  {
    "id": "quiz_123",
    "title": "Modern Web Development",
    "description": "Test your knowledge of React and Next.js",
    "total_questions": 15,
    "difficulty_level": "intermediate",
    "category": "Technology"
  }
]`}
            />
          </div>
        </div>
      </div>

      {/* API Management Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Quiz Management API</h2>
          <p className="text-muted-foreground">
            Create and manage quizzes programmatically. All endpoints require
            authentication.
          </p>
        </div>
        {/* Create Quiz */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Create Quiz</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">POST /api/quiz</p>
          <h4 className="text-sm font-semibold">Request Body:</h4>
          <CodeBlock
            code={`{
  "title": "JavaScript Fundamentals",
  "description": "Test your JS knowledge",
  "difficulty_level": "medium",
  "category": "Programming",
  "time_limit_minutes": 30,
  "visibility": "public",
  "organizer_name": "John Doe"
}`}
          />
          <h4 className="text-sm font-semibold mt-4">Response:</h4>
          <CodeBlock
            code={`{
  "id": "uuid-here",
  "title": "JavaScript Fundamentals",
  "description": "Test your JS knowledge",
  "difficulty_level": "medium",
  "category": "Programming",
  "total_questions": 0
}`}
          />
        </div>
        {/* Add Questions */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Add Question</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            POST /api/quiz/[id]/questions
          </p>
          <h4 className="text-sm font-semibold">Request Body:</h4>
          <CodeBlock
            code={`{
  "question_text": "What is a closure in JavaScript?",
  "question_type": "multiple_choice",
  "points": 10,
  "order": 1,
  "options": [
    {
      "option_text": "A function with access to parent scope",
      "is_correct": true,
      "order": 1
    },
    {
      "option_text": "A way to close the browser",
      "is_correct": false,
      "order": 2
    },
    {
      "option_text": "A CSS property",
      "is_correct": false,
      "order": 3
    }
  ]
}`}
          />
          <h4 className="text-sm font-semibold mt-4">Response:</h4>
          <CodeBlock
            code={`{
  "id": "question-uuid",
  "quiz_id": "quiz-uuid",
  "question_text": "What is a closure in JavaScript?",
  "question_type": "multiple_choice",
  "points": 10,
  "question_options": [
    {
      "id": "option-uuid",
      "option_text": "A function with access to parent scope",
      "is_correct": true
    }
  ]
}`}
          />
        </div>
        {/* Update Quiz */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Update Quiz</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            PUT /api/quiz/[id]
          </p>
          <h4 className="text-sm font-semibold">Request Body:</h4>
          <CodeBlock
            code={`{
  "title": "JavaScript Advanced",
  "is_published": true,
  "visibility": "public"
}`}
          />
          <h4 className="text-sm font-semibold mt-4">Response:</h4>
          <CodeBlock
            code={`{
  "id": "quiz-uuid",
  "title": "JavaScript Advanced",
  "is_published": true,
  "visibility": "public"
}`}
          />
        </div>
        {/* Get Quiz Details */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Get Quiz with Questions</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            GET /api/quiz/[id]
          </p>
          <h4 className="text-sm font-semibold">Response:</h4>
          <CodeBlock
            code={`{
  "id": "quiz-uuid",
  "title": "JavaScript Advanced",
  "description": "Test your JS knowledge",
  "total_questions": 1,
  "difficulty_level": "medium",
  "category": "Programming",
  "questions": [
    {
      "id": "question-uuid",
      "question_text": "What is a closure?",
      "question_type": "multiple_choice",
      "points": 10,
      "question_options": [
        {
          "id": "opt-uuid",
          "option_text": "A function with access to parent scope"
        }
      ]
    }
  ]
}`}
          />
        </div>
        {/* Delete Quiz */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Delete Quiz</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            DELETE /api/quiz/[id]
          </p>
          <h4 className="text-sm font-semibold">Response:</h4>
          <CodeBlock
            code={`{
  "success": true
}`}
          />
        </div>
        # Set your session cookie SESSION_COOKIE="your_session_cookie_here"
        BASE_URL="http://localhost:3000" # 1. Create Quiz QUIZ_RESPONSE=$(curl
        -s -X POST $BASE_URL/api/quiz \\ -H "Content-Type: application/json" \\
      </div>

      {/* Embedding Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Embedding Quizzes</h2>
          <p className="text-muted-foreground">
            Integrate Qwizzed quizzes into your website or application
          </p>
        </div>

        {/* iFrame Embedding */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Embed Quiz on Your Website
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Embed quizzes directly on your website using iframes
          </p>
          <h4 className="text-sm font-semibold mb-2">
            Getting the Embed Code:
          </h4>
          <CodeBlock
            code={`<iframe
  src="https://qwizzed.io/quiz/[quiz_id]"
  width="100%"
  height="600"
  style="border: none; border-radius: 8px;"
  allow="fullscreen"
></iframe>`}
          />
        </div>

        {/* Customization */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <h3 className="text-lg font-semibold">Customize Embedded Quiz</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add parameters to customize the appearance
          </p>
          <CodeBlock
            code={`Available Parameters:
• theme: 'light' | 'dark' | 'auto'
• showHeader: true | false (show quiz title)
• showResults: true | false (display score after)`}
          />
        </div>
      </div>

      {/* Implementation Summary */}
      <div className="space-y-4 rounded-lg border border-border/40 bg-card/50 p-6">
        <h2 className="text-2xl font-bold">Implementation Summary</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-primary font-bold">1</span>
            <span>
              <strong>Management:</strong> All operations (Create/Edit) must be
              done via the{" "}
              <code className="text-primary font-bold">/dashboard</code>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">2</span>
            <span>
              <strong>API Access:</strong> Use{" "}
              <code className="text-primary font-bold">/api/quiz</code> to fetch
              public listings.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">3</span>
            <span>
              <strong>Experience:</strong> Use the standard{" "}
              <code className="text-primary font-bold">/quizzes</code> feed for
              a native browser experience.
            </span>
          </li>
        </ul>
      </div>

      <div className="flex justify-center pt-8">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
