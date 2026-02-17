"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Users, FileText, TrendingUp, Activity, MousePointer } from "lucide-react";
import { KPICard } from "@/components/admin/KPICard";

const VISITORS_DATA = [
  { name: "Lun", value: 4000 },
  { name: "Mar", value: 3000 },
  { name: "Mer", value: 5000 },
  { name: "Jeu", value: 2780 },
  { name: "Ven", value: 1890 },
  { name: "Sam", value: 6390 },
  { name: "Dim", value: 3490 },
];

const CONTENT_DISTRIBUTION = [
  { name: "Témoignages", value: 400, color: "#2563EB" }, // blue-600
  { name: "Programmes", value: 300, color: "#0EA5E9" }, // sky-500
  { name: "Projets", value: 300, color: "#6366F1" }, // indigo-500
  { name: "Directs", value: 200, color: "#8B5CF6" }, // violet-500
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tableau de Bord</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Vue d&apos;ensemble des performances de la plateforme.
        </p>
      </div>

      {/* KPIs Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Visiteurs Uniques"
          value="12,345"
          change="+12%"
          changeType="positive"
          icon={Users}
          description="vs mois dernier"
        />
        <KPICard
          title="Contenus Publiés"
          value="1,234"
          change="+5"
          changeType="neutral"
          icon={FileText}
          description="nouveaux cette semaine"
        />
        <KPICard
          title="Dons Récoltés"
          value="45,200 €"
          change="+8.2%"
          changeType="positive"
          icon={TrendingUp}
          description="Total cumulé"
        />
        <KPICard
          title="Taux d'Engagement"
          value="24.5%"
          change="-2.1%"
          changeType="negative"
          icon={Activity}
          description="Interactions / Vues"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Visitors Evolution Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Évolution du Trafic</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VISITORS_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Distribution Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Répartition des Contenus</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CONTENT_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CONTENT_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Stats Row */}
      <div className="grid gap-6 md:grid-cols-3">
         {/* Attractiveness Index */}
         <div className="col-span-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                    <MousePointer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Indice d&apos;Attractivité</h3>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Vues par contenu (moyenne)</span>
                    <span className="font-bold text-slate-900 dark:text-white">1,204</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[70%]" />
                </div>
                
                <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-slate-500">Taux de clic (CTR) Pubs</span>
                    <span className="font-bold text-slate-900 dark:text-white">3.8%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 w-[45%]" />
                </div>
            </div>
         </div>

         {/* Content Stats */}
         <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Détail des Contenus</h3>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Programmes</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">450</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +12
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Témoignages</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">890</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +24
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Projets</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12</p>
                    <p className="text-xs text-slate-400 mt-1">
                        Stable
                    </p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
