import { PROMPTS, matchAnswer, pointsFor, seedCounts } from "@/lib/prompts";

// Prototype store: in-memory, per server process. Swap for a DB/KV later.
const g = globalThis as unknown as { __counts?: Map<string, Map<string, number>> };
const store = (g.__counts ??= new Map());

function countsFor(date: string, promptId: string) {
  const key = `${date}:${promptId}`;
  let m = store.get(key);
  if (!m) {
    const prompt = PROMPTS.find((p) => p.id === promptId)!;
    m = seedCounts(prompt);
    store.set(key, m);
  }
  return m;
}

export async function POST(req: Request) {
  const { date, promptId, answer } = (await req.json()) as {
    date: string;
    promptId: string;
    answer: string;
  };
  const prompt = PROMPTS.find((p) => p.id === promptId);
  if (!prompt || !/^\d{4}-\d{2}-\d{2}$/.test(date))
    return Response.json({ error: "bad request" }, { status: 400 });

  const counts = countsFor(date, promptId);
  const canonical = matchAnswer(prompt, answer ?? "");
  if (canonical) counts.set(canonical, (counts.get(canonical) ?? 0) + 1);

  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  const count = canonical ? counts.get(canonical)! : 0;
  const share = count / total;
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([a, c]) => ({ answer: a, share: c / total }));

  return Response.json({
    valid: !!canonical,
    canonical,
    share,
    points: canonical ? pointsFor(share) : 0,
    total,
    top,
  });
}
