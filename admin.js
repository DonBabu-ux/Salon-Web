// admin.js
// Set admin emails here:
const ADMIN_EMAILS = [
  "nwaithira74@gmail.com", "lewismwangi990@gmail.com"  // <-- replace with your admin email
  // add more emails if needed
];

export async function ensureAdmin(email){
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
