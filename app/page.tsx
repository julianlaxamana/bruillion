import Clouds from "./clouds";
import Ground from "./ground";
import Scenery from "./scenery";

const TITLE = "bruillion";

// How much ground shows before scrolling: tufts + grass + the soil layer.
const VISIBLE_GROUND = 176;

export default function Home() {
  return (
    <main className="relative flex h-svh flex-col overflow-hidden">
      <header
        className="relative flex shrink-0 flex-col items-center px-4 pt-24"
        style={{ height: `max(28rem, calc(100svh - ${VISIBLE_GROUND}px))` }}
      >
        <Clouds />
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
          <span className="whitespace-nowrap">25 seconds each ·</span>{" "}
          <span className="whitespace-nowrap">rarer answers dig deeper</span>
        </p>
        <Scenery />
      </header>
      <Ground />
      {/* Bobbing wrapper so the button's own hover/press transforms still work. */}
      <div className="absolute inset-x-0 bottom-10 flex justify-center motion-safe:animate-bob">
        <button
          type="button"
          className="font-pixel border-4 border-[#f5c542] bg-[#1f5fae] px-14 pt-1 sm:px-20 pb-2 text-3xl text-[#f5c542] uppercase shadow-[4px_4px_0_#2a1a12] transition-transform hover:-translate-y-0.5 hover:bg-[#2a6fc4] active:translate-x-1 active:translate-y-1 active:shadow-none sm:text-4xl"
        >
          ↓ begin descent ↓
        </button>
      </div>
    </main>
  );
}
