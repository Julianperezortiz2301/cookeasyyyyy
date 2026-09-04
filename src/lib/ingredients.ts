const DIACRITICS_REGEX = /[̀-ͯ]/g;

export function normalizeIngredient(raw: string): string {
  const lowered = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "");

  // very basic plural -> singular handling
  if (lowered.endsWith("oes") || lowered.endsWith("ies")) {
    return lowered.slice(0, -3) + "y";
  }
  if (lowered.endsWith("es") && lowered.length > 3) {
    return lowered.slice(0, -2);
  }
  if (lowered.endsWith("s") && !lowered.endsWith("ss") && lowered.length > 3) {
    return lowered.slice(0, -1);
  }
  return lowered;
}

export function parseIngredientsQuery(query: string): string[] {
  return query
    .split(",")
    .map((s) => normalizeIngredient(s))
    .filter((s) => s.length > 0);
}
