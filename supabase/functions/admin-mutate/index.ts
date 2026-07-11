// Admin mutations for portfolio (certificates + site_settings)
// Validates a shared passcode server-side and uses the service role to write.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ProjectData = {
  title: string;
  image_url: string;
  live_demo_url: string | null;
  short_description: string;
  brief_description: string;
  other_images: string[];
  project_report_url: string | null;
  github_url: string | null;
  sort_order: number;
};

type Action =
  | { action: "cert_insert"; data: { title: string; description: string; image_url: string; sort_order: number } }
  | { action: "cert_update"; id: string; data: { title: string; description: string; image_url: string; sort_order: number } }
  | { action: "cert_delete"; id: string }
  | { action: "setting_upsert"; key: string; value: string }
  | { action: "project_insert"; data: ProjectData }
  | { action: "project_update"; id: string; data: ProjectData }
  | { action: "project_delete"; id: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const passcode = body?.passcode as string | undefined;
    const expected = Deno.env.get("ADMIN_PASSCODE");

    if (!expected || !passcode || passcode !== expected) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const payload = body as { passcode: string } & Action;

    switch (payload.action) {
      case "cert_insert": {
        const { error } = await supabase.from("certificates").insert(payload.data);
        if (error) throw error;
        break;
      }
      case "project_insert": {
        const { error } = await supabase.from("projects").insert(payload.data);
        if (error) throw error;
        break;
      }
      case "project_update": {
        const { error } = await supabase.from("projects").update(payload.data).eq("id", payload.id);
        if (error) throw error;
        break;
      }
      case "project_delete": {
        const { error } = await supabase.from("projects").delete().eq("id", payload.id);
        if (error) throw error;
        break;
      }
      case "cert_update": {
        const { error } = await supabase.from("certificates").update(payload.data).eq("id", payload.id);
        if (error) throw error;
        break;
      }
      case "cert_delete": {
        const { error } = await supabase.from("certificates").delete().eq("id", payload.id);
        if (error) throw error;
        break;
      }
      case "setting_upsert": {
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key: payload.key, value: payload.value }, { onConflict: "key" });
        if (error) throw error;
        break;
      }
      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
