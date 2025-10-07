export function capitalizeFirst(
  input?: string | null,
  locale: string = "fi-FI",
): string {
  if (!input) return "";
  if (input.length === 0) return "";

  // Yksinkertainen ja nopea: riittää suomen kieleen
  const first = input[0].toLocaleUpperCase(locale);
  return first + input.slice(1);
}
