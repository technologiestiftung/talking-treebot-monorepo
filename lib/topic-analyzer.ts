// Simple keyword-based topic extraction
// Analyzes questions and answers to determine conversation topic

interface ConversationData {
  questions: string[]
  answers: string[]
  language: string
}

// Common stop words to filter out (expandable)
const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "as",
  "is",
  "was",
  "are",
  "were",
  "been",
  "be",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "can",
  "what",
  "when",
  "where",
  "who",
  "how",
  "why",
  "this",
  "that",
  "these",
  "those",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
])

export function extractTopic(data: ConversationData): string {
  // Combine all questions and answers
  const allText = [...data.questions, ...data.answers].join(" ").toLowerCase()

  // Remove punctuation and split into words
  const words = allText
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word))

  // Count word frequency
  const wordFreq = new Map<string, number>()
  words.forEach((word) => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
  })

  // Get top 3 most frequent words
  const topWords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word)

  // If no meaningful words found, return generic topic
  if (topWords.length === 0) {
    return "general"
  }

  // Return the most frequent word as topic, or combine top 2 if they're related
  return topWords[0]
}

export function categorizeTopic(topic: string): string {
  // Map specific keywords to broader categories
  const categories: Record<string, string[]> = {
    environment: ["tree", "plant", "nature", "forest", "green", "climate", "weather"],
    technology: ["tech", "computer", "software", "hardware", "digital", "internet"],
    health: ["health", "medical", "doctor", "medicine", "wellness", "fitness"],
    education: ["learn", "study", "school", "education", "teaching", "course"],
    business: ["business", "company", "market", "finance", "economy", "trade"],
  }

  const lowerTopic = topic.toLowerCase()

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => lowerTopic.includes(keyword))) {
      return category
    }
  }

  return topic
}
