export function displayValue(value) {
    if (typeof value === "undefined" || value === null) return value;
    if (value instanceof Date) return value.toLocaleString();
    if (typeof value === "object" ||
        typeof value === "number" ||
        typeof value === "string") return value.toString();
    return value;
}
