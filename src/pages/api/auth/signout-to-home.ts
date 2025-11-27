import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  // Eliminar las cookies de sesión
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  
  // Redirigir al home en lugar del login
  return redirect("/");
};
