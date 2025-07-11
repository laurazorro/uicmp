'use client';
import Return from "../../components/atoms/Return"
import Link from "next/link";

export default function Method() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Estamos trabajando en ello!</h1>
      <p className="text-gray-600 text-lg max-w-xl">
        Esta sección de la aplicación está actualmente en construcción. Vuelve pronto para conocer todas las novedades.
      </p>
      <p className="text-sm text-gray-400 mt-6">Flujo Evidente</p>
      <Return url=""/>
       <Link href={"/evidente/otp"} className="font-semibold text-orange-600 hover:text-orange-700"> OTP </Link>
    </div>
    
  );
}