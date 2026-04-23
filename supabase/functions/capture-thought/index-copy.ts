/**
 * capture-thought
 *
 * POST { "content": "..." }
 *
 * 1. Generates a 384-dim embedding via Supabase AI (gte-small) — no API key needed.
 * 2. Extracts metadata via Claude (claude-haiku-4-5-20251001) — needs ANTHROPIC_API_KEY secret.
 * 3. Inserts both into the thoughts table.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.24.3";
import { corsHeaders } from "../_shared/cors.ts";

const METADATA_PROMPT = `Extract metadata from the following thought and return a JSON object with exactly these keys:
- topics: string[]       — key subjects or themes (e.g. ["machine learning", "productivity"])
- people: string[]       — names of people mentioned (empty array if none)
- type: string           — one of "idea" | "task" | "note" | "event" | "other"
- action_items: string[] — concrete next actions implied (empty array if none)

Return only valid JSON. No markdown, no explanation.`;

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { content } = await req.json();

        if (!content || typeof content !== "string" || content.trim() === "") {
            return new Response(
                JSON.stringify({ error: "Field 'content' is required and must be a non-empty string." }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
        }

        const trimmed = content.trim();

        const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        );

        // Run embedding (Supabase AI) and metadata extraction (Claude) in parallel
        const session = new Supabase.ai.Session("gte-small");

        // Run embedding and metadata extraction in parallel
        const [embedding, metadataMessage] = await Promise.all([
            session.run(trimmed, { mean_pool: true, normalize: true }) as Promise<number[]>,
            anthropic.messages.create({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 512,
                messages: [
                    { role: "user", content: `${METADATA_PROMPT}\n\nThought:\n${trimmed}` },
                ],
            }),
        ]);
        const rawText = metadataMessage.content[0].type === "text" ? metadataMessage.content[0].text : "{}";
        const cleanedText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
        const metadata = JSON.parse(cleanedText);

        const { data, error } = await supabase
            .from("thoughts")
            .insert({ content: trimmed, embedding, metadata })
            .select("id, content, metadata, created_at")
            .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
            status: 201,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err) {
        const message = err instanceof Error
            ? err.message
            : (err as any)?.message ?? JSON.stringify(err);
        return new Response(JSON.stringify({ error: message, detail: (err as any)?.details ?? (err as any)?.hint ?? null }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
