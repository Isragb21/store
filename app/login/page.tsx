// app/login/page.tsx
'use client'

import { loginUser } from '../actions'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError('')
    
    const res = await loginUser(formData)
    
    if (res.success) {
      window.location.href = '/'
    } else {
      setError(res.error || 'Error desconocido')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900">Bienvenido</h1>
          <p className="text-gray-500 mt-2">Ingresa a tu cuenta</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium text-center">
            {error}
          </div>
        )}
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
            <input 
              name="email" 
              type="email" 
              placeholder="tu@correo.com" 
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
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:bg-indigo-300 mt-2 shadow-lg shadow-indigo-200"
          >
            {loading ? 'Entrando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-slate-900 font-bold hover:underline">
            Regístrate aquí
          </Link>
        </p>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
                ← Volver a la tienda
            </Link>
        </div>
      </div>
    </div>
  )
}