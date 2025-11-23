// app/page.tsx
import prisma from '@/lib/prisma'
import Link from 'next/link'
import AddToCartButton from '@/components/AddToCarButton'

export default async function HomePage() {
  const products = await prisma.product.findMany()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-slate-900">
            MODA<span className="text-indigo-600">STORE</span>.
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/admin" className="text-sm font-medium text-slate-500 hover:text-indigo-600">Admin</Link>
            <Link href="/cart" className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition">
              Ver Carrito
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
              
              {/* 👇 AQUÍ ESTÁ LA IMAGEN */}
              <div className="aspect-square bg-gray-100 rounded-xl mb-4 relative overflow-hidden">
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
             No hay productos. Ve al <Link href="/admin" className="text-blue-600 underline">Admin</Link> para crear uno con foto.
           </div>
        )}
      </main>
    </div>
  )
}
