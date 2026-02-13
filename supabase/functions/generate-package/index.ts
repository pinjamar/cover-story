// supabase/functions/generate-package/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!

    const authHeader = req.headers.get("Authorization")

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing auth header" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    })

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()

    const {
      job_title,
      company_name,
      job_description,
      country_code,
      language_code,
    } = body

    if (!job_description || !job_title || !company_name) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: job_title, company_name, job_description" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 1️⃣ Insert application
    const { data: application, error: appError } =
      await supabase.from("applications").insert({
        user_id: user.id,
        job_title,
        company_name,
        job_description,
        country_code,
        language_code,
      }).select().single()

    if (appError) throw appError

    // 2️⃣ Generate mock resume + cover story
    // (Replace later with OpenAI)
    const resumeContent = {
      summary: "AI-generated professional summary.",
      experience: [
        {
          title: "Frontend Developer",
          achievements: [
            "Built scalable React applications",
            "Improved performance by 35%"
          ]
        }
      ]
    }

    const coverStoryContent = {
      intro: "Dear Hiring Manager,",
      body: "I am excited to apply for this role...",
      closing: "Best regards"
    }

    // 3️⃣ Insert resume version
    await supabase.from("document_versions").insert({
      application_id: application.id,
      type: "resume",
      content: resumeContent,
      version_number: 1,
    })

    // 4️⃣ Insert cover story version
    await supabase.from("document_versions").insert({
      application_id: application.id,
      type: "cover_story",
      content: coverStoryContent,
      version_number: 1,
    })

    return new Response(
      JSON.stringify({
        application_id: application.id,
        resume: resumeContent,
        cover_story: coverStoryContent,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
