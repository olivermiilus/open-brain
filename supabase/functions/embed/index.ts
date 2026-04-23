/**
 * embed — lightweight embedding proxy
 *
 * POST { "text": "..." }
 * Returns { "embedding": number[] }  (384-dim, gte-small)
 *
 * Called by the Python MCP server for semantic_search so that
 * query vectors are produced by the same model as stored vectors.
 */
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Field 'text' is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Supabase AI — gte-small runs entirely inside the Edge Function runtime,
    // no external API key needed.
    const session = new Supabase.ai.Session("gte-small");
    const embedding = await session.run(text.trim(), {
      mean_pool: true,
      normalize: true,
    }) as number[];

    return new Response(JSON.stringify({ embedding }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
