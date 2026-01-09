import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

// Custom hook for intersection observer animations
function useScrollAnimation(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once visible, stop observing (animation plays once)
          if (ref.current) observer.unobserve(ref.current)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px", ...options }
    )

    if (ref.current) observer.observe(ref.current)

    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])

  return [ref, isVisible]
}

// Animated section wrapper
function AnimatedSection({ children, className = "", delay = 0 }) {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
      }}
    >
      {children}
    </div>
  )
}

// Icons
const Icons = {
  Play: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Zap: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Download: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Gif: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  Camera: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Cloud: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Star: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
}

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-rose-400/10 blur-3xl" />
          <div className="absolute top-40 right-1/4 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <AnimatedSection className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-400/10 px-4 py-1.5 text-sm text-rose-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400"></span>
              </span>
              No downloads. No signups. Just record.
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Screen recording
              <br />
              <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
                made effortless
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Capture your screen with a beautiful webcam overlay, convert to GIF instantly, 
              and share anywhere—all from your browser. No installation required.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/app"
                className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30"
              >
                <Icons.Play />
                Start Recording Free
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/50 px-6 py-4 text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800"
              >
                See how it works
              </a>
            </div>
          </AnimatedSection>

          {/* Hero Visual */}
          <AnimatedSection delay={400} className="mt-16">
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-rose-500/20 blur-2xl" />
              <div className="relative rounded-3xl border border-slate-700/50 bg-slate-900/80 p-2 shadow-2xl backdrop-blur">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8">
                  <div className="flex h-full flex-col items-center justify-center">
                    {/* Mock recording interface */}
                    <div className="mb-6 flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full bg-rose-500 animate-pulse" />
                      <span className="font-mono text-2xl text-white">00:42</span>
                    </div>
                    <div className="text-slate-400">Your screen recording preview</div>
                    
                    {/* Mock webcam bubble */}
                    <div className="absolute bottom-12 right-12 h-24 w-24 rounded-2xl border-4 border-white bg-gradient-to-br from-slate-600 to-slate-700 shadow-xl" />
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Trust indicators */}
          <AnimatedSection delay={500} className="mt-16">
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
              <div className="flex items-center gap-2">
                <Icons.Shield />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.Zap />
                <span>Instant Export</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.Globe />
                <span>Works Everywhere</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-4 py-24 bg-slate-900/50">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Everything you need,
              <span className="text-rose-400"> nothing you don't</span>
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Simple, powerful, and completely free. No tricks.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Icons.Camera />,
                title: "Webcam Overlay",
                description: "Add your face to recordings with a beautiful, customizable picture-in-picture overlay.",
                color: "rose",
              },
              {
                icon: <Icons.Gif />,
                title: "GIF Export",
                description: "Convert recordings to high-quality GIFs instantly. Perfect for demos, tutorials, and sharing.",
                color: "amber",
                highlight: true,
              },
              {
                icon: <Icons.Download />,
                title: "Multiple Formats",
                description: "Download as WebM, MP4, or GIF. Whatever works best for your workflow.",
                color: "rose",
              },
              {
                icon: <Icons.Shield />,
                title: "100% Private",
                description: "Everything processes in your browser. Your recordings never touch our servers.",
                color: "amber",
              },
              {
                icon: <Icons.Zap />,
                title: "No Installation",
                description: "Works directly in Chrome, Edge, and other modern browsers. Just open and record.",
                color: "rose",
              },
              {
                icon: <Icons.Cloud />,
                title: "Cloud Backup (Coming soon)",
                description: "Optionally save to Google Drive with one click. Your recordings, your choice.",
                color: "amber",
              },
            ].map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 100}>
                <div
                  className={`group relative h-full rounded-2xl border p-6 transition-all hover:scale-[1.02] ${
                    feature.highlight
                      ? "border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-rose-500/10"
                      : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50"
                  }`}
                >
                  {feature.highlight && (
                    <div className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-3 py-1 text-xs font-semibold text-white">
                      Popular
                    </div>
                  )}
                  <div
                    className={`inline-flex rounded-xl p-3 ${
                      feature.color === "rose"
                        ? "bg-rose-500/10 text-rose-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-slate-400">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Three steps to
              <span className="text-amber-400"> perfect recordings</span>
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              From idea to shareable content in under a minute
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Share Your Screen",
                description: "Click one button and choose what to record—full screen, window, or tab.",
                color: "from-rose-500 to-rose-600",
              },
              {
                step: "02",
                title: "Record & Customize",
                description: "Add your webcam, adjust position and size, then hit record. Switch tabs freely.",
                color: "from-amber-500 to-amber-600",
              },
              {
                step: "03",
                title: "Export & Share",
                description: "Download as MP4 or convert to GIF instantly. Share anywhere in seconds.",
                color: "from-rose-500 to-amber-500",
              },
            ].map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 150}>
                <div className="relative">
                  <div
                    className={`absolute -left-4 -top-4 text-8xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-20`}
                  >
                    {step.step}
                  </div>
                  <div className="relative rounded-2xl border border-slate-700/50 bg-slate-800/30 p-8">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-lg font-bold text-white`}
                    >
                      {step.step}
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-3 text-slate-400">{step.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* GIF Feature Highlight */}
      <section className="relative px-4 py-24 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
                <Icons.Gif />
                Instant GIF Conversion
              </div>
              <h2 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
                Turn recordings into
                <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                  {" "}shareable GIFs
                </span>
              </h2>
              <p className="mt-6 text-lg text-slate-300">
                Perfect for bug reports, quick demos, Slack messages, documentation, 
                and anywhere you need a visual that just works.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "High-quality color optimization",
                  "Automatic size reduction",
                  "Works on any platform",
                  "No file size limits",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                      <Icons.Check />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                to="/app"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-amber-500/25"
              >
                Try GIF Export
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 blur-2xl" />
                <div className="relative rounded-3xl border border-amber-500/20 bg-slate-900 p-6">
                  {/* Mock GIF export UI */}
                  <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
                    <div className="text-center text-white font-medium mb-4">Save Your Recording</div>
                    <div className="grid grid-cols-3 gap-3">
                      {["WebM", "MP4", "GIF"].map((format) => (
                        <div
                          key={format}
                          className={`rounded-xl p-4 text-center transition-all ${
                            format === "GIF"
                              ? "border-2 border-amber-500 bg-amber-500/10 ring-4 ring-amber-500/20"
                              : "border border-slate-600 bg-slate-700/50"
                          }`}
                        >
                          <div className={`text-lg font-bold ${format === "GIF" ? "text-amber-400" : "text-slate-300"}`}>
                            {format}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {format === "WebM" && "Fast"}
                            {format === "MP4" && "Universal"}
                            {format === "GIF" && "Animated"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 text-amber-400">
                    <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-sm">Converting to GIF...</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Loved by creators
              <span className="text-rose-400"> everywhere</span>
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "Finally, a screen recorder that just works. No downloads, no accounts, no hassle. The GIF export is incredible!",
                name: "Sarah Chen",
                role: "Product Designer",
              },
              {
                quote: "I use this daily for bug reports. Being able to quickly record and export as GIF has saved me hours every week.",
                name: "Marcus Rodriguez",
                role: "Software Engineer",
              },
              {
                quote: "The webcam overlay looks so professional. My tutorial videos have never looked better, and it's completely free!",
                name: "Emily Thompson",
                role: "Content Creator",
              },
            ].map((testimonial, i) => (
              <AnimatedSection key={testimonial.name} delay={i * 100}>
                <div className="h-full rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Icons.Star key={i} />
                    ))}
                  </div>
                  <p className="mt-4 text-slate-300">"{testimonial.quote}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-400 to-amber-400" />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-4 py-24">
        <AnimatedSection>
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 via-slate-900 to-amber-500/10 p-12 text-center">
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
              
              <div className="relative">
                <h2 className="text-4xl font-bold text-white sm:text-5xl">
                  Ready to create something
                  <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
                    {" "}amazing?
                  </span>
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
                  Join thousands of creators who are already making beautiful screen recordings. 
                  No signup required—just click and record.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    to="/app"
                    className="flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100"
                  >
                    <Icons.Play />
                    Start Recording Now
                  </Link>
                </div>
                <p className="mt-6 text-sm text-slate-400">
                  Free forever • No account needed • Works in your browser
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}