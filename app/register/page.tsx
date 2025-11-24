// app/register/page.tsx
'use client'

import { registerUser } from '../actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError('')
    
    const res = await registerUser(formData)
    
    if (res.success) {
      // Si todo sale bien, lo mandamos al login
      router.push('/login')
    } else {
      setError(res.error || 'Ocurrió un error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900">Crear Cuenta</h1>
          <p className="text-gray-500 mt-2">Únete a MODASTORE</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium text-center">
            {error}
          </div>
        )}
        
        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg mb-6 text-xs text-center border border-blue-100">
          💡 <strong>Truco:</strong> Si tu correo incluye la palabra "<strong>admin</strong>", <br/> te convertirás en Administrador automáticamente.
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nombre</label>
            <input 
              name="name" 
              type="text" 
              placeholder="Ej. Juan Pérez" 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none text-slate-900" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
            <input 
              name="email" 
              type="email" 
              placeholder="juan@ejemplo.com" 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none text-slate-900" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none text-slate-900" 
              required 
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition disabled:bg-gray-400 mt-2"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-indigo-600 font-bold hover:underline">
            Inicia Sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}