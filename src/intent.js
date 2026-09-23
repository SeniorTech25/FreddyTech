const rules = [
  { id: 'preserve', category: 'create', words: /\b(vhs|tapes?|minidv|hi8|cassettes?|digitiz\w*|digitis\w*|remaster\w*|preserv\w*|home movies|old videos|family videos)\b/gi },
  { id: 'training', category: 'optimize', words: /\b(train\w*|workshops?|teach\w*|learn\w*|lessons?)\b/gi },
  { id: 'build', category: 'build', words: /\b(websites?|web\s?apps?|landing pages?|prototypes?|booking|ecommerce|e-commerce|ar|vr|augmented reality|virtual reality)\b/gi },
  { id: 'optimize', category: 'optimize', words: /\b(ai|chatgpt|business|automati\w*|workflow\w*|productivity|process\w*|teams?|software tools|consult\w*)\b/gi },
  { id: 'create', category: 'create', words: /\b(videos?|editing|edit|podcasts?|film\w*|content|interviews?|media)\b/gi },
  { id: 'help', category: 'help', words: /\b(computers?|laptops?|phones?|printers?|wi-?fi|slow|broken|fix\w*|backup\w*|passwords?|accounts?|setup|set up|migrat\w*|support|troubleshoot\w*)\b/gi },
];

export function matchIntent(value) {
  const text = value.trim().toLowerCase();
  if (!text) return null;
  const matches = rules.map((rule) => ({ ...rule, score: [...text.matchAll(rule.words)].length })).filter((rule) => rule.score > 0);
  // Specific preservation and education requests take priority over broad words like "video" or "AI".
  return matches.find((rule) => rule.id === 'preserve') ?? matches.find((rule) => rule.id === 'training') ?? matches.sort((a, b) => b.score - a.score)[0] ?? null;
}

export function emailHref({ name = '', email = '', message, topic = 'A new idea' }) {
  const body = `Hey Freddy,\n\n${message.trim()}\n\n${name.trim()}${email.trim() ? `\nReply to: ${email.trim()}` : ''}`;
  return `mailto:hello@freddytech.ca?subject=${encodeURIComponent(`FreddyTech / ${topic}`)}&body=${encodeURIComponent(body)}`;
}
