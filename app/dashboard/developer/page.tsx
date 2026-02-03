import {
  Zap,
  Code,
  Server,
  Globe,
  Lock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Terminal as TerminalIcon,
  FileCode,
  Boxes,
} from "lucide-react";
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
  const endpoints = [
    {
      method: "GET",
      path: "/api/quiz",
      description: "List all public quizzes",
      auth: false,
      color: "text-green-500",
    },
    {
      method: "GET",
      path: "/api/quiz/[id]",
      description: "Get quiz details with questions",
      auth: false,
      color: "text-green-500",
    },
    {
      method: "POST",
      path: "/api/quiz",
      description: "Create a new quiz",
      auth: true,
      color: "text-blue-500",
    },
    {
      method: "PUT",
      path: "/api/quiz/[id]",
      description: "Update quiz metadata",
      auth: true,
      color: "text-yellow-500",
    },
    {
      method: "DELETE",
      path: "/api/quiz/[id]",
      description: "Delete a quiz",
      auth: true,
      color: "text-red-500",
    },
    {
      method: "POST",
      path: "/api/quiz/[id]/questions",
      description: "Add question to quiz",
      auth: true,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="space-y-10">
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

      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Developer Guide
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Documentation
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Complete guide to Qwizzed APIs, integrations, and embedding. Build
              quiz experiences into your applications with our REST API.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-border/60 bg-card/30 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">6</div>
                <div className="text-xs text-muted-foreground">Endpoints</div>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-border/60 bg-card/30 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">REST</div>
                <div className="text-xs text-muted-foreground">API Style</div>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-border/60 bg-card/30 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">Secure</div>
                <div className="text-xs text-muted-foreground">Auth Ready</div>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-border/60 bg-card/30 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">Public</div>
                <div className="text-xs text-muted-foreground">Open API</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints Overview */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">API Endpoints</h2>
          <p className="text-muted-foreground text-lg">
            All available REST endpoints for quiz management and discovery
          </p>
        </div>

        <div className="space-y-3">
          {endpoints.map((endpoint, idx) => (
            <div
              key={idx}
              className="group p-5 rounded-lg border border-border/60 bg-card/30 hover:border-primary/40 hover:bg-card/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <span
                    className={`font-mono font-bold text-sm px-3 py-1 rounded-md bg-muted ${endpoint.color}`}
                  >
                    {endpoint.method}
                  </span>
                  <div className="flex-1 space-y-1">
                    <code className="font-mono text-sm font-semibold">
                      {endpoint.path}
                    </code>
                    <p className="text-sm text-muted-foreground">
                      {endpoint.description}
                    </p>
                  </div>
                </div>
                {endpoint.auth && (
                  <div className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    <Lock className="w-3 h-3" />
                    Auth Required
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Public Discovery API */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <h2 className="text-3xl font-bold tracking-tight">
              Public Discovery API
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Fetch all published, public quizzes for display in your own
            application. No authentication required.
          </p>
        </div>

        <div className="space-y-6 rounded-xl border border-border/60 bg-card/30 p-8">
          <div className="flex items-center gap-3 pb-4 border-b border-border/60">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Discovery Endpoint</h3>
              <p className="text-sm text-muted-foreground">
                Retrieve a list of all published, public quizzes
                programmatically
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-primary" />
                Endpoint
              </h4>
              <CodeBlock code={`GET /api/quiz`} />
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Sample Response</h4>
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
      </div>

      {/* Quiz Management API */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <h2 className="text-3xl font-bold tracking-tight">
              Quiz Management API
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Create and manage quizzes programmatically. All endpoints require
            authentication via session cookies.
          </p>
        </div>

        {/* Create Quiz */}
        <div className="space-y-6 rounded-xl border border-border/60 bg-card/30 p-8">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileCode className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Create Quiz</h3>
                <code className="text-sm text-muted-foreground font-mono">
                  POST /api/quiz
                </code>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Lock className="w-3 h-3" />
              Auth Required
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-3">Request Body</h4>
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
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Response</h4>
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
          </div>
        </div>

        {/* Add Questions */}
        <div className="space-y-6 rounded-xl border border-border/60 bg-card/30 p-8">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Boxes className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Add Question</h3>
                <code className="text-sm text-muted-foreground font-mono">
                  POST /api/quiz/[id]/questions
                </code>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Lock className="w-3 h-3" />
              Auth Required
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-3">Request Body</h4>
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
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Response</h4>
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
          </div>
        </div>

        {/* Update Quiz */}
        <div className="space-y-6 rounded-xl border border-border/60 bg-card/30 p-8">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Update Quiz</h3>
                <code className="text-sm text-muted-foreground font-mono">
                  PUT /api/quiz/[id]
                </code>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Lock className="w-3 h-3" />
              Auth Required
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-3">Request Body</h4>
              <CodeBlock
                code={`{
  "title": "JavaScript Advanced",
  "is_published": true,
  "visibility": "public"
}`}
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Response</h4>
              <CodeBlock
                code={`{
  "id": "quiz-uuid",
  "title": "JavaScript Advanced",
  "is_published": true,
  "visibility": "public"
}`}
              />
            </div>
          </div>
        </div>

        {/* Get Quiz Details */}
        <div className="space-y-6 rounded-xl border border-border/60 bg-card/30 p-8">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  Get Quiz with Questions
                </h3>
                <code className="text-sm text-muted-foreground font-mono">
                  GET /api/quiz/[id]
                </code>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-3">Response</h4>
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
          </div>
        </div>

        {/* Delete Quiz */}
        <div className="space-y-6 rounded-xl border border-border/60 bg-card/30 p-8">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Delete Quiz</h3>
                <code className="text-sm text-muted-foreground font-mono">
                  DELETE /api/quiz/[id]
                </code>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Lock className="w-3 h-3" />
              Auth Required
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-3">Response</h4>
              <CodeBlock
                code={`{
  "success": true
}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Embedding Section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <h2 className="text-3xl font-bold tracking-tight">
              Embedding Quizzes
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Integrate Qwizzed quizzes directly into your website or application
            using iframes or direct links.
          </p>
        </div>

        {/* iFrame Embedding */}
        <div className="space-y-6 rounded-xl border border-border/60 bg-card/30 p-8">
          <div className="flex items-center gap-3 pb-4 border-b border-border/60">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                Embed Quiz on Your Website
              </h3>
              <p className="text-sm text-muted-foreground">
                Embed quizzes directly on your website using iframes
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-3">Basic Embed Code</h4>
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

            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
              <h4 className="text-sm font-semibold mb-3">
                Customization Parameters
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <code className="text-primary">theme</code>
                  <span>: 'light' | 'dark' | 'auto'</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <code className="text-primary">showHeader</code>
                  <span>: true | false (show quiz title)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <code className="text-primary">showResults</code>
                  <span>: true | false (display score after completion)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Summary */}
      <div className="space-y-6 rounded-xl border-2 border-primary/20 bg-primary/5 p-8">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Implementation Summary</h2>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 p-4 rounded-lg bg-card/50 border border-border/40">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
              1
            </span>
            <div className="space-y-1">
              <h4 className="font-semibold">Quiz Management</h4>
              <p className="text-sm text-muted-foreground">
                All create and edit operations must be done via the{" "}
                <code className="px-2 py-0.5 rounded bg-muted text-primary font-mono text-xs">
                  /dashboard
                </code>{" "}
                interface.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-card/50 border border-border/40">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
              2
            </span>
            <div className="space-y-1">
              <h4 className="font-semibold">Public API Access</h4>
              <p className="text-sm text-muted-foreground">
                Use{" "}
                <code className="px-2 py-0.5 rounded bg-muted text-primary font-mono text-xs">
                  /api/quiz
                </code>{" "}
                to fetch public quiz listings programmatically.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-card/50 border border-border/40">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
              3
            </span>
            <div className="space-y-1">
              <h4 className="font-semibold">User Experience</h4>
              <p className="text-sm text-muted-foreground">
                Use the standard{" "}
                <code className="px-2 py-0.5 rounded bg-muted text-primary font-mono text-xs">
                  /quizzes
                </code>{" "}
                feed for a native browser experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
