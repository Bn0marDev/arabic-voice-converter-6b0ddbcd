
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { secret_name } = await req.json()
    
    // Only allow specific secret names
    const allowedSecrets = ['ELEVEN_LABS_API_KEY', 'FIREBASE_API_KEY']
    if (!allowedSecrets.includes(secret_name)) {
      return new Response(
        JSON.stringify({ error: 'Invalid secret name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const secret = Deno.env.get(secret_name)
    if (!secret) {
      return new Response(
        JSON.stringify({ error: 'Secret not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ [secret_name]: secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
