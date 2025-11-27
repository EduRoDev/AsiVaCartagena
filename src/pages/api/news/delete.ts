import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export const DELETE: APIRoute = async ({ request }) => {
  const body = await request.json();

  const { error } = await supabase
    .from("news")
    .delete()
    .eq("id", body.id);

  if (error) return new Response(JSON.stringify({ error }), { status: 400 });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};