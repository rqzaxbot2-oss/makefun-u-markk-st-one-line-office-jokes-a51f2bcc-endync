export interface OfficeJoke {
  readonly id: string;
  readonly topic: string;
  readonly line: string;
  readonly setupAnchor: string;
  readonly punchlineTail: string;
}

export interface CraftFeatures {
  readonly wordCount: number;
  readonly charCount: number;
  readonly singleLine: boolean;
  readonly brevity: number;
  readonly specificity: number;
  readonly latePunch: number;
  readonly contrastPivot: number;
  readonly rhythm: number;
  readonly composite: number;
}

export interface PairwiseResult {
  readonly leftId: string;
  readonly rightId: string;
  readonly winnerId: string;
  readonly loserId: string;
  readonly margin: number;
  readonly edgeCriteria: readonly string[];
}

export interface RankedJoke {
  readonly rank: number;
  readonly joke: OfficeJoke;
  readonly craft: CraftFeatures;
  readonly wins: number;
  readonly losses: number;
  readonly winRate: number;
  readonly avgMargin: number;
  readonly rating: number;
}

export interface TournamentReport {
  readonly totalJokes: number;
  readonly totalMatches: number;
  readonly winner: RankedJoke;
  readonly topFive: readonly RankedJoke[];
  readonly rankings: readonly RankedJoke[];
  readonly matches: readonly PairwiseResult[];
}

