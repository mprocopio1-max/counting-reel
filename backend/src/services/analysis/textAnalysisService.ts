import { TopWord } from "../../types/analyze";

const italianStopWords = new Set([
  "a",
  "ad",
  "al",
  "alla",
  "allo",
  "ai",
  "agli",
  "all",
  "anche",
  "avere",
  "con",
  "come",
  "che",
  "chi",
  "cio",
  "da",
  "dal",
  "dalla",
  "dello",
  "dei",
  "del",
  "delle",
  "di",
  "e",
  "ed",
  "gli",
  "ha",
  "hai",
  "hanno",
  "i",
  "il",
  "in",
  "io",
  "la",
  "le",
  "li",
  "lo",
  "loro",
  "ma",
  "mi",
  "ne",
  "nel",
  "nella",
  "nello",
  "nei",
  "noi",
  "non",
  "o",
  "per",
  "piu",
  "quale",
  "quali",
  "quello",
  "questa",
  "questo",
  "se",
  "sei",
  "si",
  "sono",
  "su",
  "sul",
  "sulla",
  "tra",
  "tu",
  "un",
  "una",
  "uno",
  "vi",
  "voi"
]);

const englishStopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "he",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "that",
  "the",
  "to",
  "was",
  "were",
  "will",
  "with",
  "you",
  "your",
  "we",
  "our",
  "they",
  "their",
  "this",
  "these",
  "those",
  "or",
  "not",
  "but",
  "can",
  "could",
  "should",
  "would",
  "i",
  "me",
  "my"
]);

const mergedStopWords = new Set([...italianStopWords, ...englishStopWords]);

class TextAnalysisService {
  getTopWords(text: string, limit = 20): TopWord[] {
    const normalized = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!normalized) {
      return [];
    }

    const words = normalized
      .split(" ")
      .map((word) => word.trim())
      .filter((word) => word.length > 1 && !mergedStopWords.has(word));

    const frequencies = new Map<string, number>();

    for (const word of words) {
      frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
    }

    return Array.from(frequencies.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
      .slice(0, limit);
  }
}

export const textAnalysisService = new TextAnalysisService();
