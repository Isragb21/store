// app/actions.ts
'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

type CartItem = {
  id: number
  price: number
}

// --- PRODUCTOS Y ÓRDENES ---

// 1. Crear Producto
export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string 
  const imageUrl = formData.get('imageUrl') as string || 'https://placehold.co/400x400/png'
  
  await prisma.product.create({
    data: { name, price, category, imageUrl, description: 'Producto nuevo' }
  })

  revalidatePath('/admin')
  revalidatePath('/')
}

// 2. Procesar Pago
export async function createOrder(total: number, items: CartItem[]) {
  const success = true; 

  try {
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

  } catch (error) {
    console.error(error)
    return { success: false, error: 'Error de base de datos' }
  }
}

// --- USUARIOS Y SESIÓN ---

// 3. Registrar Usuario
export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const role = email.includes('admin') ? 'admin' : 'user'

  try {
    await prisma.user.create({
      data: { name, email, password, role }
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'El correo ya está registrado.' }
  }
}

// 4. Iniciar Sesión
export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || user.password !== password) {
    return { success: false, error: 'Correo o contraseña incorrectos' }
  }

  const sessionData = JSON.stringify({ id: user.id, name: user.name, role: user.role })
  
  const cookieStore = await cookies()
  cookieStore.set('session', sessionData, { 
    httpOnly: true, 
    path: '/',      
    maxAge: 60 * 60 * 24 * 7 
  })

  return { success: true }
}

// 5. Cerrar Sesión (ESTA ES LA QUE FALTABA)
export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  revalidatePath('/')
}