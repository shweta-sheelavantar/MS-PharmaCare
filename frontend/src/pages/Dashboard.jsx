import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Pill, Heart, ShieldCheck, Truck, Clock, AlertTriangle, Phone, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const quickActions = [
  { label: 'Order Medicines', icon: Pill, color: 'bg-sky-600 text-sky-600', path: '#' },
  { label: 'Health Checkup', icon: Heart, color: 'bg-red-100 text-red-500', path: '#' },
  { label: 'My Prescriptions', icon: ShieldCheck, color: 'bg-sky-600 text-sky-600', path: '#' },
  { label: 'Track Order', icon: Truck, color: 'bg-purple-100 text-purple-500', path: '#' },
]

const healthTips = [
  { icon: Clock, text: 'Take medicines on time for best results.', color: 'text-sky-600' },
  { icon: AlertTriangle, text: 'Always check expiry dates before consuming.', color: 'text-amber-500' },
  { icon: Heart, text: 'Stay hydrated and maintain a balanced diet.', color: 'text-red-400' },
  { icon: Pill, text: 'Never skip doses without consulting your doctor.', color: 'text-sky-600' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.userName?.split(' ')[0] || 'User'

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-sky-50 to-sky-100 rounded-2xl p-8 text-white shadow-lg shadow-sky-500/30/20">
        <h1 className="text-3xl font-bold mb-2">Hello, {firstName}!</h1>
        <p className="text-sky-600 text-lg">
          Welcome to MS PharmaCare — Your trusted health companion.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="card hover:scale-105 transition-transform duration-200 flex flex-col items-center gap-3 p-6 text-center group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon size={28} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Health Tips</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {healthTips.map((tip, i) => (
            <div key={i} className="card flex items-start gap-3">
              <tip.icon size={20} className={tip.color} />
              <p className="text-sm text-gray-600">{tip.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="card bg-gradient-to-r from-sky-50 to-sky-100 border-sky-500">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center">
            <Phone className="text-sky-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Need help?</h3>
            <p className="text-sm text-gray-500">Contact our support team for assistance.</p>
          </div>
          <button className="text-sky-600 hover:text-sky-700 font-semibold text-sm flex items-center gap-1">
            Call Now <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
