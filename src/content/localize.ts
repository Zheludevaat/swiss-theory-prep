// Chunk 13: content localization. Swiss theory exams are taken in DE/FR/IT;
// English-fluent candidates still train better in the exam language because
// a meaningful share of the test-taking skill is parsing Swiss legalese
// ("Wer fährt zuerst?", "Sie dürfen…", "Es ist erlaubt…"). This module lets
// us layer an optional German overlay on top of each Item and Rule without
// duplicating structural fields (id, ruleIds, category, option correctness,
// legal refs, difficulty, etc.) and without breaking the 212/102 bundle for
// items that don't yet have a DE translation — those fall back to English.
//
// Option correctness is language-agnostic. If option #1 is correct in EN,
// it is correct in DE by construction (the grading logic reads from the
// primary `options` tuple, not from the translated text).

import type { Item, Rule } from "./schema";

export type ContentLang = "en" | "de";

export type LocalizedItem = {
  id: string;
  question: string;
  options: [
    { text: string; correct: boolean },
    { text: string; correct: boolean },
    { text: string; correct: boolean },
  ];
  rationale: string;
  imageAlt?: string;
};

export type LocalizedRule = {
  id: string;
  title: string;
  statement: string;
  workedExamples: string[];
};

/** True iff the item has a German overlay. Used to surface a DE badge in
 *  Library so the user sees coverage at a glance. */
export function itemHasLang(item: Item, lang: ContentLang): boolean {
  if (lang === "en") return true;
  return item.de !== undefined;
}

/** True iff the rule has a German overlay. */
export function ruleHasLang(rule: Rule, lang: ContentLang): boolean {
  if (lang === "en") return true;
  return rule.de !== undefined;
}

/** Resolve an Item's user-visible strings to `lang`, falling back to English
 *  when a translation is missing. Option correctness is preserved from the
 *  primary tuple. */
export function localizeItem(item: Item, lang: ContentLang): LocalizedItem {
  if (lang === "de" && item.de) {
    const de = item.de;
    return {
      id: item.id,
      question: de.question,
      options: [
        { text: de.options[0], correct: item.options[0].correct },
        { text: de.options[1], correct: item.options[1].correct },
        { text: de.options[2], correct: item.options[2].correct },
      ],
      rationale: de.rationale,
      imageAlt: de.imageAlt ?? item.imageAlt,
    };
  }
  return {
    id: item.id,
    question: item.question,
    options: [
      { text: item.options[0].text, correct: item.options[0].correct },
      { text: item.options[1].text, correct: item.options[1].correct },
      { text: item.options[2].text, correct: item.options[2].correct },
    ],
    rationale: item.rationale,
    imageAlt: item.imageAlt,
  };
}

/** Resolve a Rule's user-visible strings to `lang`, falling back to English. */
export function localizeRule(rule: Rule, lang: ContentLang): LocalizedRule {
  if (lang === "de" && rule.de) {
    return {
      id: rule.id,
      title: rule.de.title,
      statement: rule.de.statement,
      workedExamples: rule.de.workedExamples ?? rule.workedExamples,
    };
  }
  return {
    id: rule.id,
    title: rule.title,
    statement: rule.statement,
    workedExamples: rule.workedExamples,
  };
}
