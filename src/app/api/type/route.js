import typeDocument from '../../../core/usercases/typeDocument'
import typeDocJ from '../../utils/typeDocument.json'; 

const tokenCache = {
    token: null,
    expiresAt: 0,
};

export async function GET(request){
    try{
        let documents = [];
        const now = Date.now();

        // Verificar si el token está en caché y no ha expirado
        if (!tokenCache.token || now >= tokenCache.expiresAt ) {
            const bearer = await typeDocument.getToken();
            //Actualizar el token en caché
            tokenCache.token = bearer;
            tokenCache.expiresAt = now + 300 * 1000; // 5 minutos de validez
        }

        documents = await typeDocument.execute(tokenCache.token);
        if (!documents || documents.length === 0) {
            documents = typeDocJ;
        }
        // Filtrar los documentos según el tipo especificado en los parámetros de búsqueda
        const { searchParams } = new URL(request.url);
        const tipo = searchParams.get('type');
        const documentosCondensados = documents.filter((documento) => documento.Fl[tipo] === true);
        const resultado = documentosCondensados.map((documento) => ({
            code: documento.code,
            Title: documento.Title,
            Alfanumerico: documento.AlfaNumerico,
            min: documento.min[tipo],
            max: documento.max[tipo],
        }));

        return Response.json(resultado);

    } catch (error) {
        console.info('Route: Error al obtener tipos de documento: ', error);
        let documents = typeDocJ;
        // Filtrar los documentos según el tipo especificado en los parámetros de búsqueda
        const { searchParams } = new URL(request.url);
        const tipo = searchParams.get('type');
        const documentosCondensados = documents.filter((documento) => documento.Fl[tipo] === true);
        const resultado = documentosCondensados.map((documento) => ({
            code: documento.code,
            Title: documento.Title,
            Alfanumerico: documento.AlfaNumerico,
            min: documento.min[tipo],
            max: documento.max[tipo],
        }));

        return Response.json(resultado);
    }
}