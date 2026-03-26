'use client';
import React, { useState } from 'react';
import { Save, X, Loader2, Package, DollarSign, List, AlignLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FormProps {
  alFinalizar: () => void;
  setVista: (vista: string) => void;
}

export default function FormularioProducto({ alFinalizar, setVista }: FormProps) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Sesión expirada. Por favor inicie sesión de nuevo.");
      setEnviando(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio: parseFloat(precio),
          stock: parseInt(stock),
          creado_por: user.id 
        }),
      });

      if (res.ok) {
        alert("Registro sincronizado exitosamente en el sistema distribuido");
        alFinalizar();
        setVista('buscar');
      } else {
        const err = await res.json();
        alert("Error del Nodo de Lógica: " + err.error);
      }
    } catch (error) {
      alert("Fallo de comunicación: No se pudo alcanzar el puerto 3001");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 max-w-lg mx-auto animate-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Nuevo Producto</h2>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Capa de Presentación</p>
        </div>
        <button onClick={() => setVista('buscar')} className="text-slate-400 hover:text-red-500 transition-colors">
          <X size={28} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campo: Nombre */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <Package size={16} className="text-blue-500" /> Nombre del Recurso
          </label>
          <input 
            type="text" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 transition-all"
            placeholder="Ej. Laptop Gaming Pro"
            required
          />
        </div>

        {/* Campo: Descripción */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <AlignLeft size={16} className="text-blue-500" /> Descripción Detallada
          </label>
          <textarea 
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 transition-all"
            placeholder="Especificaciones técnicas, estado del producto..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Campo: Precio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <DollarSign size={16} className="text-green-500" /> Precio ($)
            </label>
            <input 
              type="number" 
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 transition-all"
              placeholder="0.00"
              required
            />
          </div>

          {/* Campo: Stock */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <List size={16} className="text-orange-500" /> Stock Inicial
            </label>
            <input 
              type="number" 
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 transition-all"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="pt-6 flex gap-3">
          <button 
            type="submit" 
            disabled={enviando}
            className="flex-grow bg-slate-900 text-white py-4 rounded-xl hover:bg-black transition-all flex justify-center items-center gap-2 font-black shadow-lg shadow-slate-200 disabled:bg-slate-400"
          >
            {enviando ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {enviando ? 'SINCRONIZANDO...' : 'GUARDAR EN NODO DATOS'}
          </button>
          
          <button 
            type="button"
            onClick={() => setVista('buscar')}
            className="px-6 py-4 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors font-bold"
          >
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
}