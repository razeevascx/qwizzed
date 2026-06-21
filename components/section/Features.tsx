import Layout from "../layout/Layout";

const LightningFastSVG = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 200 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full max-h-36 object-contain"
  >
    <defs>
      <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="fireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
      <filter id="glowSpeed">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Speed lines */}
    <line x1="20" y1="30" x2="50" y2="30" stroke="#374151" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
    <line x1="10" y1="60" x2="40" y2="60" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
    <line x1="25" y1="90" x2="55" y2="90" stroke="#374151" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
    
    {/* Flame */}
    <path
      d="M75,60 C60,55 50,60 40,60 C50,65 60,65 75,60 Z"
      fill="url(#fireGrad)"
      filter="url(#glowSpeed)"
      className="animate-pulse"
    />
    
    {/* Rocket body */}
    <path
      d="M140,60 C140,50 110,42 80,45 L70,35 L75,48 C65,52 65,68 75,72 L70,85 L80,75 C110,78 140,70 140,60 Z"
      fill="url(#rocketGrad)"
    />
    {/* Rocket nose */}
    <path
      d="M120,49 C132,52 140,60 140,60 C140,60 132,68 120,71 Z"
      fill="#ef4444"
    />
    {/* Rocket window */}
    <circle cx="105" cy="60" r="5" fill="#e0f2fe" stroke="#1d4ed8" strokeWidth="2" />
    
    {/* Speed clouds */}
    <circle cx="50" cy="85" r="8" fill="#1f2937" opacity="0.4" />
    <circle cx="65" cy="90" r="5" fill="#1f2937" opacity="0.3" />
  </svg>
);

const EasySharingSVG = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 200 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full max-h-36 object-contain"
  >
    <defs>
      <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>
    </defs>
    
    {/* Laptop/Browser Mockup */}
    <rect x="25" y="45" width="65" height="42" rx="3" fill="#1f2937" stroke="#374151" strokeWidth="2" />
    <rect x="20" y="87" width="75" height="4" rx="1.5" fill="#374151" />
    {/* Browser Content mock */}
    <line x1="32" y1="55" x2="52" y2="55" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />
    <line x1="32" y1="65" x2="70" y2="65" stroke="#4b5563" strokeWidth="2" />
    <line x1="32" y1="72" x2="60" y2="72" stroke="#4b5563" strokeWidth="2" />
    
    {/* Phone Mockup */}
    <rect x="135" y="25" width="36" height="68" rx="6" fill="url(#phoneGrad)" stroke="#4f46e5" strokeWidth="2" />
    <rect x="148" y="29" width="10" height="2" rx="1" fill="#1e1b4b" />
    <circle cx="153" cy="87" r="3" fill="#1e1b4b" />
    {/* Phone screen content */}
    <rect x="140" y="36" width="26" height="45" rx="2" fill="#111827" />
    
    {/* Link Bubble / Message flying from browser to phone */}
    <g className="animate-bounce">
      <path
        d="M80,38 C80,31.3 86.7,26 95,26 C103.3,26 110,31.3 110,38 C110,44.7 103.3,50 95,50 C91.7,50 88.5,48.7 86,46.5 L78,48 L80,41.5 C80,40.3 80,39.1 80,38 Z"
        fill="url(#bubbleGrad)"
      />
      {/* Link Icon inside bubble */}
      <path
        d="M91,38 A2,2 0 0,1 95,36 H97 A2,2 0 0,1 97,40 H95 M99,38 A2,2 0 0,1 95,40 H93 A2,2 0 0,1 93,36 H95"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
    
    {/* Arrow connecting */}
    <path
      d="M93,60 C108,60 118,52 126,45"
      stroke="#6366f1"
      strokeWidth="2"
      strokeDasharray="4 4"
      strokeLinecap="round"
    />
    <path d="M123,43 L127,44 L126,48" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AnalyticsSVG = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 200 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full max-h-36 object-contain"
  >
    <defs>
      <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="accentBar" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    
    {/* Stats Dashboard Window */}
    <rect x="25" y="25" width="150" height="78" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="2" />
    
    {/* Window Header */}
    <rect x="25" y="25" width="150" height="18" rx="8" fill="#111827" />
    <circle cx="37" cy="34" r="3" fill="#ef4444" />
    <circle cx="47" cy="34" r="3" fill="#f59e0b" />
    <circle cx="57" cy="34" r="3" fill="#10b981" />
    <text x="75" y="38" fill="#9ca3af" fontSize="8" fontWeight="bold" fontFamily="monospace">STATS.LIVE</text>
    
    {/* Bar Charts */}
    <rect x="42" y="75" width="14" height="20" rx="2" fill="url(#barGrad)" />
    <rect x="62" y="60" width="14" height="35" rx="2" fill="url(#barGrad)" />
    <rect x="82" y="50" width="14" height="45" rx="2" fill="url(#accentBar)" className="animate-pulse" />
    
    {/* Live indicator */}
    <circle cx="150" cy="55" r="4" fill="#ef4444" className="animate-ping" />
    <circle cx="150" cy="55" r="3" fill="#ef4444" />
    <text x="110" y="58" fill="#e5e7eb" fontSize="9" fontWeight="bold" fontFamily="sans-serif">94% Score</text>
    
    {/* Score Badge */}
    <rect x="110" y="68" width="48" height="22" rx="4" fill="#111827" stroke="#10b981" strokeWidth="1.5" />
    <text x="116" y="82" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="sans-serif">A+ Score</text>
  </svg>
);

