// app/actions.ts
'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
// 👇 CAMBIO 1: Importamos el tipo correcto para la respuesta
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'

// ==========================================
// CONFIGURACIÓN DE CLOUDINARY
// ==========================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

type CartItem = {
  id: number
  price: number
}

// ==========================================
// 1. GESTIÓN DE PRODUCTOS (ADMIN)
// ==========================================

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string 
  const imageFile = formData.get('image') as File 
  
  let imageUrl = 'https://placehold.co/400x400/png' 

  try {
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // 👇 CAMBIO 2: Tipamos la Promesa correctamente para eliminar el 'any'
      const uploadResponse = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'mi-tienda-nest' }, 
          (error, result) => {
            if (error) reject(error)
            // Aseguramos a TS que el resultado es del tipo correcto
            else resolve(result as UploadApiResponse) 
          }
        ).end(buffer)
      })

      // Ahora TS sabe que secure_url existe
      imageUrl = uploadResponse.secure_url
    }

    await prisma.product.create({
      data: { name, price, category, imageUrl, description: 'Producto nuevo' }
    })

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
    
  } catch (error) {
    console.log("Error creando producto:", error)
    return { success: false, error: 'Error al crear producto' }
  }
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get('id') as string
  
  try {
    await prisma.product.delete({
      where: { id: parseInt(id) }
    })
    revalidatePath('/admin')
    revalidatePath('/')
  } catch (error) {
    console.log("Error eliminando producto:", error)
  }
}

// ==========================================
// 2. GESTIÓN DE ÓRDENES (TIENDA Y ADMIN)
// ==========================================

export async function createOrder(total: number, items: CartItem[], paymentMethod: string) {
  try {
    const order = await prisma.order.create({
      data: {
        total: total,
        paymentMethod: paymentMethod, 
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

export async function completeOrder(formData: FormData) {
  const id = formData.get('id') as string

  try {
    await prisma.order.delete({
      where: { id: parseInt(id) }
    })
    revalidatePath('/admin/orders')
  } catch (error) {
    console.log("Error completando orden:", error)
  }
}

// ==========================================
// 3. USUARIOS Y SESIÓN
// ==========================================

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

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  revalidatePath('/')
}