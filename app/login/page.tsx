'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error de acceso: " + error.message);
      setCargando(false);
    } else if (data.session) {
      router.push('/');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900 px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
            <LogIn size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Gestión de Productos</h1>
          <p className="text-slate-500 text-sm">Sistema de Información Distribuido</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 border rounded-xl outline-blue-600 bg-slate-50 text-slate-800"
              placeholder="nombre@correo.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Contraseña</label>
            <input 
              type="password" 
              className="w-full p-3 border rounded-xl outline-blue-600 bg-slate-50 text-slate-800"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            disabled={cargando}
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex justify-center items-center gap-2"
          >
            {cargando ? <Loader2 className="animate-spin" size={20} /> : "Iniciar Sesión"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-600 text-sm">
            ¿Aún no tienes acceso? <br/>
            <Link href="/registro" className="text-blue-600 font-bold hover:underline">
              Crear una cuenta nueva
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}