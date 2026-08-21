/** Google truncates around these lengths, so treat them as hard caps. */
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/**
 * Trims to `max` characters on a word boundary, without leaving a dangling
 * comma or dash. Used for generated descriptions (service pages) where the
 * source copy varies in length and could otherwise overflow.
 */
export function clamp(text: string, max = DESCRIPTION_MAX): string {
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (collapsed.length <= max) return collapsed;
  const cut = collapsed.slice(0, max - 1);
  const atWord = cut.slice(0, cut.lastIndexOf(" "));
  return `${atWord.replace(/[\s,;:—-]+$/, "")}…`;
}
