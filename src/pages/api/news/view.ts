import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

// GET all news or single news by id
export const GET: APIRoute = async ({ url }) => {
    const id = url.searchParams.get('id');
    
    if (id) {
        // Get single news by id
        const { data, error } = await supabase
            .from('news')
            .select(`
                id,
                title,
                slug,
                content,
                image_url,
                created_at,
                updated_at,
                category_id,
                categories (
                    id,
                    name
                )
            `)
            .eq('id', id)
            .single();

        if (error) return new Response(JSON.stringify({ error }), { status: 400 });
        return new Response(JSON.stringify({ data }), { status: 200 });
    }

    // Get all news
    const { data, error } = await supabase
        .from('news')
        .select(`
            id,
            title,
            slug,
            content,
            image_url,
            created_at,
            updated_at,
            category_id,
            categories (
                id,
                name
            )
        `)
        .order('created_at', { ascending: false });

    if (error) return new Response(JSON.stringify({ error }), { status: 400 });
    return new Response(JSON.stringify({ data }), { status: 200 });
}