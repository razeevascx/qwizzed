import Layout from "../layout/Layout";

const CreateQuizStepSVG = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 240 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full max-h-40 object-contain"
  >
    <defs>
      <linearGradient id="step1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    
    {/* Creator Form Card */}
    <rect x="20" y="15" width="200" height="110" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="2" />
    
    {/* Header bar */}
    <path d="M20,23 C20,18.5 24.5,15 29,15 L211,15 C215.5,15 220,18.5 220,23 L220,35 L20,35 Z" fill="#111827" />
    <circle cx="32" cy="25" r="3" fill="#ef4444" />
    <circle cx="42" cy="25" r="3" fill="#f59e0b" />
    <circle cx="52" cy="25" r="3" fill="#10b981" />
    
    {/* Question Box */}
    <rect x="35" y="45" width="170" height="22" rx="4" fill="#111827" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="45" y="59" fill="#9ca3af" fontSize="9" fontWeight="bold">Q: What is the capital of France?</text>
    
    {/* Option 1 (Incorrect) */}
    <rect x="35" y="75" width="80" height="18" rx="4" fill="#111827" stroke="#374151" strokeWidth="1.5" />
    <circle cx="45" cy="84" r="4" fill="#374151" />
    <text x="56" y="87" fill="#6b7280" fontSize="8">London</text>
    
    {/* Option 2 (Correct/Selected) */}
    <rect x="125" y="75" width="80" height="18" rx="4" fill="#1e1b4b" stroke="#10b981" strokeWidth="1.5" />
    <circle cx="135" cy="84" r="4" fill="#10b981" />
    <text x="146" y="87" fill="#10b981" fontSize="8" fontWeight="bold">Paris</text>
    
    {/* Add Question Button */}
    <rect x="95" y="102" width="50" height="14" rx="3" fill="#3b82f6" />
    <text x="104" y="112" fill="#ffffff" fontSize="7" fontWeight="bold">+ Add Question</text>
  </svg>
);

const ShareQuizStepSVG = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 240 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full max-h-40 object-contain"
  >
    <defs>
      <linearGradient id="qrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    
    {/* Share Dialog Panel */}
    <rect x="20" y="20" width="120" height="85" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="2" />
    <text x="32" y="38" fill="#e5e7eb" fontSize="10" fontWeight="bold">Share Quiz</text>
    
    {/* Link Box */}
    <rect x="32" y="48" width="96" height="18" rx="4" fill="#111827" stroke="#4b5563" />
    <text x="38" y="60" fill="#6b7280" fontSize="7">qwizzed.com/q/7438...</text>
    <rect x="100" y="52" width="22" height="10" rx="2" fill="#a855f7" />
    <text x="104" y="60" fill="#ffffff" fontSize="6" fontWeight="bold">Copy</text>
    
    {/* Copied alert */}
    <g className="animate-bounce">
      <rect x="45" y="73" width="70" height="16" rx="4" fill="#ec4899" />
      <text x="52" y="84" fill="#ffffff" fontSize="7" fontWeight="bold">Copied to Clipboard!</text>
    </g>
    
    {/* Mobile phone displaying QR Code scan */}
    <rect x="165" y="15" width="46" height="90" rx="8" fill="#111827" stroke="#374151" strokeWidth="2" />
    <rect x="170" y="22" width="36" height="65" rx="4" fill="#1f2937" />
    
    {/* QR Code symbol mock */}
    <rect x="176" y="32" width="24" height="24" fill="url(#qrGrad)" rx="2" />
    <rect x="180" y="36" width="6" height="6" fill="#111827" />
    <rect x="190" y="36" width="6" height="6" fill="#111827" />
    <rect x="180" y="46" width="6" height="6" fill="#111827" />
    <rect x="192" y="48" width="4" height="4" fill="#ffffff" />
    <rect x="182" y="40" width="2" height="2" fill="#ffffff" />
    <rect x="192" y="40" width="2" height="2" fill="#ffffff" />
    <rect x="182" y="48" width="2" height="2" fill="#ffffff" />
    
    {/* Success check bubble */}
    <circle cx="188" cy="74" r="7" fill="#10b981" />
    <path d="M185,74 L187,76 L191,72" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AnalyzeResultsStepSVG = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 240 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full max-h-40 object-contain"
  >
    <defs>
      <linearGradient id="chartLine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    
    {/* Dashboard Main Panel */}
    <rect x="20" y="15" width="200" height="110" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="2" />
    
    {/* Header */}
    <text x="32" y="32" fill="#e5e7eb" fontSize="10" fontWeight="bold">Analytics Dashboard</text>
    
    {/* Stats Boxes */}
    <rect x="32" y="42" width="50" height="26" rx="4" fill="#111827" stroke="#374151" />
    <text x="38" y="52" fill="#9ca3af" fontSize="6">Avg. Score</text>
    <text x="38" y="64" fill="#10b981" fontSize="10" fontWeight="bold">87.5%</text>
    
    <rect x="90" y="42" width="50" height="26" rx="4" fill="#111827" stroke="#374151" />
    <text x="96" y="52" fill="#9ca3af" fontSize="6">Completed</text>
    <text x="96" y="64" fill="#3b82f6" fontSize="10" fontWeight="bold">42 Users</text>
    
    <rect x="148" y="42" width="58" height="26" rx="4" fill="#111827" stroke="#374151" />
    <text x="154" y="52" fill="#9ca3af" fontSize="6">Time Limit</text>
    <text x="154" y="64" fill="#f59e0b" fontSize="10" fontWeight="bold">2m 45s</text>
    
    {/* Line graph mockup */}
    <rect x="32" y="78" width="174" height="38" rx="4" fill="#111827" stroke="#374151" />
    <line x1="32" y1="97" x2="206" y2="97" stroke="#1f2937" strokeWidth="1" />
    <line x1="32" y1="87" x2="206" y2="87" stroke="#1f2937" strokeWidth="1" />
    <path
      d="M40,110 Q55,85 70,95 T100,82 T130,105 T160,80 T190,88"
      stroke="url(#chartLine)"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="160" cy="80" r="3" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" className="animate-ping" />
  </svg>
);

