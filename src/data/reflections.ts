export const MOODS = ["Peaceful", "Anxious", "Tired", "Connected", "Overwhelmed"] as const;
export type Mood = (typeof MOODS)[number];

const connected = [
  "What is one thing you appreciate about sharing this moment together today?",
  "If you could describe your bond right now in just three words, what would they be?",
  "What is a small tradition or routine you hope you both keep forever?",
  "Think of a time the other person made you feel incredibly safe. Share it with them if you'd like.",
  "What did you learn about each other during today's discussion card?",
];
const anxious = [
  "Look around the room. Name three things that are a soothing color to look at right now.",
  "Breathe in for four seconds, hold for four, and exhale for four. You are safe in this corner.",
  "What is one worry you can gently 'leave behind' in this app before you close it?",
  "If your feelings were a weather pattern right now (rainy, stormy, foggy), what would they be? Weather always passes.",
  "What is one small thing within your control that you can focus on for the rest of the day?",
];
const tired = [
  "You survived a busy day. What is the most comforting thing you can do for your body tonight?",
  "Rest is a productive mindful task. What does true relaxation look like for you right now?",
  "If you don't have the energy to type today, just name one thing you are glad is over.",
  "Give yourself permission to do less tomorrow. What is one thing you can take off your to-do list?",
  "What is a favorite cozy memory that makes you feel instantly warm inside?",
];
const peaceful = [
  "Where in your body do you feel this calmness the most right now?",
  "What is a small, quiet joy you noticed earlier today that usually goes ignored?",
  "How can you take a tiny piece of this peace with you into the rest of your week?",
  "Write down one word that represents how your mind feels in this exact moment.",
  "Who is someone you'd love to send a little bit of this calm energy to today?",
];

export const PROMPTS: Record<Mood, string[]> = {
  Connected: connected,
  Anxious: anxious,
  Overwhelmed: anxious,
  Tired: tired,
  Peaceful: peaceful,
};

export function randomPrompt(mood: Mood, exclude?: string) {
  const list = PROMPTS[mood].filter((p) => p !== exclude);
  return list[Math.floor(Math.random() * list.length)] ?? PROMPTS[mood][0]!;
}

export type Reflection = { id: string; date: string; mood: Mood; prompt: string; note: string; source: string };

const KEY = "comfort-corner-reflections";

export function loadReflections(): Reflection[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Reflection[]) : [];
  } catch {
    return [];
  }
}

export function saveReflection(r: Reflection) {
  const all = [r, ...loadReflections()];
  localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}

export function deleteReflection(id: string) {
  const all = loadReflections().filter((r) => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}
