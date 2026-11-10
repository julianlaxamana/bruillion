"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Bear from "./bear";
import { dailyPrompts, ROUNDS, SECONDS_PER_ROUND, type Prompt } from "@/lib/prompts";

type Result = {
  prompt: string;
  guess: string;
  valid: boolean;
  canonical: string | null;
  share: number;
  points: number; // meters dug
  top: { answer: string; share: number }[];
};

type Phase = "landing" | "playing" | "reveal" | "done";

const TITLE = "bruillion";
const M_TO_PX = 0.8; // screen pixels per meter dug (7 perfect digs ≈ 560px)
const pct = (n: number) => (n < 0.01 ? `${(n * 100).toFixed(1)}%` : `${Math.round(n * 100)}%`);

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadSaved(date: string): Result[] | null {
  try {
    const raw = localStorage.getItem(`bruillion:${date}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function tile(r: Result) {
  if (!r.valid) return "⬛";
  if (r.points >= 80) return "🟪";
  if (r.points >= 55) return "🟦";
  if (r.points >= 30) return "🟩";
  return "🟨";
}

// Shared pixel styles
const panel =
  "font-pixel w-full max-w-md border-4 border-[#f5c542] bg-[#1f5fae]/95 p-5 text-white shadow-[6px_6px_0_#2a1a12]";
const pixelBtn =
  "font-pixel border-4 border-[#f5c542] bg-[#1f5fae] text-[#f5c542] uppercase shadow-[4px_4px_0_#2a1a12] transition-transform hover:-translate-y-0.5 hover:bg-[#2a6fc4] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50";

export default function DigApp({
  sky,
  scenery,
  ground,
}: {
  sky: React.ReactNode;
  scenery: React.ReactNode;
  ground: React.ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>("landing");
  const [date, setDate] = useState("");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [round, setRound] = useState(0);
  const [guess, setGuess] = useState("");
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_ROUND);
  const [results, setResults] = useState<Result[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const deadline = useRef(0);
  const guessRef = useRef("");

  const depth = results.reduce((a, r) => a + r.points, 0);
  const last = results[results.length - 1];

  function startRound(r: number) {
    deadline.current = Date.now() + SECONDS_PER_ROUND * 1000;
    setTimeLeft(SECONDS_PER_ROUND);
    setGuess("");
    guessRef.current = "";
    setRound(r);
    setPhase("playing");
  }

  // Begin Descent: today's prompts, or straight to results if already played.
  function begin() {
    const d = today();
    setDate(d);
    setPrompts(dailyPrompts(d));
    const saved = loadSaved(d);
    if (saved) {
      setResults(saved);
      setPhase("done");
    } else {
      setResults([]);
      startRound(0);
    }
  }

  const submit = useCallback(
    async (answer: string) => {
      if (submitting) return;
      setSubmitting(true);
      const prompt = prompts[round];
      try {
        const res = await fetch("/api/answer", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ date, promptId: prompt.id, answer }),
        }).then((r) => r.json());
        const result: Result = { prompt: prompt.text, guess: answer, ...res };
        setResults((rs) => {
          const next = [...rs, result];
          if (next.length === ROUNDS) {
            try {
              localStorage.setItem(`bruillion:${date}`, JSON.stringify(next));
            } catch {}
          }
          return next;
        });
        setPhase("reveal");
      } finally {
        setSubmitting(false);
      }
    },
    [date, prompts, round, submitting],
  );

  const submitRef = useRef(submit);
  useEffect(() => {
    submitRef.current = submit;
  });

  // Round timer: submits whatever is typed when time runs out.
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      const left = Math.max(0, (deadline.current - Date.now()) / 1000);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(id);
        submitRef.current(guessRef.current);
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase, round]);

  function next() {
    if (round + 1 >= ROUNDS) setPhase("done");
    else startRound(round + 1);
  }

  // Enter advances from the reveal screen.
  useEffect(() => {
    if (phase !== "reveal") return;
    const onKey = (e: KeyboardEvent) => e.key === "Enter" && next();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  async function share() {
    const text = `bruillion · the daily dig ${date}\n${results.map(tile).join("")}\ndug ${depth}m`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  const inGame = phase !== "landing";

  // World geometry (CSS expressions). Grass top is 12px into the ground tile.
  const grassY = "(var(--hh) + 12px)";
  const bearX = "max(1rem, calc(50% - 440px))";
  const dug = inGame ? Math.round(depth * M_TO_PX) : 0;

  return (
    <main
      className="relative h-svh overflow-clip"
      style={
        {
          // Sky height (ground starts below it) and the bear's width; shared by world and camera math.
          "--hh": "max(28rem, calc(100svh - 176px))",
          "--bw": "min(120px, 22vw)",
        } as React.CSSProperties
      }
    >
      {/* The world: sky, campus, ground, tunnel and bear. Moves up as the bear digs (the "camera"). */}
      <div
        className="absolute inset-x-0 top-0 -z-20 transition-transform duration-[1400ms] ease-in-out motion-reduce:transition-none"
        // Keep the bear's feet around 3/4 of the way down the screen; no camera move on the landing screen.
        style={{
          transform: inGame
            ? `translateY(calc(-1 * max(0px, ${grassY} + ${dug}px + var(--bw) * 0.6 - 75svh)))`
            : "none",
        }}
      >
        <div className="relative" style={{ height: "var(--hh)" }}>
          {sky}
          {scenery}
        </div>
        {ground}

        {/* Tunnel from the grass down to the bear. */}
        {inGame && (
          <div
            aria-hidden
            className="absolute border-x-4 border-[#3a2416] bg-[#1f120b] transition-[height] duration-[1400ms] ease-in-out motion-reduce:transition-none"
            style={{
              left: `calc(${bearX} + var(--bw) * 0.15)`,
              width: "calc(var(--bw) * 0.7)",
              top: `calc(${grassY} - 2px)`,
              height: `calc(${dug}px + var(--bw) * 0.1 + 4px)`,
            }}
          />
        )}

        {/* The bear: stands on the grass, flips head-down to burrow once the dig starts. */}
        <div
          className="absolute transition-[top,transform] duration-[1400ms] ease-in-out motion-reduce:transition-none"
          style={{
            left: bearX,
            width: "var(--bw)",
            top: inGame
              ? `calc(${grassY} + ${dug}px + var(--bw) * 0.6 - var(--bw) * 0.8)`
              : `calc(${grassY} - var(--bw) * 0.6)`,
            transform: inGame ? "rotate(90deg)" : "none",
          }}
        >
          {/* Re-keyed on every dig so the shake animation replays. */}
          <div key={`${inGame}-${depth}`} className={inGame ? "motion-safe:animate-[dig_0.1s_steps(2)_14]" : ""}>
            <Bear />
          </div>
        </div>
      </div>

      {/* Fixed UI over the world. */}
      <div className={`flex flex-col items-center px-4 ${inGame ? "pt-16 sm:pt-20" : "pt-24"}`}>

        {phase === "landing" && (
          <>
            <h1
              aria-label={TITLE}
              className="font-pixel text-7xl text-white [text-shadow:-0.035em_-0.02em_0_#25f4ee,0.035em_0.02em_0_#fe2c55] sm:text-9xl"
            >
              {[...TITLE].map((ch, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="inline-block motion-safe:animate-wave"
                  style={{ animationDelay: `${i * 0.18}s` }}
                >
                  {ch}
                </span>
              ))}
            </h1>
            <p className="font-pixel mt-1 text-2xl tracking-[0.2em] text-white uppercase [text-shadow:2px_2px_0_#0b2545] sm:text-4xl">
              the daily dig
            </p>
            {/* Each phrase stays whole; on narrow screens the line breaks between them. */}
            <p className="font-pixel mt-2 text-center text-lg text-balance text-white/90 [text-shadow:1px_1px_0_#0b2545] sm:text-2xl">
              <span className="whitespace-nowrap">7 prompts ·</span>{" "}
              <span className="whitespace-nowrap">{SECONDS_PER_ROUND} seconds each ·</span>{" "}
              <span className="whitespace-nowrap">rarer answers dig deeper</span>
            </p>
          </>
        )}

        {phase === "playing" && prompts[round] && (
          <section className={panel}>
            <div className="flex justify-between text-xl text-[#f5c542]">
              <span>
                dig {round + 1}/{ROUNDS}
              </span>
              <span>{Math.ceil(timeLeft)}s</span>
            </div>
            {/* Timer as a row of pixel blocks */}
            <div className="mt-2 flex gap-1" aria-hidden>
              {Array.from({ length: SECONDS_PER_ROUND }, (_, i) => (
                <div
                  key={i}
                  className={`h-3 flex-1 ${i < Math.ceil(timeLeft) ? (timeLeft <= 5 ? "bg-[#fe2c55]" : "bg-[#f5c542]") : "bg-white/15"}`}
                />
              ))}
            </div>
            <h2 className="mt-4 text-4xl leading-none">{prompts[round].text}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (guess.trim()) submit(guess);
              }}
              className="mt-4 flex gap-2"
            >
              <input
                autoFocus
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value);
                  guessRef.current = e.target.value;
                }}
                disabled={submitting}
                placeholder="your rarest answer…"
                autoComplete="off"
                className="h-12 min-w-0 flex-1 border-4 border-[#0b2545] bg-white px-3 text-2xl text-[#0b2545] outline-none placeholder:text-[#0b2545]/40 focus:border-[#f5c542]"
              />
              <button disabled={submitting || !guess.trim()} className={`${pixelBtn} h-12 px-4 text-2xl`}>
                dig
              </button>
            </form>
          </section>
        )}

        {phase === "reveal" && last && (
          <section className={panel}>
            <div className="text-xl text-[#f5c542]">
              dig {round + 1}/{ROUNDS} · {last.prompt}
            </div>
            {last.valid ? (
              <>
                <div className="mt-1 text-6xl leading-none text-[#f5c542]">+{last.points}m</div>
                <p className="mt-1 text-2xl">
                  {last.canonical} — {pct(last.share)} of bears said this
                </p>
              </>
            ) : (
              <>
                <div className="mt-1 text-6xl leading-none text-white/50">+0m</div>
                <p className="mt-1 text-2xl">
                  {last.guess.trim() ? <>&ldquo;{last.guess}&rdquo; hit solid rock</> : "time ran out"}
                </p>
              </>
            )}
            <ul className="mt-3 space-y-1 text-xl">
              {last.top.slice(0, 3).map((t) => (
                <li key={t.answer} className="relative bg-white/10 px-2">
                  <div
                    className={`absolute inset-y-0 left-0 ${t.answer === last.canonical ? "bg-[#f5c542]/40" : "bg-white/15"}`}
                    style={{ width: `${t.share * 100}%` }}
                  />
                  <div className="relative flex justify-between">
                    <span>{t.answer}</span>
                    <span>{pct(t.share)}</span>
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={next} className={`${pixelBtn} mt-4 w-full py-1 text-2xl`}>
              {round + 1 >= ROUNDS ? "see how deep ↓" : "keep digging ↓"}
            </button>
          </section>
        )}

        {phase === "done" && (
          <section className={panel}>
            <div className="text-xl text-[#f5c542]">today&apos;s dig · {date}</div>
            <div className="text-6xl leading-none">{depth}m deep</div>
            <div className="mt-1 text-2xl tracking-widest">{results.map(tile).join("")}</div>
            <ul className="mt-2 text-xl leading-tight">
              {results.map((r, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span className="truncate">
                    {r.valid ? r.canonical : <span className="text-white/50 line-through">{r.guess || "—"}</span>}
                  </span>
                  <span className="text-[#f5c542]">{r.points}m</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <button onClick={share} className={`${pixelBtn} flex-1 py-1 text-2xl`}>
                {copied ? "copied!" : "share"}
              </button>
              <button onClick={() => setPhase("landing")} className={`${pixelBtn} px-4 py-1 text-2xl`}>
                back
              </button>
            </div>
            <p className="mt-2 text-center text-lg text-white/70">new prompts tomorrow</p>
          </section>
        )}

      </div>

      {/* Bottom: the start button on the landing screen, a depth meter while digging. */}
      <div className="absolute inset-x-0 bottom-10 flex justify-center">
        {phase === "landing" ? (
          // Bobbing wrapper so the button's own hover/press transforms still work.
          <div className="motion-safe:animate-bob">
            <button type="button" onClick={begin} className={`${pixelBtn} px-14 pt-1 pb-2 text-3xl sm:px-20 sm:text-4xl`}>
              ↓ begin descent ↓
            </button>
          </div>
        ) : (
          <div className="font-pixel bg-[#2a1a12]/70 px-4 text-3xl text-[#f5c542]">depth {depth}m</div>
        )}
      </div>
    </main>
  );
}
