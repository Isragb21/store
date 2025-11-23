// app/ticket/[id]/page.tsx
import prisma from '@/lib/prisma'
import Link from 'next/link'

// 👇 CAMBIO IMPORTANTE: Definimos params como una Promesa
type Props = {
  params: Promise<{ id: string }>
}

export default async function TicketPage({ params }: Props) {
  // 👇 CAMBIO IMPORTANTE: Esperamos a que los params se resuelvan
  const resolvedParams = await params
  const orderId = parseInt(resolvedParams.id)

  // El resto sigue igual...
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } }
  })

  // Validación si no existe
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Orden no encontrada</h1>
        <Link href="/" className="text-blue-600 underline mt-4">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-800 py-10 px-4 flex flex-col items-center justify-center print:bg-white print:p-0">
      
      {/* --- EL RECIBO DE PAPEL --- */}
      <div className="bg-white w-full max-w-sm shadow-2xl overflow-hidden relative print:shadow-none print:w-full print:max-w-none">
        
        {/* Decoración superior */}
        <div className="h-4 bg-slate-900 print:hidden"></div>

        <div className="p-8 print:p-0">
          
          {/* ENCABEZADO */}
          <div className="text-center border-b-2 border-dashed border-gray-300 pb-6 mb-6">
            <h1 className="text-3xl font-black tracking-widest text-slate-900 uppercase">MODA<span className="text-indigo-600">STORE</span></h1>
            <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">Sucursal Centro</p>
            
            <div className="mt-6 text-left bg-gray-50 p-3 rounded font-mono text-xs text-gray-600">
              <p>FOLIO: <span className="text-slate-900 font-bold">#{order.id.toString().padStart(6, '0')}</span></p>
              <p>FECHA: {order.createdAt.toLocaleDateString()}</p>
            </div>
          </div>

          {/* LISTA DE PRODUCTOS */}
          <table className="w-full text-sm font-mono text-slate-700 mb-6">
            <thead>
              <tr className="text-xs uppercase text-gray-400 border-b border-gray-200">
                <th className="text-left pb-2 w-10">Cant</th>
                <th className="text-left pb-2">Descripción</th>
                <th className="text-right pb-2">Importe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 pr-2 align-top font-bold">{item.quantity}</td>
                  <td className="py-3 align-top">
                    <div className="flex gap-2">
                       {/* Miniatura (opcional) */}
                       {(item.product as any).imageUrl && (
                        <img 
                          src={(item.product as any).imageUrl} 
                          className="w-8 h-8 object-cover rounded border border-gray-200 print:hidden" 
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{item.product.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right align-top font-bold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTALES */}
          <div className="border-t-4 border-double border-slate-900 pt-4">
            <div className="flex justify-between text-gray-500 text-sm mb-1">
              <span>Subtotal</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end mt-4">
              <span className="text-xl font-bold text-slate-900">TOTAL</span>
              <span className="text-3xl font-black text-slate-900">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* PIE DE PÁGINA */}
          <div className="mt-10 text-center">
             <p className="text-xs font-bold text-slate-900 mb-2">*** GRACIAS POR SU COMPRA ***</p>
             
             {/* Código de barras falso */}
             <div className="h-12 bg-black w-3/4 mx-auto flex items-center justify-center text-white text-xs tracking-[0.5em] overflow-hidden">
                ||| || ||||| || ||| ||||
             </div>
          </div>
        </div>

        {/* --- BOTONES DE ACCIÓN --- */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 print:hidden">
            <button 
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-slate-800 transition mb-3 flex items-center justify-center gap-2"
              // Script inline para imprimir sin complicaciones
            >
              IMPRIMIR TICKET
            </button>
            
            <Link href="/" className="block w-full text-center py-3 rounded-lg font-bold text-slate-600 hover:bg-gray-200 transition">
              Nueva Compra
            </Link>
        </div>
      </div>
      
      {/* Script para activar el botón de impresión */}
      <script dangerouslySetInnerHTML={{__html: `
        document.querySelector('button').addEventListener('click', () => window.print());
      `}} />

    </div>
  )
}