export const ADMIN_EMAILS = [
  "cuberos.villa@gmail.com",
  "albertoc.paraguay@gmail.com"
];

export function isUserAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}
