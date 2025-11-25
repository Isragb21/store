// lib/store.ts
import { create } from 'zustand'

type Product = {
  id: number
  name: string
  price: number
}

type CartStore = {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (product) => set((state) => ({ items: [...state.items, product] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearCart: () => set({ items: [] }),
}))