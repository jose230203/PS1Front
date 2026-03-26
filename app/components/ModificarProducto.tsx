'use client';
import { useState } from 'react';
import { Save, X, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ModificarProducto({ producto, alFinalizar, setVista, userActual }: any) {
  const [nombre, setNombre] = useState(producto.nombre);
  const [precio, setPrecio] = useState(producto.precio);
  const [stock, setStock] = useState(producto.stock);
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/${producto.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        precio: parseFloat(precio),
        stock: parseInt(stock),
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
      setError(data.error || "Error desconocido en el nodo");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-slate-900 max-w-lg mx-auto animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-100">
        <div className="flex items-center gap-2 text-slate-900">
          <ShieldCheck className="text-orange-500" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">Modificar Registro</h2>
        </div>
        <button 
          onClick={() => setVista('buscar')}
          className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500"
        >
          <X size={24} />
        </button>
      </div>

      <p className="text-[10px] font-mono text-slate-400 mb-4 bg-slate-50 p-2 rounded">
        IDENTIFICADOR_NODO: {producto.id} | VERSIÓN_ACTUAL: v.{producto.version}
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-900 rounded-r-lg flex gap-3 items-center font-medium">
          <AlertTriangle size={24} className="shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-sm font-black text-slate-700 mb-2 uppercase">Nombre del Producto</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:ring-0 text-slate-900 font-bold placeholder:text-slate-300 transition-all outline-none" 
            placeholder="Ej. Servidor Blade v2"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase">Precio (USD)</label>
            <input 
              type="number" 
              value={precio} 
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-orange-500 text-slate-900 font-bold outline-none" 
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase">Stock Nodo</label>
            <input 
              type="number" 
              value={stock} 
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-orange-500 text-slate-900 font-bold outline-none" 
              placeholder="0"
            />
          </div>
        </div>

        <button className="w-full bg-slate-900 text-white p-4 rounded-xl font-black text-lg hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 active:scale-95 transition-all flex items-center justify-center gap-2">
          <Save size={20} />
          SINCRONIZAR CAMBIOS
        </button>
      </form>
    </div>
  );
}