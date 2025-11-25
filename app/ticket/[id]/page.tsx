// app/ticket/[id]/page.tsx
import prisma from '@/lib/prisma'
import Link from 'next/link'
import TicketButtons from '@/components/TicketButtons'

type Props = {
  params: Promise<{ id: string }>
}

export default async function TicketPage({ params }: Props) {
  const resolvedParams = await params
  const orderId = parseInt(resolvedParams.id)

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } }
  })

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6]">
        <h1 className="text-xl font-bold text-[#1f2937]">Orden no encontrada</h1>
        <Link href="/" className="text-[#2563eb] underline mt-4">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1e293b] py-10 px-4 flex flex-col items-center justify-center print:bg-white print:p-0">
      
      <div className="bg-white w-full max-w-sm shadow-2xl overflow-hidden relative print:shadow-none print:w-full print:max-w-none">
        
        <div id="ticket-content" className="bg-white">
            
            <div className="h-4 bg-[#0f172a] print:hidden"></div>

            <div className="p-8 print:p-0">
              {/* ENCABEZADO */}
              <div className="text-center border-b-2 border-dashed border-[#d1d5db] pb-6 mb-6">
                <h1 className="text-3xl font-black tracking-widest text-[#0f172a] uppercase">
                    MODA<span className="text-[#4f46e5]">STORE</span>
                </h1>
                <p className="text-xs text-[#9ca3af] mt-2 uppercase tracking-widest">Sucursal Centro</p>
                
                <div className="mt-6 text-left bg-[#f9fafb] p-3 rounded font-mono text-xs text-[#4b5563]">
                  <p>FOLIO: <span className="text-[#0f172a] font-bold">#{order.id.toString().padStart(6, '0')}</span></p>
                  <p>FECHA: {order.createdAt.toLocaleDateString()}</p>
                  
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="font-bold text-[#0f172a]">METODO DE PAGO:</p>
                    <p className="uppercase text-[#4f46e5]">
                      {order.paymentMethod === 'card' ? 'Tarjeta Crédito/Débito' : 'Efectivo'}
                    </p>
                  </div>
                </div>
              </div>

              {/* LISTA DE PRODUCTOS */}
              <table className="w-full text-sm font-mono text-[#374151] mb-6">
                <thead>
                  <tr className="text-xs uppercase text-[#9ca3af] border-b border-[#e5e7eb]">
                    <th className="text-left pb-2 w-10">Cant</th>
                    <th className="text-left pb-2">Descripción</th>
                    <th className="text-right pb-2">Importe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-[#e5e7eb]">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-2 align-top font-bold">{item.quantity}</td>
                      <td className="py-3 align-top">
                        <div className="flex gap-2">
                           {/* 👇 CÓDIGO CORREGIDO: Ya no usamos 'as any' */}
                           {item.product.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={item.product.imageUrl} 
                              alt="prod"
                              data-html2canvas-ignore="true"
                              className="w-8 h-8 object-cover rounded border border-[#e5e7eb]" 
                            />
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-[#0f172a]">{item.product.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right align-top font-bold text-[#0f172a]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* TOTALES */}
              <div className="border-t-4 border-double border-[#0f172a] pt-4">
                <div className="flex justify-between items-end mt-4">
                  <span className="text-xl font-bold text-[#0f172a]">TOTAL</span>
                  <span className="text-3xl font-black text-[#0f172a]">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* PIE DE PÁGINA */}
              <div className="mt-10 text-center">
                <p className="text-xs font-bold text-[#0f172a] mb-2">*** GRACIAS POR SU COMPRA ***</p>
                <div className="h-12 bg-[#000000] w-3/4 mx-auto flex items-center justify-center text-white text-xs tracking-[0.5em] overflow-hidden">
                    ||| || ||||| || ||| ||||
                </div>
              </div>
            </div>
        </div>

        <TicketButtons />

      </div>
    </div>
  )
}