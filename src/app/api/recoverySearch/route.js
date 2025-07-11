export function POST(req) {
  return new Response(null, { status: 204 });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('type');

  const mockResponse1 = [
    {
      appRole: "IB2,IS2,IP2",
      biometricDataAuthorization: true,
      ciamId: "ea133e1e-6666-4b50-8712-7e2847e38539",
      component: "RDIF01",
      documentResponseList: [{ verified: false }],
      firstName: "BENITO",
      individualTypeName: "Person",
      maternalSurname: "ROMO",
      middleName: "MARLON",
      nautcli: "6201835752722921",
      paternalSurname: "SANTACRUZ",
      correlation: "1767c7f6-a41e-400d-bb49-2efb66e7aa7a",
    }
  ];

  const mockResponse2 = [
    {
      appRole: "AS2",
      biometricDataAuthorization: false,
      ciamId: "b512e618-10f4-4420-8e40-2d6bb5f68d24",
      documentResponseList: [{ verified: false }],
      emailPreferred: { email: "EG****@GM***L.COM" },
      firstName: "JUAN",
      individualTypeName: "Person",
      maternalSurname: "",
      middleName: "",
      nautcli: "9999805068491327",
      paternalSurname: "FORERO",
      phonePreferred: { phoneNumber: "+57 32*****177" },
      correlation: "41623b76-8328-472a-863b-bc4fa8336c00"
    }
  ];

  const mockResponse3 = {
    component: "RVUF01",
    error: "La solicitud ha sido procesada",
    status: 400,
    correlation: "3fae5699-9930-4ec5-9c61-02ef34f3b663"
  };

  let result;
  let statusCode = 200;

  switch (tipo) {
    case "1":
      result = mockResponse1;
      break;
    case "2":
      result = mockResponse2;
      break;
    case "3":
      result = mockResponse3;
      statusCode = 400;
      break;
    default:
      result = { error: "Tipo inválido", status: 400 };
      statusCode = 400;
  }

  return new Response(JSON.stringify(result), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' }
  });
}