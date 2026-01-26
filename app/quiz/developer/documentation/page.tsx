import { ArrowLeft, Zap, Share2, BarChart3, Shield, Code } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/tutorial/code-block";

export default function DocumentationPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Documentation</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Complete guide to Qwizzed features and integrations
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

      {/* Core Features Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Core Features</h2>
          <p className="text-muted-foreground">
            Master the essential features of Qwizzed for creating and managing
            quizzes
          </p>
        </div>

        {/* Creating Quizzes */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Creating Quizzes</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Create engaging quizzes with multiple question types and
            customization options
          </p>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold mb-2">
                Supported Question Types:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  •{" "}
                  <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded">
                    multiple_choice
                  </span>{" "}
                  - Select one correct answer
                </li>
                <li>
                  •{" "}
                  <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded">
                    true_false
                  </span>{" "}
                  - Quick true/false questions
                </li>
                <li>
                  •{" "}
                  <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded">
                    fill_in_blank
                  </span>{" "}
                  - Type in the correct answer
                </li>
                <li>
                  •{" "}
                  <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded">
                    multiple_select
                  </span>{" "}
                  - Select multiple correct answers
                </li>
              </ul>
            </div>
            <h4 className="text-sm font-semibold">Creating via Dashboard:</h4>
            <p className="text-xs text-muted-foreground">
              Navigate to{" "}
              <span className="font-mono bg-muted/50 px-1 rounded">
                /quiz/create
              </span>{" "}
              to create your first quiz with our intuitive form builder
            </p>
          </div>
        </div>

        {/* Publishing & Sharing */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Publishing & Sharing</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Control who can access your quizzes with public, private, and
            invitation-only options
          </p>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Visibility Options:</h4>
            <CodeBlock
              code={`// Public: Anyone with the link can take the quiz
Published → Visibility: Public
Share link: https://qwizzed.io/quiz/quiz_123

// Private: Only invited users can access
Published → Visibility: Private
Send invitations via email from Dashboard

// Manage visibility in Dashboard:
1. Go to My Quizzes
2. Click on quiz settings
3. Toggle Published status
4. Set Visibility (Public/Private)`}
            />
          </div>
        </div>

        {/* Analytics & Results */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Analytics & Results</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Track quiz performance and analyze taker responses in real-time
          </p>
          <h4 className="text-sm font-semibold mb-2">Available Metrics:</h4>
          <CodeBlock
            code={`View Analytics:
1. Dashboard → Analytics
2. View all your quizzes with real-time stats
3. Click a quiz card for detailed breakdown

Available Metrics:
• Total Attempts - Number of times quiz was taken
• Unique Users - Number of different takers
• Average Score - Mean score across all attempts
• Highest Score - Best performance
• Lowest Score - Lowest performance
• Last Attempt - When quiz was last taken
• Completion Rate - Percentage of started quizzes finished`}
          />
        </div>
      </div>

      {/* Quiz Invitations */}
      <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Quiz Invitations</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Send personalized quiz invitations to specific users via email
        </p>
        <CodeBlock
          code={`Sending Invitations:
1. Navigate to your quiz in Dashboard
2. Click "Invite Users" or "Send Invitations"
3. Enter email addresses (multiple supported)
4. Add optional message
5. Click Send

Invitation Features:
• Automatic email delivery
• Personalized invitation links
• Expiration date tracking
• Acceptance status monitoring
• Re-send failed invitations

Check Status:
Dashboard → Quiz → Pending Invitations → View list`}
        />
      </div>

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
            code={`1. Go to your quiz in Dashboard
2. Click "Share" or "Export"
3. Select "Embed Code" option
4. Copy the iFrame code
5. Paste into your website HTML

Quick Embed Example:
<iframe
  src="https://qwizzed.io/embed/quiz_123"
  width="100%"
  height="600"
  style="border: none; border-radius: 8px;"
></iframe>`}
          />
        </div>

        {/* Customization */}
        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <h3 className="text-lg font-semibold">Customize Embedded Quiz</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add parameters to customize the embedded quiz appearance and
            behavior
          </p>
          <CodeBlock
            code={`<iframe
  src="https://qwizzed.io/embed/quiz_123?theme=dark&showHeader=true&showResults=true"
  width="100%"
  height="600"
  style="border: none; border-radius: 8px;"
></iframe>

Available Parameters:
• theme: 'light' | 'dark' | 'auto'
• showHeader: true | false (show quiz title)
• showResults: true | false (display score after)
• allowRetake: true | false (enable retaking)
• showProgress: true | false (progress bar)
• locale: 'en' | 'es' | 'fr' (language)`}
          />
        </div>
      </div>

      {/* List & Manage Quizzes */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">List & Manage Quizzes</h2>
          <p className="text-muted-foreground">
            View all your quizzes with detailed statistics and management
            options
          </p>
        </div>

        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Accessing Your Quiz List</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Navigate to your quiz management dashboard to view all created
            quizzes
          </p>
          <CodeBlock
            code={`How to Access Your Quizzes:
1. Go to /quiz/my-quizzes
2. View all your quizzes in a grid layout
3. Each card shows:
   - Quiz title and description
   - Status (Published/Draft)
   - Creation date
   - Question count
   - Quick actions (Edit, Delete, Share)

Available Features on My Quizzes:
✓ Search and filter quizzes by title/description
✓ Sort by creation date or name
✓ Responsive grid layout (1-3 columns)
✓ See quiz status at a glance
✓ Direct access to analytics for each quiz
✓ Bulk actions (coming soon)

Quick Stats Displayed:
• Total Attempts - How many times quiz was taken
• Unique Users - Number of different takers
• Average Score - Mean percentage across all attempts
• Highest/Lowest Score - Best/worst performance
• Last Attempt - Most recent submission time

Manage Individual Quizzes:
- Click quiz card to view details
- Use action buttons to Edit, Delete, or Share
- Access full analytics for detailed insights`}
          />
        </div>

        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <h3 className="text-lg font-semibold">
            Publishing & Sharing Quizzes
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Control quiz visibility and share with others
          </p>
          <CodeBlock
            code={`How to Publish a Quiz:
1. Go to /quiz/my-quizzes
2. Find your quiz and click Edit
3. Set status to "Published"
4. Choose visibility:
   - Public: Anyone with link can access
   - Private: Only invited users can access
5. Save changes

How to Share Your Quiz:
1. From My Quizzes, click Share button
2. Options available:
   a) Copy Link
      - Share direct URL: https://qwizzed.io/quiz/quiz_123
      - Short, memorable URLs
      - Automatic tracking enabled

   b) Email Sharing
      - Enter recipient email addresses
      - Add custom message (optional)
      - System sends invitation automatically

   c) Social Media
      - Copy pre-formatted message
      - Share on Twitter, LinkedIn, etc.

Share Settings:
• Link Expiration: Set optional expiration date
• Password Protection: Add password (optional)
• Usage Tracking: Monitor who accessed the link
• Download as Image: Share quiz thumbnail`}
          />
        </div>
      </div>

      {/* Viewing Public Quizzes */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Viewing Public Quizzes</h2>
          <p className="text-muted-foreground">
            Discover and take quizzes shared by the community
          </p>
        </div>

        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <h3 className="text-lg font-semibold">Browse Public Quizzes</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Find and take publicly available quizzes from other creators
          </p>
          <CodeBlock
            code={`How to Find Public Quizzes:
1. Navigate to /quiz/public
2. Browse all published public quizzes
3. Use search to filter by title or description
4. View quiz preview with:
   - Quiz title and description
   - Creator information
   - Total attempts and unique takers
   - Average score
   - Question count

Taking a Public Quiz:
1. Find quiz in the public library
2. Click on quiz card
3. Review quiz details and question count
4. Click "Take Quiz" to start
5. Answer all questions
6. View your score and results
7. Option to retake or share results

Features:
✓ No login required to view public quizzes
✓ Must be logged in to take a quiz
✓ Search across thousands of quizzes
✓ See creator info and quiz ratings
✓ Filter by difficulty level
✓ Sort by popularity or recency`}
          />
        </div>
      </div>

      {/* Quiz Components & Status */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Quiz Components & Status</h2>
          <p className="text-muted-foreground">
            Visual components and status indicators explained
          </p>
        </div>

        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <h3 className="text-lg font-semibold">
            Understanding Status Indicators
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Learn what each status badge and indicator means
          </p>
          <CodeBlock
            code={`Quiz Status Badges Explained:

1. Published Badge (Green checkmark)
   - Indicates quiz is live and publicly available
   - Appears when is_published: true
   - Means quiz can be taken by users

2. Draft Badge (Gray label)
   - Quiz is not yet published
   - Only you (creator) can see and edit
   - Use for quizzes still in development

3. Public Visibility (Globe icon)
   - Anyone with the link can access
   - No invitation required
   - Best for public quizzes
   - visibility setting: 'public'

4. Private Visibility (Lock icon)
   - Only invited users can access
   - Requires invitation to take
   - Better for sensitive or closed quizzes
   - visibility setting: 'private'

5. Active Status (Pulse animation)
   - Quiz is currently receiving submissions
   - Appears when total_attempts > 0
   - Shows quiz is being used

6. Empty State (Question mark)
   - Quiz created but no attempts yet
   - Shows encouragement message
   - Normal for newly created quizzes

How to Check Status:
1. View /quiz/my-quizzes
2. Look at status badges on each card
3. Icons show visibility and activity
4. Green badge = ready to share
5. Gray badge = needs to be published`}
          />
        </div>

        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <h3 className="text-lg font-semibold">Using Quiz Components</h3>
          <p className="text-sm text-muted-foreground mb-4">
            How to work with built-in UI components
          </p>
          <CodeBlock
            code={`Available UI Components:

1. Quiz Card Component
   - Displays quiz preview at a glance
   - Shows title, description, stats
   - Includes action buttons (Edit, Delete, Share)
   - Responsive and mobile-friendly
   - Used in: My Quizzes, Public Quizzes pages
   - Click to view full quiz details

2. Stats Panel Component
   - Shows real-time quiz metrics
   - Displays: Total Attempts, Unique Users
   - Shows: Average Score, High/Low Scores
   - Updates automatically
   - Used in: Analytics, Dashboard cards
   - Click "View Details" for breakdown

3. Progress Bar Component
   - Shows current question progress
   - Visual percentage indicator
   - Smooth animated transitions
   - Used during quiz taking
   - Updates as you answer questions

4. Timer Component
   - Displays countdown if time limit set
   - Color changes when time is low
   - Shows warnings at 5 and 1 minute
   - Used only for timed quizzes
   - Auto-submits if time expires

5. Result Card Component
   - Displays final score and percentage
   - Shows correct/incorrect count
   - Includes detailed breakdown
   - "Retake Quiz" button available
   - Share results on social media

6. Invitation Component
   - Email input field for sending invites
   - Message editor for custom text
   - Shows send status (pending, sent, failed)
   - Displays invitation history
   - Track acceptances in real-time

Using These Components:
- Components auto-load on relevant pages
- No configuration needed
- Responsive design works on all devices
- Accessible with keyboard navigation`}
          />
        </div>

        <div className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6">
          <h3 className="text-lg font-semibold">Managing Quiz Invitations</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Send and track quiz invitations
          </p>
          <CodeBlock
            code={`How to Send Quiz Invitations:
1. Go to /quiz/my-quizzes
2. Find your quiz and click "Invite" or "Send Invitations"
3. Enter email addresses:
   - One per line
   - Multiple emails supported
   - Validates email format automatically
4. (Optional) Add custom message:
   - Personalize the invitation
   - Include context about the quiz
   - Add deadline if applicable
5. Review and click "Send"
6. System sends emails automatically

Tracking Invitations:
1. Go to quiz settings/details
2. View "Pending Invitations" section
3. See status of each sent invitation:
   - Sent: Awaiting response
   - Accepted: User took the quiz
   - Expired: Invitation period ended
   - Failed: Invalid email or bounce

Invitation Features:
✓ Automatic email delivery via SMTP
✓ Personalized invitation links
✓ Expiration date tracking (configurable)
✓ Acceptance status monitoring
✓ Re-send failed invitations
✓ View response history
✓ Export invitation list

Best Practices:
- Send invitations before quiz deadline
- Include clear instructions in message
- Set appropriate expiration dates
- Follow up on non-responses
- Monitor acceptance rates`}
          />
        </div>
      </div>

      {/* Best Practices & Usage Guide */}
      <div className="space-y-4 rounded-lg border border-border/40 bg-card/50 p-6">
        <h2 className="text-2xl font-bold">Complete Usage Guide</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-primary font-bold">1</span>
            <span>
              <strong>Create Your Quiz:</strong> Navigate to /quiz/create and
              use the form builder to add questions. Choose from
              multiple_choice, true_false, fill_in_blank, or multiple_select
              question types.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">2</span>
            <span>
              <strong>Review and Edit:</strong> Go to /quiz/my-quizzes to see
              all your quizzes. Click any quiz to view, edit, or delete it. Save
              changes before publishing.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">3</span>
            <span>
              <strong>Publish Your Quiz:</strong> Set quiz status to "Published"
              and choose visibility (Public or Private). Public quizzes appear
              in /quiz/public directory.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">4</span>
            <span>
              <strong>Share with Others:</strong> Use the Share button on quiz
              cards to copy direct link, send via email, or share on social
              media. Each method provides tracking.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">5</span>
            <span>
              <strong>Send Invitations:</strong> For private quizzes, send email
              invitations to specific users. Track acceptance status in quiz
              settings.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">6</span>
            <span>
              <strong>Embed on Website:</strong> Export embed code from quiz
              settings. Use iFrame code on your website with optional
              customization parameters for theme and features.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">7</span>
            <span>
              <strong>Monitor Analytics:</strong> Go to /quiz/analytics to view
              real-time stats including total attempts, unique users, average
              scores, and detailed breakdowns.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">8</span>
            <span>
              <strong>Discover Public Quizzes:</strong> Visit /quiz/public to
              browse thousands of quizzes from other creators. Use search to
              find specific topics.
            </span>
          </li>
        </ul>
      </div>

      {/* Best Practices */}
      <div className="space-y-4 rounded-lg border border-border/40 bg-card/50 p-6">
        <h2 className="text-2xl font-bold">Best Practices</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Clear Questions:</strong> Write clear, unambiguous
              questions to ensure accurate results and good user experience
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Balanced Difficulty:</strong> Mix easy, medium, and hard
              questions for better assessment and engagement
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Time Limits:</strong> Set appropriate time limits to match
              quiz complexity and content depth
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Review Results:</strong> Regularly check analytics to
              improve quiz quality and identify weak questions
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Mobile Testing:</strong> Test quizzes on mobile devices
              before sharing to ensure responsive design works
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Category Tags:</strong> Use consistent categories for
              better organization and discoverability
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Publish Before Sharing:</strong> Ensure quiz is Published
              before sharing publicly or sending invitations
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Track Analytics:</strong> Monitor performance via
              /quiz/analytics to understand user engagement and scores
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Clear Descriptions:</strong> Write detailed quiz
              descriptions to help users understand content before taking
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>
              <strong>Correct Answers:</strong> Double-check that all correct
              answers are marked properly before publishing
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
