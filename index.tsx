'use client'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b1020] to-[#05070f] text-white px-6">
      
      {/* HERO */}
      <section className="max-w-6xl mx-auto py-32 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          אוטומציה עסקית שעובדת בשבילך
        </motion.h1>

        <p className="mt-6 text-xl text-gray-300">
          אני טויבא דויטשר – בונה מערכות אוטומטיות שחוסכות זמן, כסף ועצבים
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <a href="#contact" className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold">
            דברי איתי
          </a>
          <a href="#projects" className="px-8 py-4 rounded-xl border border-cyan-400 text-cyan-300">
            תיק עבודות
          </a>
        </div>
      </section>

      {/* WHAT I DO */}
      <section className="max-w-6xl mx-auto py-24 grid md:grid-cols-3 gap-8">
        {[
          'אוטומציות לעסקים',
          'חיבורים בין מערכות',
          'טפסים חכמים ו-CRM'
        ].map((item, i) => (
          <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-semibold mb-2">{item}</h3>
            <p className="text-gray-400">
              פתרונות מותאמים אישית שעובדים ברקע – בלי התעסקות ידנית.
            </p>
          </div>
        ))}
      </section>

      {/* PROJECTS */}
      <section id="projects" className="max-w-6xl mx-auto py-24">
        <h2 className="text-4xl font-bold mb-10">תיק עבודות</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "https://form.fillout.com/t/hxPcTnn2CVus",
            "https://form.fillout.com/t/3SJjK1C6dUus",
            "https://form.fillout.com/t/rfV33PGun3us"
          ].map((link, i) => (
            <a 
              key={i} 
              href={link} 
              target="_blank"
              className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10 hover:scale-105 transition"
            >
              פרויקט אוטומציה #{i + 1}
            </a>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-6xl mx-auto py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">בואי נבנה משהו חכם</h2>
        <p className="text-gray-300 mb-8">
          📧 t025959714@gmail.com <br />
          📞 052-7179418
        </p>

        <a 
          href="https://wa.me/972527179418"
          className="inline-block px-10 py-4 bg-green-500 rounded-xl font-semibold text-black"
        >
          שלחי WhatsApp
        </a>
      </section>

    </main>
  )
}
