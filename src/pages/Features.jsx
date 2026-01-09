export default function Features() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Features</h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        NoWorries helps you record high-quality walkthroughs with a face cam overlay and brand elements.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[
          ["Screen + webcam recording", "Capture your display and overlay your camera feed."],
          ["Webcam shapes", "Circle, rounded rectangle, squircle, and rounded diamond masks."],
          ["Brand overlay", "Place a logo/brand mark on top of the recording."],
          ["Download or save", "Export locally or upload to Google Drive."],
        ].map(([title, desc]) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="text-sm font-semibold">{title}</div>
            <div className="mt-1 text-sm text-slate-300">{desc}</div>
          </div>
        ))}
      </div>

      {/* <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300 backdrop-blur">
        Tip: For Google Drive uploads, set `VITE_GOOGLE_CLIENT_ID` and allow the Drive scope `https://www.googleapis.com/auth/drive.file`.
      </div> */}
    </div>
  )
}