const SecureSVG = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 200 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full max-h-36 object-contain"
  >
    <defs>
      <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="shieldLine" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <filter id="glowLock">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Protective Shield */}
    <path
      d="M100,20 C125,20 145,15 145,15 C145,15 148,60 140,85 C130,110 100,118 100,118 C100,118 70,110 60,85 C52,60 55,15 55,15 C55,15 75,20 100,20 Z"
      fill="url(#shieldBg)"
      stroke="url(#shieldLine)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    
    {/* Document sheet mockup inside shield (private data) */}
    <rect x="85" y="45" width="30" height="40" rx="2" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
    <line x1="90" y1="52" x2="110" y2="52" stroke="#4b5563" strokeWidth="2" />
    <line x1="90" y1="60" x2="105" y2="60" stroke="#4b5563" strokeWidth="2" />
    <line x1="90" y1="68" x2="100" y2="68" stroke="#4b5563" strokeWidth="2" />
    
    {/* Floating Padlock overlay */}
    <g filter="url(#glowLock)" className="animate-pulse">
      <rect x="90" y="65" width="20" height="15" rx="3" fill="#f59e0b" />
      <path
        d="M94,65 V58 C94,54.7 96.7,52 100,52 C103.3,52 106,54.7 106,58 V65"
        stroke="#f59e0b"
        strokeWidth="2.5"
        fill="none"
      />
      <circle cx="100" cy="71" r="1.5" fill="#1e1b4b" />
      <path d="M99.5,72 L100.5,72 L101.5,77 L98.5,77 Z" fill="#1e1b4b" />
    </g>
    
    {/* Floating secure checkmarks */}
    <circle cx="140" cy="45" r="8" fill="#10b981" />
    <path d="M137,45 L139,47 L143,43" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const features = [
  {
    number: "01",
    title: "Lightning Fast",
    description:
      "Create and deploy quizzes in seconds with our intuitive interface. No complicated setup or lengthy tutorials required to get started.",
    svg: LightningFastSVG,
  },
  {
    number: "02",
    title: "Easy Sharing",
    description:
      "Share via link, QR code, or embed anywhere instantly. Your audience can join from any device without downloading apps or creating accounts.",
    svg: EasySharingSVG,
  },
  {
    number: "03",
    title: "Real-time Analytics",
    description:
      "Track performance and get actionable insights as responses come in. Identify trends, knowledge gaps, and make data-driven decisions instantly.",
    svg: AnalyticsSVG,
  },
  {
    number: "04",
    title: "Secure & Private",
    description:
      "Enterprise-grade security with end-to-end encryption. Your data is protected with industry-leading security protocols and compliance standards.",
    svg: SecureSVG,
  },
];

export default function Features() {
  return (
    <section className="border-t border-border/30 py-24 bg-background relative overflow-hidden">
      <Layout className="relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-bold tracking-wider text-primary uppercase">
            Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Designed for Seamless Interaction
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Empower your team, students, or audiences with a quiz platform built for speed, accessibility, and insights.
          </p>
        </div>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, idx) => {
            const SvgComponent = feature.svg;
            return (
              <div
                key={idx}
                className="group relative flex flex-col rounded-3xl border border-border/40 bg-card/25 backdrop-blur-md overflow-hidden hover:border-primary/40 hover:bg-card/45 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
              >
                {/* Visual SVG Top Container */}
                <div className="h-48 w-full relative flex items-center justify-center bg-gradient-to-b from-muted/20 to-transparent overflow-hidden border-b border-border/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary),transparent_60%)] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                  <SvgComponent />
                </div>

                {/* Bottom Content */}
                <div className="p-8 flex-1 flex flex-col space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-primary tracking-widest bg-primary/10 px-2.5 py-1 rounded-md">
                      {feature.number}
                    </span>
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Layout>
    </section>
  );
}
