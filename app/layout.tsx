'use client'; 
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { supabase } from "@/lib/supabase"; // Tu archivo de configuración
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const esRutaPublica = pathname === '/login' || pathname === '/registro';

      if (!session && !esRutaPublica) {
        router.push('/login');
      } else if (session && esRutaPublica) {
        router.push('/');
      }
      
      setCargando(false);
    };

    verificarSesion();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.push('/login');
    });

    return () => authListener.subscription.unsubscribe();
  }, [pathname, router]);

  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-slate-50 min-h-screen">
        {cargando ? (
          <div className="h-screen flex items-center justify-center font-mono text-sm text-slate-500">
            Estableciendo conexión con el nodo de seguridad...
          </div>
        ) : (
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        )}
      </body>
    </html>
  );
}