export const OFFICE_JOKES: readonly OfficeJoke[] = [
  {
    id: "review-felony",
    topic: "performance-review",
    line: "My manager gave me 'Exceeds Expectations' in every category and a 2 percent raise, which apparently means they expected a felony.",
    setupAnchor: "Exceeds Expectations and a 2 percent raise",
    punchlineTail: "means they expected a felony",
  },
  {
    id: "printer-cyan",
    topic: "printer-jam",
    line: "Our office printer refuses to print in black and white because it is out of cyan, which is also how leadership explains my raise.",
    setupAnchor: "printer out of cyan for black and white",
    punchlineTail: "how leadership explains my raise",
  },
  {
    id: "quick-sync-doctor",
    topic: "calendar-invite",
    line: "A calendar invite titled 'Quick 15-Minute Sync' with no agenda is the corporate equivalent of a doctor closing the exam-room door.",
    setupAnchor: "Quick 15-Minute Sync with no agenda",
    punchlineTail: "closing the exam-room door",
  },
  {
    id: "reply-all-paygrades",
    topic: "reply-all",
    line: "I never truly understood the company org chart until one intern hit Reply All and the apologies climbed six pay grades.",
    setupAnchor: "one intern hit Reply All",
    punchlineTail: "apologies climbed six pay grades",
  },
  {
    id: "linda-excel-2014",
    topic: "spreadsheet",
    line: "Our billion-dollar company runs on cloud infrastructure, AI roadmaps, and one unnamed Excel tab maintained by Linda since 2014.",
    setupAnchor: "cloud infrastructure and AI roadmaps",
    punchlineTail: "maintained by Linda since 2014",
  },
  {
    id: "monday-premeeting",
    topic: "monday-meeting",
    line: "Nothing says 'we value your time' like a Monday 8:30 a.m. sync scheduled to plan the agenda for Tuesday's pre-meeting.",
    setupAnchor: "Monday 8:30 a.m. sync",
    punchlineTail: "agenda for Tuesday's pre-meeting",
  },
  {
    id: "teams-ambitious",
    topic: "remote-status",
    line: "Half my career has been actual deliverables and the other half has been wiggling my mouse so Teams thinks I'm ambitious.",
    setupAnchor: "wiggling my mouse on Teams",
    punchlineTail: "so Teams thinks I'm ambitious",
  },
  {
    id: "open-plan-headphones",
    topic: "open-office",
    line: "In an open-plan office, wearing giant noise-canceling headphones is the universal sign for 'please tap my shoulder to ask about lunch.'",
    setupAnchor: "giant noise-canceling headphones",
    punchlineTail: "tap my shoulder to ask about lunch",
  },
  {
    id: "slack-hey-bomb",
    topic: "slack-ping",
    line: "A Slack message that just says 'hey' followed by three typing dots is the closest modern workers come to defusing a bomb.",
    setupAnchor: "Slack 'hey' and three typing dots",
    punchlineTail: "come to defusing a bomb",
  },
  {
    id: "fridge-maritime-law",
    topic: "breakroom",
    line: "The office refrigerator operates under maritime law: anything unlabeled past Thursday belongs to whoever forgot their lunch.",
    setupAnchor: "office refrigerator unlabeled past Thursday",
    punchlineTail: "belongs to whoever forgot their lunch",
  },
  {
    id: "family-money",
    topic: "company-culture",
    line: "When a company says 'we're like a family,' they mean unpaid overtime and awkward silence when you bring up money.",
    setupAnchor: "company says we're like a family",
    punchlineTail: "awkward silence when you bring up money",
  },
  {
    id: "offline-bury",
    topic: "corporate-jargon",
    line: "'Let's take this offline' is executive speak for 'we are about to bury your good idea where the meeting notes can't find it.'",
    setupAnchor: "Let's take this offline",
    punchlineTail: "where the meeting notes can't find it",
  },
  {
    id: "zoom-surrender",
    topic: "video-call",
    line: "Working from home taught me that 'business casual' means a pressed button-down above the desk and complete surrender below it.",
    setupAnchor: "pressed button-down above the desk",
    punchlineTail: "complete surrender below it",
  },
  {
    id: "password-sticky-note",
    topic: "it-security",
    line: "IT forces a new 16-character password every quarter, so our security posture now depends entirely on a sticky note under my keyboard.",
    setupAnchor: "16-character password every quarter",
    punchlineTail: "sticky note under my keyboard",
  },
  {
    id: "pizza-postage-stamps",
    topic: "all-hands",
    line: "Nothing boosts morale after record quarterly profits quite like three lukewarm cheese pizzas cut into squares the size of postage stamps.",
    setupAnchor: "record quarterly profits and lukewarm pizza",
    punchlineTail: "squares the size of postage stamps",
  },
  {
    id: "ghost-conference-rooms",
    topic: "conference-room",
    line: "Every conference room is booked solid all day by recurring meetings whose original organizers left the company in 2022.",
    setupAnchor: "recurring conference room bookings",
    punchlineTail: "left the company in 2022",
  },
  {
    id: "pto-not-urgent",
    topic: "out-of-office",
    line: "Nothing makes you feel truly indispensable like taking one Friday off and returning Monday to 147 emails marked 'not urgent.'",
    setupAnchor: "taking one Friday off",
    punchlineTail: "147 emails marked 'not urgent'",
  },
  {
    id: "per-my-last-email",
    topic: "email-diplomacy",
    line: "My favorite part of corporate diplomacy is typing 'just circling back' when I actually mean 'the deadline was in bold.'",
    setupAnchor: "typing just circling back",
    punchlineTail: "the deadline was in bold",
  },
];

const OFFICE_CONCRETE_TERMS = new Set<string>([
  "monday", "tuesday", "thursday", "friday", "printer", "cyan", "toner",
  "calendar", "agenda", "sync", "intern", "reply", "org", "chart", "excel",
  "slack", "teams", "zoom", "mouse", "headphones", "refrigerator", "lunch",
  "overtime", "offline", "notes", "password", "keyboard", "sticky", "pizzas",
  "conference", "recurring", "emails", "deadline", "bold", "raise", "manager",
  "deliverables", "quarterly", "profits", "meeting", "meetings", "typing",
  "dots", "desk", "button-down", "cloud", "roadmaps", "linda", "2014", "2022",
]);

const PIVOT_MARKERS = [
  " which ", " until ", " because ", " when ", " so ", " yet ", " and the ",
  " means ", " is the ", " is executive ", " belongs to ", " followed by ",
  ": ", "—", " whose ", " quite like ",
];

