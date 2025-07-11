export async function GET() {
    try {
      
        await new Promise(resolve => setTimeout(resolve, 400)); // Simula una consulta externa
        return new Response(JSON.stringify({ result: 200 }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
