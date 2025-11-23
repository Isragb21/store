// app/actions.ts
'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type CartItem = {
  id: number
  price: number
}

// 1. Crear Producto
export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string 
  // 👇 Leemos la URL de la imagen. Si no ponen nada, usamos una imagen gris por defecto.
  const imageUrl = formData.get('imageUrl') as string || 'https://placehold.co/400x400/png'
  
  await prisma.product.create({
    data: {
      name,
      price,
      category,
      imageUrl,
      description: 'Producto nuevo',
    }
  })

  revalidatePath('/admin')
  revalidatePath('/')
}

// 2. Procesar Pago (Sin cambios, pero asegúrate de mantenerlo)
export async function createOrder(total: number, items: CartItem[]) {
  const success = Math.random() > 0.2
  if (!success) return { success: false, error: 'Tarjeta declinada (Simulación)' }

  const order = await prisma.order.create({
    data: {
      total: total,
      items: {
        create: items.map((item) => ({
          productId: item.id,
          quantity: 1, 
          price: item.price
        }))
      }
    }
  })

  return { success: true, orderId: order.id }
}