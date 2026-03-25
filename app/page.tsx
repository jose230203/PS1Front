'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import FormularioProducto from './components/FormularioProducto';
import ModificarProducto from './components/ModificarProducto';
import { 
  Loader2, CheckCircle2, X, User, Package, 
  Tag, Database, Lock, Globe, PencilRuler, Search 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string; 
  precio: number;
  stock: number;
  version: number;
  esta_activo: boolean;
  creado_por: string;
  creado_por_name?: string; 
}

export default function Home() {
  const [vista, setVista] = useState<string>('buscar');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoDetalle, setProductoDetalle] = useState<Producto | null>(null); 
  const [cargando, setCargando] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>('');
  const [productoAEditar, setProductoAEditar] = useState<any>(null);
  const [userActual, setUserActual] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserActual(user);
    };
    checkUser();
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/productos`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setProductos(data);
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setMensaje("Fallo crítico: No se pudo conectar con el Nodo de Lógica (3001)");
    } finally {
      setCargando(false);
    }
  };

  const handleBaja = async (id: number) => {
    const confirmar = confirm("¿Está seguro de dar de baja este producto?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/productos/baja/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userActual?.id }) 
      });

      if (res.ok) {
        setMensaje("Registro desactivado correctamente en el nodo");
        fetchProductos(); 
        setVista('buscar');
      } else {
        const err = await res.json();
        alert(err.error || "Acceso Denegado");
      }
    } catch (error) {
      alert("Error de red con el nodo remoto.");
    }
  };

  const productosFiltrados = vista === 'mis-registros' 
    ? productos.filter(p => p.creado_por === userActual?.id)
    : productos;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar setVista={setVista} />

      <main className="grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Alertas de Sistema */}
          {mensaje && (
            <div className="mb-6 p-4 bg-white border-l-4 border-green-500 shadow-sm rounded-r-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3 text-green-800 font-medium">
                <CheckCircle2 size={20} className="text-green-500" /> {mensaje}
              </div>
              <button onClick={() => setMensaje('')} className="text-slate-400 hover:text-slate-600">
                <X size={18}/>
              </button>
            </div>
          )}

          {/* Selector de Contexto (Pestañas) */}
          {(vista === 'buscar' || vista === 'mis-registros') && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 p-1 bg-slate-200/50 rounded-2xl w-fit">
                  <button 
                    onClick={() => setVista('buscar')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${vista === 'buscar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                  >
                    <Globe size={16} /> EXPLORADOR GLOBAL
                  </button>
                  <button 
                    onClick={() => setVista('mis-registros')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${vista === 'mis-registros' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                  >
                    <PencilRuler size={16} /> MIS PUBLICACIONES
                  </button>
                </div>
                
                <button 
                  onClick={fetchProductos}
                  disabled={cargando}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition text-slate-600 shadow-sm"
                  title="Sincronizar con el nodo"
                >
                  <Database size={20} className={cargando ? "animate-spin" : ""} />
                </button>
              </div>

              {/* Tabla de Datos */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
                <div className="p-6 border-b bg-slate-50/50 flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${vista === 'buscar' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                    {vista === 'buscar' ? <Search size={24}/> : <User size={24}/>}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                      {vista === 'buscar' ? 'Listado Completo' : 'Gestión de Productos'}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      Mostrando {productosFiltrados.length} recursos disponibles en el clúster
                    </p>
                  </div>
                </div>

                {cargando ? (
                  <div className="p-32 flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                    <p className="text-slate-400 font-bold animate-pulse">SINCRONIZANDO NODOS...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-slate-400 uppercase text-[10px] font-black tracking-widest bg-slate-50/50">
                          <th className="p-6 border-b">Recurso / Versión</th>
                          <th className="p-6 border-b">Precio Mercado</th>
                          <th className="p-6 border-b">Stock</th>
                          <th className="p-6 border-b text-center">Acciones de Nodo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {productosFiltrados.length > 0 ? (
                          productosFiltrados.map((p) => {
                            const esDueno = userActual?.id === p.creado_por;
                            return (
                              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td 
                                  className="p-6 cursor-pointer"
                                  onClick={() => { setProductoDetalle(p); setVista('detalle'); }}
                                >
                                  <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{p.nombre}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold">v.{p.version}</span>
                                    <span className="text-[10px] text-slate-400">@{p.creado_por_name}</span>
                                  </div>
                                </td>
                                <td className="p-6">
                                  <span className="text-lg font-black text-green-600">${p.precio}</span>
                                </td>
                                <td className="p-6">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${p.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm font-bold text-slate-600">{p.stock} uds.</span>
                                  </div>
                                </td>
                                <td className="p-6">
                                  <div className="flex justify-center gap-2">
                                    {esDueno ? (
                                      <>
                                        <button 
                                          onClick={() => { setProductoAEditar(p); setVista('modificar'); }} 
                                          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-black hover:bg-orange-500 hover:text-white transition-all"
                                        >
                                          EDITAR
                                        </button>
                                        <button 
                                          onClick={() => handleBaja(p.id)} 
                                          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-black hover:bg-red-500 hover:text-white transition-all"
                                        >
                                          BAJA
                                        </button>
                                      </>
                                    ) : (
                                      <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-300 rounded-xl text-[10px] font-black border border-slate-100">
                                        <Lock size={12} /> SOLO LECTURA
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-20 text-center">
                              <Package className="mx-auto text-slate-200 mb-4" size={48} />
                              <p className="text-slate-400 font-bold italic">No se encontraron registros en este segmento.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vistas Secundarias */}
          {vista === 'detalle' && productoDetalle && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 max-w-2xl mx-auto">
                <div className="flex justify-between items-start mb-8 border-b pb-6">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{productoDetalle.nombre}</h2>
                    <p className="text-slate-400 text-xs font-mono mt-2 flex items-center gap-2">
                      <Database size={14} /> ID_NODO: {productoDetalle.id}
                    </p>
                  </div>
                  <button onClick={() => setVista('buscar')} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition">
                    <X size={24} className="text-slate-600" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Package size={14} className="text-blue-500" /> Descripción Técnica
                      </h4>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed italic">
                        "{productoDetalle.descripcion || 'Sin metadatos adicionales registrados.'}"
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-200">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Responsable</p>
                        <p className="text-blue-900 font-black">@{productoDetalle.creado_por_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-8 shadow-2xl shadow-slate-300">
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Tag size={14} className="text-green-400" /> Valor de Cambio
                      </p>
                      <p className="text-5xl font-black text-green-400">${productoDetalle.precio}</p>
                    </div>
                    
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Unidades en Red</p>
                      <p className="text-2xl font-black">{productoDetalle.stock} Unidades</p>

                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <span className="text-[10px] bg-slate-800 px-3 py-1.5 rounded-lg text-slate-500 font-black tracking-widest border border-slate-700">
                        VERSIÓN CONSISTENTE: {productoDetalle.version}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setVista('buscar')}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase tracking-widest"
                >
                  Regresar al Clúster
                </button>
              </div>
            </div>
          )}
          
          {vista === 'modificar' && (
            <ModificarProducto 
              producto={productoAEditar} 
              setVista={setVista} 
              alFinalizar={fetchProductos} 
            />
          )}

          {vista === 'agregar' && (
            <FormularioProducto 
              setVista={setVista} 
              alFinalizar={fetchProductos} 
            />
          )}

        </div>
      </main>
    </div>
  );
}