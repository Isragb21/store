// app/cart/page.tsx
'use client'

import { useCartStore } from '@/lib/store'
import { createOrder } from '../actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, clearCart } = useCartStore()
  const router = useRouter()
  
  // Estados
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [statusMessage, setStatusMessage] = useState('')

  const total = items.reduce((sum, item) => sum + item.price, 0)

  const handleCheckout = async () => {
    setIsProcessing(true)
    setStatusMessage('Conectando con el banco...')

    try {
      // 1. Simular espera artificial (2 segundos) para dar realismo
      await new Promise(resolve => setTimeout(resolve, 2000))

      setStatusMessage('Validando fondos...')
      
      // 2. Llamar al servidor
      const result = await createOrder(total, items)

      if (result.success) {
        setIsSuccess(true) // Bloqueamos la pantalla para no mostrar "vacío"
        setStatusMessage('¡Pago Aprobado! Redirigiendo...')
        
        // Espera final para leer el mensaje antes de irnos al ticket
        setTimeout(() => {
          clearCart() // Borra el carrito
          router.push(`/ticket/${result.orderId}`) // Redirige al ticket
        }, 1000)

      } else {
        // En teoría esto ya no debería pasar porque forzamos el éxito en actions.ts
        setStatusMessage('')
        setIsProcessing(false)
        alert('❌ Error: ' + result.error)
      }
    } catch (error) {
      console.error(error)
      setIsProcessing(false)
      alert('Ocurrió un error inesperado.')
    }
  }

  // Si el carrito está vacío Y NO estamos en proceso de éxito, mostramos mensaje de vacío
  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Tu carrito está vacío</h1>
        <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium mt-4 hover:bg-indigo-700 transition">
          Volver a la Tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: Lista de Productos */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-slate-900">Resumen de Compra</h1>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {items.map((item, index) => (
              <div key={index} className="p-4 flex items-center justify-between border-b last:border-0 hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  {/* Imagen o Letra */}
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                    {(item as any).imageUrl ? (
                        <img src={(item as any).imageUrl} className="w-full h-full object-cover" alt={item.name} />
                    ) : (
                        item.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-xs text-slate-500">ID: {item.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${item.price.toFixed(2)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:underline">
                    Quitar
                  </button>
                </div>
              </div>
            ))}
            
            {/* Mensaje visual de redirección */}
            {items.length === 0 && isSuccess && (
                <div className="p-8 text-center text-green-600 font-bold animate-pulse">
                    ✅ Generando ticket... por favor espere.
                </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Pasarela de Pago */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Método de Pago</h2>

            {/* Selector de Método */}
            <div className="space-y-3 mb-8">
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-indigo-600 focus:ring-indigo-500" />
                <div className="flex-1">
                  <span className="block font-bold text-slate-800">Tarjeta de Crédito</span>
                  <span className="text-xs text-slate-500">Visa, Mastercard, Amex</span>
                </div>
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-5 h-5 text-indigo-600 focus:ring-indigo-500" />
                <div className="flex-1">
                  <span className="block font-bold text-slate-800">Efectivo en Tienda</span>
                  <span className="text-xs text-slate-500">Pagar al recoger</span>
                </div>
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </label>
            </div>

            {/* Totales */}
            <div className="border-t pt-4 mb-6 space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-900">
                <span>Total a Pagar</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Botón de Pago */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg
                ${isProcessing 
                  ? 'bg-green-600 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95'
                }`}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-6 w-6 text-white mb-1" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span className="text-xs font-normal">{statusMessage}</span>
                </div>
              ) : (
                `Pagar con ${paymentMethod === 'card' ? 'Tarjeta' : 'Efectivo'}`
              )}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Pagos procesados por SimuPay™
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}