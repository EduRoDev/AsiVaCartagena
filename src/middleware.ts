import { defineMiddleware } from 'astro:middleware';
import { supabase } from './lib/supabase';

const protectedRoutes = ['/dashboard', '/admin'];

const publicRoutes = ['/', '/signin', '/contacto', '/user', '/latido-local', '/la-fantastica', '/mis-raices', '/alzando-voces', '/la-cancha', '/saber-ctg'];

export const onRequest = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  const pathname = url.pathname;
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const accessToken = cookies.get('sb-access-token');
    const refreshToken = cookies.get('sb-refresh-token');

    if (!accessToken || !refreshToken) {
      return redirect('/signin');
    }

    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken.value,
        refresh_token: refreshToken.value,
      });

      if (error || !data.session) {
        cookies.delete('sb-access-token', { path: '/' });
        cookies.delete('sb-refresh-token', { path: '/' });
        return redirect('/signin');
      }

      if (data.session.access_token !== accessToken.value) {
        cookies.set('sb-access-token', data.session.access_token, {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });
        cookies.set('sb-refresh-token', data.session.refresh_token, {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });
      }
    } catch (error) {
      cookies.delete('sb-access-token', { path: '/' });
      cookies.delete('sb-refresh-token', { path: '/' });
      return redirect('/signin');
    }
  }

  return next();
});
