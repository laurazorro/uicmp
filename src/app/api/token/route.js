export async function POST(req) {
    const { selectedMethod, code } = await req.json();
    console.log(selectedMethod, code)
    
    let result;
    let statusCode = 200;

    const mockResponse1 = {
        "code": 201,
        "message": "Operaci\u00f3n realizada exitosamente",
        "correlation": "2789db35-634d-486f-9558-68505518ad2a"
    };

    const mockResponse2 = {
        "error": "invalid_grant",
        "error_description": "Failed to Authenticate: Fall&oacute; la validaci&oacute;n de OTP",
        "code": "952"
    };

    const mockResponse3 = {
        "code": "353",
        "component": "RVUF02",
        "error": "invalid_grant",
        "error_description": "Failed to Authenticate: E-Mail Token bloqueado por reintentos fallidos",
        "correlation": "ea8c80c1-9e8c-4af1-8a4d-faee9ae9a5e1"
    };

    const mockResponse4 = {
        "code": "303",
        "component": "RVUF02",
        "error": "invalid_grant",
        "error_description": "Failed to Authenticate: SMS Token bloqueado por reintentos fallidos",
        "correlation": "3e2ee393-ef06-4db6-a48d-8e78edff0a4a"
    };
     
    if( code == "222222" ){
        if (selectedMethod == "phone" ) {
            result = mockResponse4;
        } else {
            result = mockResponse3;
        }
    }else if(code == "111111"){
        result = mockResponse2;
    } else if(code == "123456"){
        result = mockResponse1;
    } else {
        result = { error: "Tipo inválido", status: 400 };
        statusCode = 400;
    }

    return new Response(JSON.stringify(result), {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
    });
}
