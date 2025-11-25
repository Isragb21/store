// lib/store.ts
import { create } from 'zustand'

// 👇 Aquí definimos qué datos tiene un producto del carrito
export type CartProduct = {
  id: number
  name: string
  price: number
  imageUrl?: string | null // 👈 Ahora sabe que puede tener imagen
  category?: string
}

type CartStore = {
  items: CartProduct[]
  addItem: (product: CartProduct) => void
  removeItem: (productId: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (product) => set((state) => ({ items: [...state.items, product] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearCart: () => set({ items: [] }),
}))