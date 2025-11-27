import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();

    const { data, error } = await supabase
        .from('news')
        .insert({
      title: body.title,
      slug: body.slug,
      content: body.content,
      image_url: body.image_url,
      category_id: body.category_id,
      author_id: body.author_id
    });

    if (error) return new Response(JSON.stringify({ error }), { status: 400 });

    return new Response(JSON.stringify({ data }), { status: 201 });
}