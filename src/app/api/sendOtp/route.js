export async function POST(req) {
    const { username, selectedMethod } = await req.json();
    let result;
    let statusCode = 200;

    const mockResponse1 = {
        "code": 201,
        "message": "Operaci\u00f3n realizada exitosamente",
        "correlation": "2789db35-634d-486f-9558-68505518ad2a"
    };

    const mockResponse2 = {
        "code": 400,
        "data": {
            "code": 352,
            "message": "E-Mail Token bloqueado"
        },
        "message": "Error",
        "correlation": "3e2ee393-ef06-4db6-a48d-8e78edff0a4a"
    };

    const mockResponse3 = {
        "code": 400,
        "data": {
            "code": 302,
            "message": "SMS Token bloqueado"
        },
        "message": "Error",
        "correlation": "3e2ee393-ef06-4db6-a48d-8e78edff0a4a"
    };

    
     
    if(username == "1111"){
        switch (selectedMethod) {
            case "phone":
                result = mockResponse3;
                break;
            case "mail":
                result = mockResponse2;
                break;
        }
    }else if(username == "2222"){
        result = { error: "Tipo inválido", status: 400 };
        statusCode = 400;
    } else {
        result = mockResponse1;
    }   

    return new Response(JSON.stringify(result), {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
    });
}
