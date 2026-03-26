'use client';
import { useState } from 'react';
import { Save, X, AlertTriangle, ShieldCheck, AlignLeft } from 'lucide-react';

export default function ModificarProducto({ producto, alFinalizar, setVista, userActual }: any) {
  const [nombre, setNombre] = useState(producto.nombre);
  const [precio, setPrecio] = useState(producto.precio);
  const [stock, setStock] = useState(producto.stock);
  const [descripcion, setDescripcion] = useState(producto.descripcion || '');
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/${producto.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        descripcion,
        version_cliente: producto.version,
        userId: userActual?.id 
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Nodo de datos actualizado correctamente");
      alFinalizar();
      setVista('buscar');
    } else {
      setError(data.error || "Error de validación en el nodo");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-slate-900 max-w-lg mx-auto animate-in fade-in zoom-in duration-200">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-6 border-b-2 border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-slate-900">
          <ShieldCheck className="text-orange-600" size={28} />
          <h2 className="text-2xl font-black uppercase tracking-tighter">Modificar Registro</h2>
        </div>
        <button onClick={() => setVista('buscar')} className="hover:rotate-90 transition-transform text-slate-400 hover:text-red-500">
          <X size={28} />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-900 rounded-r-lg flex gap-3 items-center font-bold shadow-sm">
          <AlertTriangle size={24} className="shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-xs font-black text-slate-900 mb-1 uppercase">Nombre del Recurso</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-4 border-2 border-slate-300 rounded-xl focus:border-orange-500 text-slate-900 font-bold placeholder:text-slate-300 outline-none bg-slate-50 focus:bg-white transition-all" 
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-black text-slate-900 mb-1 uppercase">Especificaciones / Descripción</label>
          <div className="relative">
            <textarea 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full p-4 pl-10 border-2 border-slate-300 rounded-xl focus:border-orange-500 text-slate-900 font-bold outline-none bg-slate-50 focus:bg-white transition-all" 
              placeholder="Detalles técnicos del producto..."
            />
            <AlignLeft className="absolute left-3 top-4 text-slate-400" size={18} />
          </div>
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-900 mb-1 uppercase">Precio Unitario</label>
            <input 
              type="number" 
              value={precio} 
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full p-4 border-2 border-slate-300 rounded-xl focus:border-orange-500 text-slate-900 font-bold outline-none bg-slate-50" 
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-900 mb-1 uppercase">Stock Disponible</label>
            <input 
              type="number" 
              value={stock} 
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-4 border-2 border-slate-300 rounded-xl focus:border-orange-500 text-slate-900 font-bold outline-none bg-slate-50" 
            />
          </div>
        </div>

        {/* Botón de Sincronización */}
        <button className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-xl hover:bg-orange-600 hover:shadow-[0_10px_20px_rgba(249,115,22,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-slate-700 active:border-b-0">
          <Save size={24} />
          ACTUALIZAR NODO
        </button>
      </form>
    </div>
  );
}