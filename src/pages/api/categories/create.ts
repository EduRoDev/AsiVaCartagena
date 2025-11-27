import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) {
    return new Response(
      JSON.stringify({ error: "No autorizado" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { data: session, error: sessionError } = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });

    if (sessionError) {
      return new Response(
        JSON.stringify({ error: "Sesión inválida" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name || name.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Nombre es requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear la categoría
    const { data, error } = await supabase
      .from("categories")
      .insert({ name })
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, category: data }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
