// components/TicketButtons.tsx
'use client'

import Link from 'next/link'

export default function TicketButtons() {
  
  const handleDownloadPDF = async () => {
    // 👇 AQUÍ ESTÁ EL CAMBIO: agregamos "as any" al final
    const html2pdf = (await import('html2pdf.js')).default as any
    
    const element = document.getElementById('ticket-content')
    
    // Protección: si no encuentra el ticket, no hace nada
    if (!element) return 
    
    const opt = {
      margin:       [10, 10],
      filename:     `ticket-${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    html2pdf().set(opt).from(element).save()
  }

  return (
    <div className="bg-gray-50 p-4 border-t border-gray-100 print:hidden flex flex-col gap-3">
      
      <button 
        onClick={handleDownloadPDF}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        DESCARGAR PDF
      </button>

      <button 
        onClick={() => window.print()} 
        className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        IMPRIMIR
      </button>
      
      <Link href="/" className="block w-full text-center py-3 rounded-lg font-bold text-slate-600 hover:bg-gray-200 transition">
        Nueva Compra
      </Link>
    </div>
  )
}