import { ArrowLeft, List, Share2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/tutorial/code-block";

export default function APIReferencePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">API Reference</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Feature implementation and export options for Qwizzed
          </p>
        </div>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-semibold transition hover:bg-muted/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* List Quizzes Feature */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">List Your Quizzes</h2>
          <p className="text-muted-foreground text-sm mt-1">
            View all your quizzes with detailed statistics and management
            options
          </p>
        </div>

        {/* My Quizzes */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <List className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Accessing Your Quiz List</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Navigate to your quiz management dashboard to view all created
            quizzes
          </p>
          <CodeBlock
            code={`Dashboard Navigation:
1. Go to /quiz/my-quizzes
2. View all your quizzes in a grid layout
3. Each card shows:
   - Quiz title and description
   - Status (Published/Draft)
   - Creation date
   - Question count
   - Quick actions (Edit, Delete, Share)

Features:
✓ Search and filter quizzes
✓ Sort by creation date or name
✓ Responsive grid (1-3 columns)
✓ See quiz status at a glance
✓ Direct access to analytics`}
          />
        </div>

        {/* Quiz Statistics */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <h3 className="text-lg font-semibold">Quick Stats on Each Quiz</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Each quiz card displays important metrics
          </p>
          <CodeBlock
            code={`Available Statistics Per Quiz:
• Total Attempts - How many times the quiz was taken
• Unique Users - Number of different people who took it
• Average Score - Mean percentage across all attempts
• Highest Score - Best score achieved
• Lowest Score - Lowest score achieved
• Last Attempt - Most recent submission time
• Status - Published or Draft

Click any quiz for detailed analytics:
/quiz/analytics/:id`}
          />
        </div>
      </div>

      {/* Export & Share Feature */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Export & Share Quizzes</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Share your quizzes via link, email, or embed code
          </p>
        </div>

        {/* Share Feature */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Share Quiz</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Share your quiz with others via direct link or social media
          </p>
          <CodeBlock
            code={`To Share a Quiz:
1. Go to /quiz/my-quizzes
2. Click the Share button on any quiz
3. Choose sharing method:

   a) Copy Link - Direct shareable URL
      https://qwizzed.io/quiz/quiz_123

   b) Email - Send to specific people
      - Enter email addresses
      - Add custom message
      - Click Send

   c) Social Media - Share on platforms
      - Copy pre-formatted message
      - Paste on Twitter, LinkedIn, etc.

Link Features:
✓ Short, memorable URLs
✓ Automatic expiration options
✓ Usage tracking
✓ Password protection (optional)`}
          />
        </div>

        {/* iFrame Export */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <h3 className="text-lg font-semibold">Export as iFrame</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Embed quizzes directly into your website or blog
          </p>
          <CodeBlock
            code={`To Generate Embed Code:
1. Go to your quiz
2. Click "Export" or "Embed"
3. Select "iFrame Code"
4. Choose customization options:
   - Size (width/height)
   - Theme (light/dark)
   - Show/hide results
   - Allow retakes

Generated Code:
<iframe
  src="https://qwizzed.io/embed/quiz_123"
  width="100%"
  height="600"
  style="border: none; border-radius: 8px;"
  allow="fullscreen"
></iframe>

Customize Parameters:
?theme=dark
&showResults=true
&allowRetake=false
&showProgress=true`}
          />
        </div>

        {/* Custom Embed Options */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <h3 className="text-lg font-semibold">Embed Customization Options</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Fine-tune the embedded quiz appearance and behavior
          </p>
          <CodeBlock
            code={`Available Customization Parameters:

1. theme
   Values: 'light' | 'dark' | 'auto'
   Default: 'auto' (matches user preference)
   Example: ?theme=dark

2. showHeader
   Values: true | false
   Default: true
   Shows quiz title and description

3. showResults
   Values: true | false
   Default: true
   Display score after completion

4. allowRetake
   Values: true | false
   Default: true
   Let users retake the quiz

5. showProgress
   Values: true | false
   Default: true
   Show progress bar during quiz

6. showTimer
   Values: true | false
   Default: true
   Display countdown timer (if time limit set)

7. locale
   Values: 'en' | 'es' | 'fr' | 'de'
   Default: 'en'
   Quiz language

Combined Example:
<iframe src="https://qwizzed.io/embed/quiz_123?theme=dark&showResults=true&allowRetake=false&locale=en"></iframe>`}
          />
        </div>
      </div>

      {/* Check Components Feature */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Quiz Components & Checks</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Available UI components and status indicators
          </p>
        </div>

        {/* Status Components */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Status Indicators</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Visual components showing quiz status
          </p>
          <CodeBlock
            code={`Quiz Status Badges:

1. Published Badge (Green)
   - Quiz is publicly available
   - Appears when is_published: true

2. Draft Badge (Gray)
   - Quiz not yet published
   - Only creator can see/edit

3. Public Visibility (Globe Icon)
   - Anyone can access via link
   - visibility: 'public'

4. Private Visibility (Lock Icon)
   - Only invited users can access
   - visibility: 'private'

5. Active Status (Pulse)
   - Quiz currently receiving submissions
   - Shown when total_attempts > 0

6. No Attempts (Empty State)
   - Quiz created but no submissions yet
   - Shows encouragement message`}
          />
        </div>

        {/* Component Codes */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <h3 className="text-lg font-semibold">Available Components</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Reusable UI components for quiz management
          </p>
          <CodeBlock
            code={`Built-in Components:

1. Quiz Card
   - Displays quiz preview
   - Shows stats and metadata
   - Includes action buttons
   - Responsive design

2. Stats Panel
   - Total Attempts
   - Unique Users
   - Average Score
   - High/Low Scores

3. Progress Bar
   - Current question progress
   - Visual percentage indicator
   - Animated transitions

4. Timer Component
   - Countdown display
   - Color changes when low
   - Pause/Resume controls

5. Result Card
   - Final score display
   - Percentage breakdown
   - Correct/incorrect count
   - Retake option button

6. Invitation Component
   - Email input field
   - Message editor
   - Send status indicator
   - Invitation history`}
          />
        </div>
      </div>

      {/* Integration Checklist */}
      <div className="space-y-4 rounded-lg border border-border/40 bg-card/50 p-6">
        <h2 className="text-2xl font-bold">Integration Checklist</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Create Quiz:</strong> Use /quiz/create form builder
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>List Quizzes:</strong> View all at /quiz/my-quizzes
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Publish Quiz:</strong> Set status to Published
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Share Quiz:</strong> Copy shareable link or email
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Export as iFrame:</strong> Get embed code from Export menu
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Track Results:</strong> View analytics at /quiz/analytics
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Send Invitations:</strong> Invite users from quiz settings
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Monitor Status:</strong> Check real-time stats on
              dashboard
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
