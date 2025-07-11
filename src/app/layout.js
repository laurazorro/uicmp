import PropTypes from 'prop-types'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppInitializer from './utils/AppInitializer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Compensar | Caja de Compensación Familiar y EPS",
  description: "Contamos con un amplio portafolio de servicios de salud y bienestar pensados y diseñados para nuestros afiliados a Caja de Compensación y EPS.",
  openGraph: {
    title: "Compensar | Caja de Compensación Familiar y EPS",
    description: "Contamos con un amplio portafolio de servicios de salud y bienestar pensados y diseñados para nuestros afiliados a Caja de Compensación y EPS.",
    url: 'https://corporativo.compensar.com',
    siteName: 'Compensar CCF y EPS',
    images: [
      {
        url: '/imagen_opengraph.jpg',
        width: 1200,
        height: 630,
        alt: 'Compensar | Caja de Compensación Familiar y EPS',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppInitializer />
        {children}
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
}