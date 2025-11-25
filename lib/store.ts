// lib/store.ts
import { create } from 'zustand'

export type CartProduct = {
  id: number
  name: string
  price: number
  imageUrl?: string | null  // 👈 Esto es lo importante
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