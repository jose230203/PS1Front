'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowLeft, MailCheck, User, AtSign, Lock, Mail } from 'lucide-react';

export default function RegistroPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const router = useRouter();

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          nombre_completo: nombreCompleto,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      }
    });

    if (error) {
      alert("Error en el nodo de registro: " + error.message);
      setCargando(false);
    } else {
      setEnviado(true);
    }
  };

  if (enviado) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <MailCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Confirmación Enviada!</h2>
          <p className="text-slate-600 mb-6">
            Hemos enviado un enlace a <span className="font-bold">{email}</span>. 
            Debes confirmar tu cuenta para que tu perfil sea creado en el sistema.
          </p>
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 px-4 py-12 font-[family-name:var(--font-geist-sans)]">
      <form onSubmit={handleRegistro} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 text-blue-600">
            <UserPlus size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Nueva Cuenta</h2>
          <p className="text-slate-500 text-sm">Regístrate en el Sistema Distribuido</p>
        </div>

        <div className="space-y-4">
          {/* Nombre Completo */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Nombre Completo" 
              className="w-full pl-10 p-3 border rounded-xl outline-blue-600 bg-slate-50 text-slate-800"
              onChange={(e) => setNombreCompleto(e.target.value)}
              required
            />
          </div>

          {/* Username */}
          <div className="relative">
            <AtSign className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Nombre de Usuario (Username)" 
              className="w-full pl-10 p-3 border rounded-xl outline-blue-600 bg-slate-50 text-slate-800"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              type="email" 
              placeholder="Correo Electrónico" 
              className="w-full pl-10 p-3 border rounded-xl outline-blue-600 bg-slate-50 text-slate-800"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              type="password" 
              placeholder="Contraseña (mín. 6 caracteres)" 
              className="w-full pl-10 p-3 border rounded-xl outline-blue-600 bg-slate-50 text-slate-800"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            disabled={cargando}
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-slate-400 shadow-lg shadow-blue-200"
          >
            {cargando ? "Procesando Nodo..." : "Crear Perfil"}
          </button>
        </div>

        <button 
          type="button"
          onClick={() => router.push('/login')}
          className="mt-6 w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 transition text-sm font-medium"
        >
          <ArrowLeft size={16} /> Regresar al Login
        </button>
      </form>
    </div>
  );
}