'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ChevronDown, Plus, Search, PencilRuler, 
  Trash2, Database, LogOut, Globe, ShieldCheck 
} from 'lucide-react';

interface NavbarProps {
  setVista: (vista: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setVista }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = async () => {
    const confirmar = confirm("¿Cerrar sesión en este nodo?");
    if (confirmar) {
      await supabase.auth.signOut();
      window.location.reload(); 
    }
  };

  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-2xl sticky top-0 z-50 border-b border-slate-800">
      
      {/* LADO IZQUIERDO: BRANDING */}
      <div 
        className="flex items-center gap-3 font-black text-xl tracking-tighter cursor-pointer hover:opacity-80 transition"
        onClick={() => setVista('buscar')}
      >
        <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/20">
          <Database size={24} className="text-white" />
        </div>
        <div className="flex flex-col leading-none">
          <span>SI DISTRIBUIDO</span>
          <span className="text-[10px] text-blue-400 font-mono tracking-widest">Si Distribuido PS1</span>
        </div>
      </div>

      {/* LADO DERECHO: ACCIONES */}
      <div className="flex items-center gap-4">
        
        {/* MENÚ DE GESTIÓN */}
        <div className="relative">
          <button 
            onClick={() => setMenuAbierto(!menuAbierto)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm border ${
              menuAbierto 
                ? 'bg-white text-slate-900 border-white' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <ShieldCheck size={16} className={menuAbierto ? "text-blue-600" : "text-blue-400"} />
            Panel de Operaciones
            <ChevronDown size={14} className={`transition-transform duration-300 ${menuAbierto ? 'rotate-180' : ''}`} />
          </button>

          {menuAbierto && (
            <div className="absolute right-0 mt-3 w-64 bg-white text-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] py-3 z-50 border border-slate-100 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 mb-2 border-b border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones del Sistema</p>
              </div>

              <button 
                onClick={() => { setVista('buscar'); setMenuAbierto(false); }}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 transition-colors group"
              >
                <Globe size={18} className="text-blue-600 group-hover:scale-110 transition-transform" /> 
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Busqueda Global</span>
                  <span className="text-[10px] text-slate-400">Ver todos los productos</span>
                </div>
              </button>

              <button 
                onClick={() => { setVista('agregar'); setMenuAbierto(false); }}
                className="w-full text-left px-4 py-3 hover:bg-green-50 flex items-center gap-3 transition-colors group"
              >
                <Plus size={18} className="text-green-600 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Agregar Producto</span>
                  <span className="text-[10px] text-slate-400">Nuevo registro</span>
                </div>
              </button>

              <div className="my-2 border-t border-slate-50"></div>

              {/* Estas opciones ahora llevan a la vista de gestión donde el usuario ve sus productos */}
              <button 
                onClick={() => { setVista('mis-registros'); setMenuAbierto(false); }}
                className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-3 transition-colors group"
              >
                <PencilRuler size={18} className="text-orange-600 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Editar Mis Publicaciones</span>
                  <span className="text-[10px] text-slate-400">Solo registros de tu autoría</span>
                </div>
              </button>

              <button 
                onClick={() => { setVista('mis-registros'); setMenuAbierto(false); }}
                className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-3 transition-colors group"
              >
                <Trash2 size={18} className="text-red-600 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Baja de Sistema</span>
                  <span className="text-[10px] text-slate-400">Desactivar recursos propios</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* BOTÓN SALIR INDEPENDIENTE */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-black transition-all border border-red-500/20"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">SALIR</span>
        </button>

      </div>
    </nav>
  );
};

export default Navbar;