// app/admin/orders/page.tsx
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { completeOrder } from '../../actions'

export default async function AdminOrdersPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  const user = session ? JSON.parse(session.value) : null

  if (!user || user.role !== 'admin') {
    redirect('/')
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Pedidos Recibidos</h1>
            <p className="text-slate-500">Historial de ventas pendientes.</p>
          </div>
          <Link href="/admin" className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 px-4 py-2 rounded transition">
            ← Volver al Inventario
          </Link>
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
              
              {/* Barra superior del pedido */}
              <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    PEDIDO #{order.id}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {order.createdAt.toLocaleDateString()} - {order.createdAt.toLocaleTimeString()}
                  </p>
                </div>
                
                {/* Botón Completar */}
                <form action={completeOrder}>
                    <input type="hidden" name="id" value={order.id} />
                    <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        MARCAR COMPLETADO
                    </button>
                </form>
              </div>

              {/* Detalles de los productos */}
              <div className="p-6">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase border-b">
                    <tr>
                      <th className="pb-2">Producto</th>
                      <th className="pb-2 text-right">Precio</th>
                      <th className="pb-2 text-right">Cant.</th>
                      <th className="pb-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3 font-bold text-slate-700 flex items-center gap-2">
                           {item.product?.imageUrl && (
                             // eslint-disable-next-line @next/next/no-img-element
                             <img src={item.product.imageUrl} className="w-8 h-8 rounded object-cover border" alt="img" />
                           )}
                           {item.product?.name || 'Producto Eliminado'}
                        </td>
                        <td className="py-3 text-right text-gray-500">${item.price.toFixed(2)}</td>
                        <td className="py-3 text-right font-bold">{item.quantity}</td>
                        <td className="py-3 text-right font-bold text-slate-900">
                            ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mt-4 pt-4 border-t text-right">
                    <span className="text-sm text-gray-500 mr-4">Total Pagado:</span>
                    <span className="text-2xl font-black text-slate-900">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">👍</div>
              <h3 className="text-lg font-bold text-slate-900">Todo al día</h3>
              <p className="text-gray-400">No hay pedidos pendientes por despachar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}