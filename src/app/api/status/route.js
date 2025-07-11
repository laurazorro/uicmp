import status from "../../../core/usercases/status";

export async function POST(req) {
  try {
    const { typedoc, numdoc, geodata, fingerprint } = await req.json();
    
    const statusLogin = await status.execute(typedoc, numdoc, geodata, fingerprint);

    return new Response(JSON.stringify(statusLogin), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error executing status:', error);

    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Si el método no está permitido, respondemos con Método no permitido
export function OPTIONS(req) {
  return new Response(null, { status: 204 });
}