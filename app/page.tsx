// app/page.tsx
import prisma from '@/lib/prisma'
import Link from 'next/link'
import AddToCartButton from '@/components/AddToCarButton'
import { cookies } from 'next/headers' 
import { logoutUser } from './actions'

export default async function HomePage() {
  const products = await prisma.product.findMany()
  
  // 👇 LEEMOS LA COOKIE DE SESIÓN
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  // 🛠️ CORRECCIÓN AQUÍ:
  // Verificamos que sessionCookie exista Y que tenga un valor (sessionCookie.value)
  // antes de intentar hacer JSON.parse.
  let user = null
  if (sessionCookie && sessionCookie.value) {
    try {
      user = JSON.parse(sessionCookie.value)
    } catch (e) {
      user = null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-slate-900">
            ELENI<span className="text-indigo-600">FASHION</span>.
          </Link>
          
          <div className="flex gap-4 items-center">
            
            {/* 👇 LÓGICA DE USUARIOS */}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 hidden md:block">
                  Hola, {user.name}
                </span>
                
                {/* Solo si es ADMIN ve esto */}
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded hover:bg-indigo-100 transition">
                    Panel Admin
                  </Link>
                )}
                
                {/* Botón Salir */}
                <form action={logoutUser}>
                    <button className="text-sm text-red-500 font-bold hover:text-red-700 transition">
                      Salir
                    </button>
                </form>
              </div>
            ) : (
              // Si NO hay usuario:
              <Link href="/login" className="text-sm font-bold text-slate-900 hover:text-indigo-600">
                Iniciar Sesión
              </Link>
            )}

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            <Link href="/cart" className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition flex gap-2">
              <span>Carrito</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- LISTA DE PRODUCTOS --- */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
              
              <div className="aspect-square bg-gray-100 rounded-xl mb-4 relative overflow-hidden">
                 {/* Imagen */}
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.imageUrl || 'https://placehold.co/400'} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{product.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase">{product.category}</span>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-end justify-between mb-4">
                    <span className="text-2xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                  </div>
                  <AddToCartButton product={product} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
           <div className="text-center py-20 text-gray-500">
             No hay productos disponibles.
           </div>
        )}
      </main>
    </div>
  )
}
