/**
 * Concierge domain logic — pure functions with no HTTP or React dependency.
 * This keeps the recommendation engine unit-testable and reusable.
 */
import {
  OCCASION_LABELS,
  STYLE_LABELS,
  WATCH_DATABASE,
  type QuizAnswers,
  type Watch,
} from "./watches.ts";

export type Recommendation = {
  recommendation: Watch;
  alternative: Watch;
  narrative: string;
  quizAnswers: QuizAnswers;
};

/** Score a single watch against the user's quiz answers. Higher is better. */
export function scoreWatch(watch: Watch, answers: QuizAnswers): number {
  let score = 0;
  if (answers.style && watch.tags.includes(answers.style)) score += 3;
  if (answers.occasion) {
    if (answers.occasion === "daily" && watch.tags.includes("casual")) score += 2;
    if (answers.occasion === "special" && watch.tags.includes("formal")) score += 2;
    if (answers.occasion === "adventure" && watch.tags.includes("sport")) score += 2;
  }
  if (answers.material && watch.tags.includes(answers.material)) score += 2;
  if (answers.function && watch.tags.includes(answers.function)) score += 2;
  if (answers.era && watch.tags.includes(answers.era)) score += 2;
  return score;
}

/** Build the localized recommendation narrative for a matched watch. */
export function buildNarrative(watch: Watch, answers: QuizAnswers): string {
  const style = answers.style
    ? STYLE_LABELS[answers.style] || "منحصربه‌فرد"
    : "منحصربه‌فرد";
  const occasion = answers.occasion
    ? OCCASION_LABELS[answers.occasion] || "سبکِ زندگی شما"
    : "سبکِ زندگی شما";

  return `${watch.nameFa} برای شما انتخاب شده است. با روحِ ${style} شما و برای ${occasion}، این قطعه هم‌خوان است — ${watch.description} در آتلیه‌ی AURUM ژنو، هر جزئیات آن برای زندگی شما طراحی شده است. خوش آمدید.`;
}

/**
 * Score the full collection and return the best match plus the runner-up.
 * Deterministic tie-break: catalog order (already curated by prestige).
 */
export function recommend(answers: QuizAnswers): Recommendation {
  const scored = WATCH_DATABASE.map((watch) => ({
    watch,
    score: scoreWatch(watch, answers),
  })).sort((a, b) => b.score - a.score);

  const recommendation = scored[0].watch;
  const alternative = scored[1].watch;

  return {
    recommendation,
    alternative,
    narrative: buildNarrative(recommendation, answers),
    quizAnswers: answers,
  };
}
