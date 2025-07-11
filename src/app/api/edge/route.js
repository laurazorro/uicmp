import themes from "../../../core/usercases/edgeService";
import proxy from "../../../core/usercases/edgeProxy";

export async function POST(req) {
    try {
        const { sp } = await req.json();
        const edgeServer = await themes.getThemes(sp);
        //CONSUMIR SERVICIO OTRO

        const countryBusiness = edgeServer?.countryBusiness;
        let commerceParam = null;

        if (typeof countryBusiness === 'string' && countryBusiness.includes('-')) {
            const firstDashIndex = countryBusiness.indexOf('-');
            commerceParam = countryBusiness.substring(firstDashIndex + 1);
        } else {
        console.warn(`countryBusiness está vacío, no es un string válido o no contiene '-': "${countryBusiness}".`);
        // Opcional: Si countryBusiness es obligatorio y no está en el formato esperado, se dispara un error.
        // throw new Error("Formato de 'countryBusiness' inválido en la respuesta.");
        }
        let edgeServerCommerce = null;
        if (commerceParam !== null && commerceParam !== '') { // Asegúrate de que commerceParam no esté vacío
            edgeServerCommerce = await themes.getCommerce(commerceParam);
        } else {
            console.warn("No se pudo determinar el parámetro de comercio o está vacío, saltando la llamada a getCommerce.");
        }

        return new Response(JSON.stringify(edgeServerCommerce), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error executing Themes:', error);

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ciamId = searchParams.get('ciamIDproxy');
    console.log('ciamId:', ciamId);

    const proxysList = await proxy.getInfo(ciamId);
    console.log('proxysList:', proxysList);

    /* 
    //CONSUMIR SERVICIO OTRO

    const countryBusiness = edgeServer?.countryBusiness;
    let commerceParam = null;

    if (typeof countryBusiness === 'string' && countryBusiness.includes('-')) {
      const firstDashIndex = countryBusiness.indexOf('-');
      commerceParam = countryBusiness.substring(firstDashIndex + 1);
    } else {
      console.warn(`countryBusiness está vacío, no es un string válido o no contiene '-': "${countryBusiness}".`);
      // Opcional: Si countryBusiness es obligatorio y no está en el formato esperado, se dispara un error.
      // throw new Error("Formato de 'countryBusiness' inválido en la respuesta.");
    }
    let edgeServerCommerce = null;
    if (commerceParam !== null && commerceParam !== '') { // Asegúrate de que commerceParam no esté vacío
      edgeServerCommerce = await themes.getCommerce(commerceParam);
    } else {
      console.warn("No se pudo determinar el parámetro de comercio o está vacío, saltando la llamada a getCommerce.");
    } */

    return new Response(JSON.stringify(proxysList), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error executing Themes:', error);

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}