const PUNCH_WORDS = new Set<string>([
  "felony", "raise", "door", "grades", "2014", "pre-meeting", "ambitious",
  "lunch", "bomb", "money", "surrender", "keyboard", "stamps", "2022",
  "urgent", "bold", "cyan", "maritime", "unpaid", "bury", "lukewarm",
  "defusing", "apologies", "sticky", "doctor", "postage", "silence",
]);

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function tokenize(line: string): string[] {
  return line
    .toLowerCase()
    .replace(/[^a-z0-9'-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

export function evaluateJokeCraft(input: OfficeJoke | string): CraftFeatures {
  const line = typeof input === "string" ? input : input.line;
  const trimmed = line.trim();
  const singleLine = trimmed.length > 0 && !/[\r\n]/.test(trimmed);
  const words = tokenize(trimmed);
  const wordCount = words.length;
  const charCount = trimmed.length;

  // Ideal one-liner sits around 18-24 words and <= 140 chars.
  const wordPenalty = Math.abs(wordCount - 21) * 1.85;
  const charPenalty = charCount > 142 ? (charCount - 142) * 0.45 : 0;
  const brevity = round2(clamp(100 - wordPenalty - charPenalty, 30, 100));

  // Concrete workplace anchors and exact numbers/times/names.
  let concreteHits = 0;
  for (const w of words) {
    const clean = w.replace(/^'+|'+$/g, "");
    if (OFFICE_CONCRETE_TERMS.has(clean)) {
      concreteHits += 1;
    }
  }
  const numericHits = (trimmed.match(/\b\d+(?::\d+)?\b/g) ?? []).length;
  const quotedHits = (trimmed.match(/'[^']+'/g) ?? []).length;
  const specificity = round2(
    clamp(48 + concreteHits * 7.5 + numericHits * 6.5 + quotedHits * 4, 25, 100),
  );

  // Late-loaded punchline: strong image or twist in the final 5 words.
  const tail = words.slice(-5).map((w) => w.replace(/^'+|'+$/g, ""));
  let tailPunchHits = 0;
  for (const w of tail) {
    if (PUNCH_WORDS.has(w)) {
      tailPunchHits += 1;
    }
  }
  const lastWord = tail[tail.length - 1] ?? "";
  const strongTerminal =
    PUNCH_WORDS.has(lastWord) || /\d{4}/.test(lastWord) || lastWord.length >= 6;
  const latePunch = round2(
    clamp(55 + tailPunchHits * 15 + (strongTerminal ? 12 : 0), 30, 100),
  );

  // Structural pivot placing turn around 55%-78% through the line.
  const lower = ` ${trimmed.toLowerCase()} `;
  let bestPivotRatio = 0;
  for (const marker of PIVOT_MARKERS) {
    const idx = lower.lastIndexOf(marker);
    if (idx > 0) {
      const ratio = idx / lower.length;
      if (ratio >= 0.42 && ratio <= 0.84) {
        if (Math.abs(ratio - 0.65) < Math.abs(bestPivotRatio - 0.65) || bestPivotRatio === 0) {
          bestPivotRatio = ratio;
        }
      }
    }
  }
  const pivotCloseness =
    bestPivotRatio > 0 ? 1 - Math.abs(bestPivotRatio - 0.65) / 0.35 : 0.35;
  const contrastPivot = round2(clamp(42 + pivotCloseness * 56, 30, 100));

  // Cadence & clean single-sentence flow.
  const sentenceEnds = (trimmed.match(/[.!?](?=\s|$)/g) ?? []).length;
  const commas = (trimmed.match(/,/g) ?? []).length;
  const avgWordLen =
    wordCount > 0
      ? words.reduce((sum, w) => sum + w.length, 0) / wordCount
      : 0;
  const lenBalance = 1 - Math.min(Math.abs(avgWordLen - 4.9) / 3.5, 1);
  const rhythm = round2(
    clamp(
      (singleLine ? 58 : 10) +
        (sentenceEnds === 1 ? 18 : 6) +
        (commas <= 2 ? 10 : 3) +
        lenBalance * 14,
      20,
      100,
    ),
  );

  const composite = round2(
    latePunch * 0.32 +
      specificity * 0.25 +
      contrastPivot * 0.20 +
      brevity * 0.13 +
      rhythm * 0.10,
  );

  return {
    wordCount,
    charCount,
    singleLine,
    brevity,
    specificity,
    latePunch,
    contrastPivot,
    rhythm,
    composite,
  };
}

export function compareJokes(left: OfficeJoke, right: OfficeJoke): PairwiseResult {
  const a = evaluateJokeCraft(left);
  const b = evaluateJokeCraft(right);

  const criteria: Array<{ label: string; diff: number }> = [
    { label: "late-loaded punchline", diff: (a.latePunch - b.latePunch) * 0.34 },
    { label: "concrete office detail", diff: (a.specificity - b.specificity) * 0.26 },
    { label: "setup-to-payoff turn", diff: (a.contrastPivot - b.contrastPivot) * 0.20 },
    { label: "one-line economy", diff: (a.brevity - b.brevity) * 0.11 },
    { label: "cadence and clarity", diff: (a.rhythm - b.rhythm) * 0.09 },
  ];

  const netDiff = criteria.reduce((sum, c) => sum + c.diff, 0);
  const leftWins =
    Math.abs(netDiff) > 1e-9 ? netDiff > 0 : left.id.localeCompare(right.id) < 0;

  const winner = leftWins ? left : right;
  const loser = leftWins ? right : left;
  const signedMultiplier = leftWins ? 1 : -1;

  const edgeCriteria = criteria
    .map((c) => ({ label: c.label, gain: c.diff * signedMultiplier }))
    .filter((c) => c.gain > 0.25)
    .sort((x, y) => y.gain - x.gain || x.label.localeCompare(y.label))
    .slice(0, 2)
    .map((c) => c.label);

  return {
    leftId: left.id,
    rightId: right.id,
    winnerId: winner.id,
    loserId: loser.id,
    margin: round2(Math.abs(netDiff)),
    edgeCriteria: edgeCriteria.length > 0 ? edgeCriteria : ["deterministic tie-break"],
  };
}

export function runTournament(
  jokes: readonly OfficeJoke[] = OFFICE_JOKES,
): TournamentReport {
  const ordered = [...jokes].sort((a, b) => a.id.localeCompare(b.id));
  const craftMap = new Map<string, CraftFeatures>();
  const stats = new Map<string, { wins: number; losses: number; marginSum: number }>();

  for (const joke of ordered) {
    craftMap.set(joke.id, evaluateJokeCraft(joke));
    stats.set(joke.id, { wins: 0, losses: 0, marginSum: 0 });
  }

  const matches: PairwiseResult[] = [];
  for (let i = 0; i < ordered.length; i += 1) {
    for (let j = i + 1; j < ordered.length; j += 1) {
      const result = compareJokes(ordered[i], ordered[j]);
      matches.push(result);
      const winStat = stats.get(result.winnerId);
      const loseStat = stats.get(result.loserId);
      if (winStat && loseStat) {
        winStat.wins += 1;
        winStat.marginSum += result.margin;
        loseStat.losses += 1;
        loseStat.marginSum -= result.margin;
      }
    }
  }

  const opponentCount = Math.max(ordered.length - 1, 1);
  const unsorted: RankedJoke[] = ordered.map((joke) => {
    const craft = craftMap.get(joke.id) ?? evaluateJokeCraft(joke);
    const s = stats.get(joke.id) ?? { wins: 0, losses: 0, marginSum: 0 };
    const winRate = round2(s.wins / opponentCount);
    const avgMargin = round2(s.marginSum / opponentCount);
    const rating = round2(1000 + winRate * 400 + avgMargin * 12 + craft.composite * 2);
    return {
      rank: 0,
      joke,
      craft,
      wins: s.wins,
      losses: s.losses,
      winRate,
      avgMargin,
      rating,
    };
  });

  unsorted.sort(
    (a, b) =>
      b.wins - a.wins ||
      b.avgMargin - a.avgMargin ||
      b.craft.composite - a.craft.composite ||
      a.joke.id.localeCompare(b.joke.id),
  );

  const rankings: RankedJoke[] = unsorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  return {
    totalJokes: ordered.length,
    totalMatches: matches.length,
    winner: rankings[0],
    topFive: rankings.slice(0, 5),
    rankings,
    matches,
  };
}

export function selectWinningJoke(
  jokes: readonly OfficeJoke[] = OFFICE_JOKES,
): RankedJoke {
  return runTournament(jokes).winner;
}

export default {
  OFFICE_JOKES,
  evaluateJokeCraft,
  compareJokes,
  runTournament,
  selectWinningJoke,
};