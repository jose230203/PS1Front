'use client';
import { useState } from 'react';
import { Save, X, AlertTriangle } from 'lucide-react';

export default function ModificarProducto({ producto, alFinalizar, setVista }: any) {
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
        version_cliente: producto.version 
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Nodo de datos actualizado correctamente");
      alFinalizar();
      setVista('buscar');
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-orange-500 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Modificar Registro (v.{producto.version})</h2>
        <button onClick={() => setVista('buscar')}><X /></button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex gap-2 items-center">
          <AlertTriangle size={20} /> {error}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        <input 
          type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
          className="w-full p-3 border rounded-xl" placeholder="Nombre"
        />
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="number" value={precio} onChange={(e) => setPrecio(e.target.value)}
            className="w-full p-3 border rounded-xl" placeholder="Precio"
          />
          <input 
            type="number" value={stock} onChange={(e) => setStock(e.target.value)}
            className="w-full p-3 border rounded-xl" placeholder="Stock"
          />
        </div>
        <button className="w-full bg-orange-500 text-white p-3 rounded-xl font-bold hover:bg-orange-600 transition">
          Actualizar Nodo de Persistencia
        </button>
      </form>
    </div>
  );
}