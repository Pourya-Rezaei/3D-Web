import { test } from "node:test";
import assert from "node:assert/strict";
import { buildNarrative, recommend, scoreWatch } from "./concierge.ts";
import { WATCH_DATABASE } from "./watches.ts";

test("catalog is complete and every watch has a unique id", () => {
  assert.equal(WATCH_DATABASE.length, 6);
  const ids = new Set(WATCH_DATABASE.map((w) => w.id));
  assert.equal(ids.size, WATCH_DATABASE.length);
  for (const w of WATCH_DATABASE) {
    assert.ok(w.id && w.name && w.nameFa && w.ref && w.image && w.description);
    assert.ok(Array.isArray(w.tags) && w.tags.length > 0);
  }
});

test("scoreWatch rewards a full formal/platinum/art/timeless profile", () => {
  const tourbillon = WATCH_DATABASE.find((w) => w.id === "tourbillon")!;
  const score = scoreWatch(tourbillon, {
    style: "formal",
    occasion: "special",
    material: "platinum",
    function: "art",
    era: "timeless",
  });
  assert.equal(score, 11);
});

test("recommend picks the tourbillon for a formal/platinum profile", () => {
  const result = recommend({
    style: "formal",
    occasion: "special",
    material: "platinum",
    function: "art",
    era: "timeless",
  });
  assert.equal(result.recommendation.id, "tourbillon");
  assert.notEqual(result.alternative.id, result.recommendation.id);
  assert.ok(result.narrative.includes(result.recommendation.nameFa));
});

test("the material answer actually affects the score", () => {
  const abyss = WATCH_DATABASE.find((w) => w.id === "abyss")!;
  assert.ok(scoreWatch(abyss, { material: "steel" }) > scoreWatch(abyss, {}));
});

test("empty answers still produce a deterministic result", () => {
  const result = recommend({});
  assert.equal(result.recommendation.id, "tourbillon");
  assert.equal(result.alternative.id, "rose");
});

test("buildNarrative reflects the chosen style label", () => {
  const narrative = buildNarrative(WATCH_DATABASE[0], { style: "formal" });
  assert.ok(narrative.includes("رسمی و باشکوه"));
  assert.ok(narrative.includes(WATCH_DATABASE[0].nameFa));
});
