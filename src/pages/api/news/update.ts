import type {APIRoute} from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

export const PUT: APIRoute = async ({ request }) => {
    const body = await request.json();

  const { data, error } = await supabase
    .from("news")
    .update({
      title: body.title,
      slug: body.slug,
      content: body.content,
      image_url: body.image_url,
      category_id: body.category_id,
      created_at: body.created_at,
      updated_at: new Date()
    })
    .eq("id", body.id);

  if (error) return new Response(JSON.stringify({ error }), { status: 400 });

  return new Response(JSON.stringify({ data }), { status: 200 });
}