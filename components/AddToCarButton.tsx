// components/AddToCartButton.tsx
'use client'

import { useCartStore } from '@/lib/store'
import { useState } from 'react'

// 👇 1. Definimos qué datos tiene un producto
interface Product {
  id: number
  name: string
  price: number
  category: string
  description?: string | null
}

// 👇 2. Usamos esa interfaz aquí en lugar de 'any'
export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  const handleClick = () => {
    // TypeScript ahora sabe que 'product' tiene id, name y price, así que esto es seguro
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleClick}
      disabled={added}
      className={`
        w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2
        ${added 
          ? 'bg-green-600 text-white cursor-default' 
          : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg active:scale-95'
        }
      `}
    >
      {added ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          ¡Agregado!
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Agregar al Carrito
        </>
      )}
    </button>
  )
}