const stepsData = [
  {
    step: "01",
    title: "Create your quiz",
    desc: "Use our easy-to-use form builder to add questions, set custom limits, configure options, and finalize details.",
    svg: CreateQuizStepSVG,
  },
  {
    step: "02",
    title: "Share with your audience",
    desc: "Send a unique direct link, scan the instant QR code, or embed anywhere. Your audience joins on any device without account creation.",
    svg: ShareQuizStepSVG,
  },
  {
    step: "03",
    title: "Analyze results",
    desc: "Get instant insights on submission timelines, score percentages, and individual breakdowns to evaluate performance efficiently.",
    svg: AnalyzeResultsStepSVG,
  },
];

export default function Steps() {
  return (
    <section className="border-t border-border/30 py-24 bg-muted/20 relative overflow-hidden">
      <Layout>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-bold tracking-wider text-primary uppercase">
            Workflow
          </div>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            How it works
          </h3>
          <p className="text-muted-foreground text-lg max-w-xl">
            Launch engaging interactive quizzes in three simple, streamlined steps.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative max-w-5xl mx-auto space-y-20 lg:space-y-32">
          {/* Vertical central connector line */}
          <div className="absolute left-[29px] lg:left-1/2 top-8 bottom-8 border-l-2 border-dashed border-border/60 -translate-x-1/2 pointer-events-none" />

          {stepsData.map((item, idx) => {
            const SvgComponent = item.svg;
            const isEven = idx % 2 === 0;
            return (
              <div key={idx} className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-16">
                {/* Timeline node */}
                <div className="absolute left-[29px] lg:left-1/2 top-4 w-6 h-6 rounded-full border-4 border-background bg-primary -translate-x-1/2 z-10 shadow-md shadow-primary/20" />

                {/* Text Block */}
                <div className={`w-full lg:w-1/2 flex ${isEven ? 'lg:justify-end' : 'lg:justify-start lg:order-2'}`}>
                  <div className="pl-16 lg:pl-0 max-w-md space-y-3">
                    <span className="text-xs font-mono font-bold text-primary tracking-widest bg-primary/10 px-2.5 py-1 rounded-md">
                      Step {item.step}
                    </span>
                    <h4 className="text-2xl font-bold tracking-tight">{item.title}</h4>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Illustration Card Block */}
                <div className={`w-full lg:w-1/2 pl-16 lg:pl-0 flex ${isEven ? 'lg:justify-start lg:order-2' : 'lg:justify-end'}`}>
                  <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card/25 backdrop-blur-md p-6 hover:border-primary/40 hover:bg-card/45 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                    <SvgComponent />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Layout>
    </section>
  );
}
