export type Meme = { id: string; caption: string; category: string; height: string }
export type Article = { category: string; title: string; description: string; date: string; readTime: string; accent: string }

export const memes: Meme[] = [
  { id: 'meme-01', caption: 'The average day in the burrow', category: 'RAT CULTURE', height: 'tall' },
  { id: 'meme-02', caption: 'When the cheese hits', category: 'FIELD NOTES', height: 'short' },
  { id: 'meme-03', caption: 'No thoughts. Just crumbs.', category: 'OBSERVATIONS', height: 'medium' },
  { id: 'meme-04', caption: 'Local rat discovers capitalism', category: 'RAT CULTURE', height: 'medium' },
  { id: 'meme-05', caption: 'The council has reviewed your request', category: 'COUNCIL', height: 'short' },
  { id: 'meme-06', caption: 'Absolutely nothing to see here', category: 'FIELD NOTES', height: 'tall' },
]

export const jokes = [
  'Somewhere, a rat is having a better day than you.',
  'The internet was a mistake. The rats approve.',
  'A tiny hat can fix almost anything.',
  'Every great idea starts as a suspicious noise in the wall.',
  'Do not trust a sandwich left unattended.',
]

export const articles: Article[] = [
  { category: 'FIELD GUIDE', title: 'A brief history of hiding things in walls', description: 'On architecture, instinct, and the objects we keep close.', date: 'JUNE 12, 2026', readTime: '4 MIN READ', accent: 'olive' },
  { category: 'INTERNET', title: 'The lost art of being a little weird online', description: 'Notes from the final days of the perfectly normal web.', date: 'MAY 28, 2026', readTime: '6 MIN READ', accent: 'clay' },
  { category: 'OBSERVATIONS', title: 'In praise of the unnecessary project', description: 'Why making something pointless is a perfectly good use of a Tuesday.', date: 'MAY 04, 2026', readTime: '3 MIN READ', accent: 'stone' },
]
