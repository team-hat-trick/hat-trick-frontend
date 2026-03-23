import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: players, error: plErr } = await supabase.from("players").select("*").limit(1);
  console.log("Players:", players, "Error:", plErr?.message);

  const { data: follows, error: flErr } = await supabase.from("user_player_follows").select("*").limit(1);
  console.log("User Player Follows:", follows, "Error:", flErr?.message);
}

check();
