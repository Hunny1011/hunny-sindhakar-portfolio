// Creates (or resets) an admin login and registers it in public.admins.
// Usage: pnpm admin:create <email> [password]
// Without a password, a random one is generated and printed once.
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const [email, given] = process.argv.slice(2);
if (!email) {
  console.error("usage: pnpm admin:create <email> [password]");
  process.exit(1);
}
const password = given ?? randomBytes(12).toString("base64url");

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

async function main() {
  const { data: list, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listError) throw listError;
  let user = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (user) {
    const { error } = await supabase.auth.admin.updateUserById(user.id, { password, email_confirm: true });
    if (error) throw error;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) throw error;
    user = data.user;
  }

  const { error } = await supabase.from("admins").upsert({ user_id: user.id, email });
  if (error) throw error;

  console.log(`Admin ready: ${email}`);
  if (!given) console.log(`Temporary password: ${password}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
