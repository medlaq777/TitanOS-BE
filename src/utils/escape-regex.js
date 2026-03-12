export function escapeRegex(value) {
  if (value == null) return "";
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
