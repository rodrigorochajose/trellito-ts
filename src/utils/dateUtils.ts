export function formatDate(dateInput: string | Date): string {
  const date = new Date(dateInput);

  const year = date.getFullYear().toString().slice(-2); // "25"
  const month = String(date.getMonth() + 1).padStart(2, "0"); // "10"
  const day = String(date.getDate()).padStart(2, "0"); // "20"

  return `${year}${month}${day}`; // "251020"
}
