const TITLE = "bruillion";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 pt-10">
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
    </main>
  );
}
