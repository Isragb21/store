// app/admin/page.tsx
import { createProduct } from '../actions'
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
            <p className="text-slate-500">Gestiona tu inventario con imágenes.</p>
          </div>
          <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            ← Volver a la Tienda
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Nuevo Producto</h2>
              <form action={createProduct} className="space-y-4">
                
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <input name="name" placeholder="Ej. Collar de Oro" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black" required />
                </div>
                
                {/* URL Imagen (NUEVO CAMPO) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL de Imagen</label>
                  <input name="imageUrl" type="url" placeholder="https://ejemplo.com/foto.jpg" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black text-sm" />
                  <p className="text-xs text-gray-400 mt-1">Copia y pega el link de la imagen aquí.</p>
                </div>
                
                {/* Precio y Categoría */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
                    <input name="price" type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none text-black" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                    <select name="category" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none text-black bg-white">
                      <option value="joyeria">Joyería</option>
                      <option value="ropa">Ropa</option>
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          {/* 👇 Mostramos la miniatura */}
                          <img 
                            src={prod.imageUrl || 'https://placehold.co/100'} 
                            alt={prod.name} 
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{prod.name}</td>
                        <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded-full text-xs">{prod.category}</span></td>
                        <td className="px-6 py-4 text-right text-slate-600">${prod.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}