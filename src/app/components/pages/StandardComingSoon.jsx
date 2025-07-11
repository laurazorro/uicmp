import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import ComingSoonContent from "../organisms/ComingSoonContent";
import Header from "../organisms/Header";

export default function StandardComingSoon() {
  return (
    <>
      <main className="relative flex min-h-screen flex-col items-center justify-between p-5 lg:p-12 h-full w-full bg-fondo bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <Header />
        <ComingSoonContent />
      </main>
    </>
  );
}