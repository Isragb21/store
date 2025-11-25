// app/admin/page.tsx
import { createProduct, deleteProduct } from '../actions'
import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminPage() {
  const products = await prisma.product.findMany({ orderBy: { id: 'desc' } })

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
            <p className="text-slate-500">Gestiona tu inventario.</p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/admin/orders" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 transition flex items-center gap-2 shadow-lg border border-slate-700">
               📦 Ver Pedidos de Clientes
            </Link>
            
            <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center px-4 border border-indigo-200 rounded-lg hover:bg-indigo-50">
              Ir a Tienda →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Nuevo Producto</h2>
              <form action={createProduct} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <input name="name" placeholder="Ej. Collar de Oro" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 placeholder:text-gray-400" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL de Imagen</label>
                  <input name="imageUrl" type="url" placeholder="https://..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-sm" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
                    <input name="price" type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none text-slate-900" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                    <select 
                        name="category" 
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none bg-white text-slate-900 font-medium appearance-none"
                    >
                      <option value="joyeria" className="text-slate-900">Joyería</option>
                      <option value="ropa" className="text-slate-900">Ropa</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 active:scale-95 transition">
                  Guardar Producto
                </button>
              </form>
            </div>
          </div>

          {/* Tabla de Inventario */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-slate-800">Inventario ({products.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Imagen</th>
                      <th className="px-6 py-4">Producto</th>
                      <th className="px-6 py-4">Categoría</th>
                      <th className="px-6 py-4 text-right">Precio</th>
                      <th className="px-6 py-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={prod.imageUrl || 'https://placehold.co/100'} 
                            alt={prod.name} 
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{prod.name}</td>
                        <td className="px-6 py-4">
                            <span className="bg-gray-100 text-slate-700 border border-gray-200 px-2 py-1 rounded-full text-xs font-bold uppercase">
                                {prod.category}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-600 font-mono">${prod.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          <form action={deleteProduct}>
                            <input type="hidden" name="id" value={prod.id} />
                            <button className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition" title="Eliminar">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {products.length === 0 && (
                    <div className="p-10 text-center text-gray-400">
                        No has agregado productos todavía.
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}