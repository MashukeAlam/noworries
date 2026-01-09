import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    requestDriveToken,
    uploadToDriveResumable,
} from "../lib/googleDrive.js";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Icons as components
const Icons = {
    Monitor: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Camera: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    ),
    CameraOff: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
    ),
    Play: () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
        </svg>
    ),
    Stop: () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h12v12H6z" />
        </svg>
    ),
    Download: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    ),
    Cloud: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
    ),
    Settings: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    X: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    Film: () => (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
    ),
    Gif: () => (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Check: () => (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    ArrowLeft: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    ),
    Sparkles: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    ),
};

const CORNER_POSITIONS = {
    topLeft: { label: "Top Left", icon: "↖" },
    topRight: { label: "Top Right", icon: "↗" },
    bottomLeft: { label: "Bottom Left", icon: "↙" },
    bottomRight: { label: "Bottom Right", icon: "↘" },
};

function pickMimeType() {
    const types = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
    ];
    for (const t of types) {
        if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return "";
}

// Download Modal Component
function DownloadModal({ isOpen, onClose, onDownload, isConverting, conversionProgress }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={() => !isConverting && onClose()}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-lg rounded-3xl border border-slate-700/50 bg-slate-900 p-8 shadow-2xl">
                <button
                    onClick={onClose}
                    disabled={isConverting}
                    className="absolute right-6 top-6 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50"
                >
                    <Icons.X />
                </button>

                <div className="text-center mb-8">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-rose-400 mb-4">
                        <Icons.Download />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Save Your Recording</h2>
                    <p className="mt-2 text-slate-400">Choose your preferred format</p>
                </div>

                {isConverting ? (
                    <div className="py-12 text-center">
                        <div className="relative inline-flex">
                            <div className="h-16 w-16 rounded-full border-4 border-slate-700"></div>
                            <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
                        </div>
                        <p className="mt-6 text-lg font-medium text-white">{conversionProgress}</p>
                        <p className="mt-2 text-sm text-slate-400">This may take a moment...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { format: "webm", label: "WebM", desc: "Fast • Small", color: "slate", icon: <Icons.Film /> },
                            { format: "mp4", label: "MP4", desc: "Universal", color: "blue", icon: <Icons.Film /> },
                            { format: "gif", label: "GIF", desc: "Animated", color: "amber", popular: true, icon: <Icons.Gif /> },
                        ].map((item) => (
                            <button
                                key={item.format}
                                onClick={() => onDownload(item.format)}
                                className={`group relative flex flex-col items-center gap-4 rounded-2xl border p-6 transition-all hover:scale-[1.02] ${
                                    item.popular
                                        ? "border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-rose-500/10 hover:border-amber-500/50"
                                        : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600"
                                }`}
                            >
                                {item.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-3 py-1 text-xs font-semibold text-white">
                                        Popular
                                    </div>
                                )}
                                <div className={`rounded-xl p-3 ${
                                    item.popular 
                                        ? "bg-amber-500/20 text-amber-400" 
                                        : "bg-slate-700/50 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300"
                                }`}>
                                    {item.icon}
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold text-white">{item.label}</div>
                                    <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Recorder() {
    const recordingCanvasRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const screenVideoRef = useRef(null);
    const camVideoRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const screenStreamRef = useRef(null);
    const camStreamRef = useRef(null);
    const renderIntervalRef = useRef(null);
    const previewAnimationRef = useRef(null);
    const timerRef = useRef(null);
    const ffmpegRef = useRef(new FFmpeg());

    const webcamCornerRef = useRef("bottomRight");
    const webcamScaleRef = useRef(0.25);
    const webcamEnabledRef = useRef(true);

    const [status, setStatus] = useState("Ready");
    const [error, setError] = useState("");
    const [isCapturing, setIsCapturing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [elapsedMs, setElapsedMs] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

    const [webcamEnabled, setWebcamEnabled] = useState(true);
    const [webcamCorner, setWebcamCorner] = useState("bottomRight");
    const [webcamScale, setWebcamScale] = useState(0.25);
    const [showSettings, setShowSettings] = useState(false);

    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [conversionProgress, setConversionProgress] = useState("");

    const [driveToken, setDriveToken] = useState("");
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const [isSigningIn, setIsSigningIn] = useState(false);

    useEffect(() => { webcamCornerRef.current = webcamCorner; }, [webcamCorner]);
    useEffect(() => { webcamScaleRef.current = webcamScale; }, [webcamScale]);
    useEffect(() => { webcamEnabledRef.current = webcamEnabled; }, [webcamEnabled]);

    useEffect(() => {
        loadFFmpeg();
        return () => { stopAll(); };
    }, []);

    async function loadFFmpeg() {
        try {
            const ffmpeg = ffmpegRef.current;
            const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            });
            setFfmpegLoaded(true);
        } catch (e) {
            setError("Could not load video processor. Please refresh the page.");
        }
    }

    function stopTracks(stream) {
        if (!stream) return;
        for (const t of stream.getTracks()) t.stop();
    }

    function stopAll() {
        if (recorderRef.current && recorderRef.current.state !== "inactive") {
            try { recorderRef.current.stop(); } catch {}
        }
        recorderRef.current = null;
        stopTracks(screenStreamRef.current);
        stopTracks(camStreamRef.current);
        screenStreamRef.current = null;
        camStreamRef.current = null;
        if (renderIntervalRef.current) { clearInterval(renderIntervalRef.current); renderIntervalRef.current = null; }
        if (previewAnimationRef.current) { cancelAnimationFrame(previewAnimationRef.current); previewAnimationRef.current = null; }
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        setIsCapturing(false);
        setIsRecording(false);
        setStatus("Ready");
    }

    function drawFrameToCanvas(canvas, isRecordingCanvas = false) {
        const screenVideo = screenVideoRef.current;
        const camVideo = camVideoRef.current;
        if (!canvas || !screenVideo || screenVideo.readyState < 2) return false;

        const ctx = canvas.getContext("2d");
        const W = screenVideo.videoWidth || 1920;
        const H = screenVideo.videoHeight || 1080;

        if (canvas.width !== W || canvas.height !== H) {
            canvas.width = W;
            canvas.height = H;
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, W, H);
        ctx.drawImage(screenVideo, 0, 0, W, H);

        const enabled = isRecordingCanvas ? webcamEnabledRef.current : webcamEnabled;
        const corner = isRecordingCanvas ? webcamCornerRef.current : webcamCorner;
        const scale = isRecordingCanvas ? webcamScaleRef.current : webcamScale;

        if (enabled && camVideo && camVideo.readyState >= 2 && camStreamRef.current) {
            const camW = Math.round(W * scale);
            const camH = Math.round(camW * (camVideo.videoHeight / camVideo.videoWidth || 0.75));
            const padding = Math.round(Math.min(W, H) * 0.025);
            const borderWidth = 4;

            let x, y;
            switch (corner) {
                case "topLeft": x = padding; y = padding; break;
                case "topRight": x = W - camW - padding; y = padding; break;
                case "bottomLeft": x = padding; y = H - camH - padding; break;
                default: x = W - camW - padding; y = H - camH - padding;
            }

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x - borderWidth, y - borderWidth, camW + borderWidth * 2, camH + borderWidth * 2, 16);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.beginPath();
            ctx.roundRect(x, y, camW, camH, 12);
            ctx.clip();
            ctx.translate(x + camW, y);
            ctx.scale(-1, 1);
            ctx.drawImage(camVideo, 0, 0, camW, camH);
            ctx.restore();
        }
        return true;
    }

    function startPreviewLoop() {
        function loop() {
            drawFrameToCanvas(previewCanvasRef.current, false);
            previewAnimationRef.current = requestAnimationFrame(loop);
        }
        loop();
    }

    function startRecordingRenderLoop(fps = 30) {
        const interval = 1000 / fps;
        renderIntervalRef.current = setInterval(() => {
            drawFrameToCanvas(recordingCanvasRef.current, true);
        }, interval);
    }

    function stopRecordingRenderLoop() {
        if (renderIntervalRef.current) { clearInterval(renderIntervalRef.current); renderIntervalRef.current = null; }
    }

    async function startCapture() {
        setError("");
        setRecordedBlob(null);
        setElapsedMs(0);

        try {
            setStatus("Setting up...");
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { displaySurface: "monitor", frameRate: { ideal: 30, max: 60 } },
                audio: true,
            });

            let camStream = null;
            if (webcamEnabled) {
                try {
                    camStream = await navigator.mediaDevices.getUserMedia({
                        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
                        audio: false,
                    });
                } catch (e) { console.warn("Webcam access failed:", e); }
            }

            screenStreamRef.current = screenStream;
            camStreamRef.current = camStream;

            const screenVideo = screenVideoRef.current;
            const camVideo = camVideoRef.current;

            screenVideo.srcObject = screenStream;
            screenVideo.muted = true;
            await screenVideo.play();

            if (camStream && camVideo) {
                camVideo.srcObject = camStream;
                camVideo.muted = true;
                await camVideo.play();
            }

            startPreviewLoop();
            setIsCapturing(true);
            setStatus("Ready to record");
        } catch (e) {
            setError(e?.message || "Could not access screen");
            setStatus("Ready");
            stopAll();
        }
    }

    function startRecording() {
        setError("");
        setRecordedBlob(null);
        setElapsedMs(0);

        const screenStream = screenStreamRef.current;
        if (!screenStream) { setError("Please start screen capture first"); return; }

        try {
            const fps = 30;
            const recordingCanvas = recordingCanvasRef.current;
            const screenVideo = screenVideoRef.current;
            recordingCanvas.width = screenVideo.videoWidth || 1920;
            recordingCanvas.height = screenVideo.videoHeight || 1080;

            startRecordingRenderLoop(fps);
            const canvasStream = recordingCanvas.captureStream(fps);
            const audioTracks = screenStream.getAudioTracks();
            audioTracks.forEach(track => { canvasStream.addTrack(track.clone()); });

            const mimeType = pickMimeType();
            const recorder = new MediaRecorder(canvasStream, mimeType ? { mimeType } : undefined);
            chunksRef.current = [];
            recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" });
                setRecordedBlob(blob);
                setStatus("Recording saved!");
            };

            recorderRef.current = recorder;
            recorder.start(1000);
            setIsRecording(true);
            setStatus("Recording...");

            const start = Date.now();
            timerRef.current = setInterval(() => { setElapsedMs(Date.now() - start); }, 100);
        } catch (e) {
            setError(e?.message || "Could not start recording");
            stopRecordingRenderLoop();
        }
    }

    function stopRecording() {
        try {
            if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
            stopRecordingRenderLoop();
            const recorder = recorderRef.current;
            if (recorder && recorder.state === "recording") {
                setStatus("Finishing up...");
                try { recorder.requestData?.(); } catch {}
                recorder.stop();
            }
            setIsRecording(false);
            setTimeout(() => {
                if (previewAnimationRef.current) { cancelAnimationFrame(previewAnimationRef.current); previewAnimationRef.current = null; }
                stopTracks(screenStreamRef.current);
                stopTracks(camStreamRef.current);
                screenStreamRef.current = null;
                camStreamRef.current = null;
                setIsCapturing(false);
            }, 200);
        } catch (e) { setError(e?.message || "Error stopping recording"); }
    }

    async function handleDownload(format) {
        if (!recordedBlob) return;
        if (format === "webm") { downloadBlob(recordedBlob, "webm"); setShowDownloadModal(false); return; }
        if (!ffmpegLoaded) { setError("Video processor not ready."); return; }

        setIsConverting(true);
        setConversionProgress("Preparing...");

        try {
            const ffmpeg = ffmpegRef.current;
            await ffmpeg.writeFile("input.webm", await fetchFile(recordedBlob));

            if (format === "mp4") {
                setConversionProgress("Converting to MP4...");
                await ffmpeg.exec(["-i", "input.webm", "-c:v", "libx264", "-preset", "fast", "-crf", "23", "-c:a", "aac", "-b:a", "128k", "output.mp4"]);
                const data = await ffmpeg.readFile("output.mp4");
                downloadBlob(new Blob([data], { type: "video/mp4" }), "mp4");
                await ffmpeg.deleteFile("output.mp4").catch(() => {});
            } else if (format === "gif") {
                setConversionProgress("Creating palette...");
                await ffmpeg.exec(["-i", "input.webm", "-vf", "fps=10,scale=640:-1:flags=lanczos,palettegen", "-y", "palette.png"]);
                setConversionProgress("Generating GIF...");
                await ffmpeg.exec(["-i", "input.webm", "-i", "palette.png", "-lavfi", "fps=10,scale=640:-1:flags=lanczos[x];[x][1:v]paletteuse", "-y", "output.gif"]);
                const data = await ffmpeg.readFile("output.gif");
                downloadBlob(new Blob([data], { type: "image/gif" }), "gif");
                await ffmpeg.deleteFile("palette.png").catch(() => {});
                await ffmpeg.deleteFile("output.gif").catch(() => {});
            }
            await ffmpeg.deleteFile("input.webm").catch(() => {});
            setShowDownloadModal(false);
        } catch (e) {
            setError("Conversion failed: " + (e?.message || String(e)));
        } finally {
            setIsConverting(false);
            setConversionProgress("");
        }
    }

    function downloadBlob(blob, extension) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `recording-${new Date().toISOString().replace(/[:.]/g, "-")}.${extension}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
    }

    async function signInGoogle() {
        setError("");
        setIsSigningIn(true);
        try {
            const token = await requestDriveToken({ clientId });
            if (token) { setDriveToken(token); setStatus("Connected to Google Drive!"); }
            else throw new Error("No access token received");
        } catch (e) {
            console.error("Google sign-in error:", e);
            setError(e?.message || "Could not sign in");
        } finally { setIsSigningIn(false); }
    }

    async function saveToDrive() {
        setError("");
        if (!recordedBlob) return setError("Record something first.");
        if (!driveToken) return setError("Please sign in with Google first.");
        try {
            setStatus("Uploading to Drive...");
            const fileName = `recording-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.webm`;
            const res = await uploadToDriveResumable({ accessToken: driveToken, fileName, mimeType: recordedBlob.type || "video/webm", blob: recordedBlob });
            setStatus(res?.id ? "Saved to Google Drive!" : "Uploaded successfully!");
        } catch (e) {
            setError(e?.message || "Upload failed");
            setStatus("Recording saved!");
        }
    }

    const elapsed = useMemo(() => {
        const s = Math.floor(elapsedMs / 1000);
        const mm = String(Math.floor(s / 60)).padStart(2, "0");
        const ss = String(s % 60).padStart(2, "0");
        return `${mm}:${ss}`;
    }, [elapsedMs]);

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Background gradients */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/3 h-96 w-[40rem] rounded-full bg-rose-500/10 blur-[100px]" />
                <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-amber-500/5 blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <Link to="/" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                        <Icons.ArrowLeft />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-amber-500">
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold">NoWorries</span>
                    </div>

                    <div className="w-32" /> {/* Spacer for centering */}
                </div>
            </header>

            <main className="relative mx-auto max-w-5xl px-4 py-8">
                {/* Loading indicator */}
                {!ffmpegLoaded && (
                    <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-6 py-4">
                        <div className="h-5 w-5 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
                        <span className="text-amber-200">Loading video tools...</span>
                    </div>
                )}

                {/* Preview Area */}
                <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-rose-500/20 blur-xl opacity-50" />
                    
                    <div className="relative rounded-3xl border border-slate-700/50 bg-slate-900/90 backdrop-blur overflow-hidden shadow-2xl">
                        {/* Video container */}
                        <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
                            <canvas
                                ref={previewCanvasRef}
                                className="w-full h-full object-contain"
                                style={{ display: isCapturing ? "block" : "none" }}
                            />
                            <canvas ref={recordingCanvasRef} className="hidden" />

                            {/* Empty state */}
                            {!isCapturing && !recordedBlob && (
                                <div className="text-center p-8">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-500/10 to-amber-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6 text-rose-400">
                                        <Icons.Monitor />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Ready to Record</h3>
                                    <p className="text-slate-400 max-w-sm mx-auto">
                                        Click the button below to share your screen and start recording
                                    </p>
                                </div>
                            )}

                            {/* Success state */}
                            {!isCapturing && recordedBlob && (
                                <div className="text-center p-8">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 text-emerald-400">
                                        <Icons.Check />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Recording Complete!</h3>
                                    <p className="text-slate-400 max-w-sm mx-auto">
                                        Your recording is ready. Download it or save to the cloud.
                                    </p>
                                </div>
                            )}

                            {/* Recording overlay */}
                            {isRecording && (
                                <>
                                    <div className="absolute top-6 left-6 flex items-center gap-3 rounded-2xl bg-slate-900/90 border border-rose-500/30 px-5 py-3 backdrop-blur">
                                        <span className="relative flex h-3 w-3">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75"></span>
                                            <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500"></span>
                                        </span>
                                        <span className="font-mono text-lg font-bold text-white">{elapsed}</span>
                                    </div>
                                    
                                    <div className="absolute top-6 right-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 backdrop-blur">
                                        <span className="text-emerald-300 text-sm font-medium flex items-center gap-2">
                                            <Icons.Sparkles />
                                            Tab-safe
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Hidden video elements */}
                        <video ref={screenVideoRef} className="hidden" playsInline muted />
                        <video ref={camVideoRef} className="hidden" playsInline muted />
                    </div>
                </div>

                {/* Controls */}
                <div className="mt-8 flex flex-col items-center gap-6">
                    {/* Main button */}
                    {!isCapturing && !isRecording ? (
                        <button
                            onClick={startCapture}
                            disabled={!ffmpegLoaded}
                            className="group flex items-center gap-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 px-10 py-5 text-xl font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icons.Monitor />
                            Share Screen
                        </button>
                    ) : !isRecording ? (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={stopAll}
                                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-4 text-slate-300 transition-all hover:bg-slate-800"
                            >
                                <Icons.X />
                                Cancel
                            </button>
                            <button
                                onClick={startRecording}
                                className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-10 py-5 text-xl font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30"
                            >
                                <Icons.Play />
                                Start Recording
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 px-10 py-5 text-xl font-semibold text-white shadow-lg shadow-rose-500/25 animate-pulse transition-all hover:shadow-xl"
                        >
                            <Icons.Stop />
                            Stop Recording
                        </button>
                    )}

                    {/* Timer display when recording */}
                    {isRecording && (
                        <div className="font-mono text-5xl font-bold text-white tracking-wider">
                            {elapsed}
                        </div>
                    )}

                    {/* Secondary controls */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {/* Camera toggle */}
                        <button
                            onClick={() => setWebcamEnabled(!webcamEnabled)}
                            disabled={isCapturing || isRecording}
                            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all disabled:opacity-50 ${
                                webcamEnabled
                                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"
                                    : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                            }`}
                        >
                            {webcamEnabled ? <Icons.Camera /> : <Icons.CameraOff />}
                            {webcamEnabled ? "Camera On" : "Camera Off"}
                        </button>

                        {/* Settings */}
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            disabled={isCapturing || isRecording}
                            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all disabled:opacity-50 ${
                                showSettings
                                    ? "bg-slate-700 text-white border border-slate-600"
                                    : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                            }`}
                        >
                            <Icons.Settings />
                            Settings
                        </button>

                        {/* Download */}
                        <button
                            onClick={() => setShowDownloadModal(true)}
                            disabled={!recordedBlob}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-rose-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                        >
                            <Icons.Download />
                            Download
                        </button>

                        {/* Google Drive */}
                        {/* <button
                            onClick={driveToken ? saveToDrive : signInGoogle}
                            disabled={isSigningIn || (driveToken && !recordedBlob)}
                            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all disabled:opacity-40 ${
                                driveToken
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                            }`}
                        >
                            {isSigningIn ? (
                                <>
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-400/30 border-t-slate-400 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <Icons.Cloud />
                                    {driveToken ? "Save to Drive" : "Google Drive"}
                                </>
                            )}
                        </button> */}
                    </div>

                    {/* Settings panel */}
                    {showSettings && (
                        <div className="w-full max-w-lg rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur">
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <Icons.Camera />
                                Camera Settings
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm text-slate-400 mb-3 block">Position</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(CORNER_POSITIONS).map(([value, { label, icon }]) => (
                                            <button
                                                key={value}
                                                onClick={() => setWebcamCorner(value)}
                                                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                                                    webcamCorner === value
                                                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                                        : "bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700"
                                                }`}
                                            >
                                                <span className="text-lg">{icon}</span>
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm text-slate-400">Camera Size</label>
                                        <span className="text-sm font-medium text-rose-300">{Math.round(webcamScale * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.15"
                                        max="0.4"
                                        step="0.01"
                                        value={webcamScale}
                                        onChange={(e) => setWebcamScale(Number(e.target.value))}
                                        className="w-full h-2 rounded-full appearance-none bg-slate-700 accent-rose-500 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="w-full max-w-lg rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-rose-200 flex items-start gap-3">
                            <Icons.X />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Status message */}
                    {status !== "Ready" && !isRecording && !error && (
                        <p className="text-slate-400">{status}</p>
                    )}
                </div>
            </main>

            <DownloadModal
                isOpen={showDownloadModal}
                onClose={() => !isConverting && setShowDownloadModal(false)}
                onDownload={handleDownload}
                isConverting={isConverting}
                conversionProgress={conversionProgress}
            />
        </div>
    );
}