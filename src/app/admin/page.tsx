"use client";

import { useState, useEffect } from "react";
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
import { Users, FileText, TrendingUp, Activity, MousePointer, Loader2 } from "lucide-react";
import { KPICard } from "@/components/admin/KPICard";
import { api } from "@/lib/api";
import type { DashboardData, AnalyticsDaily, AnalyticsContent } from "@/types";

const PIE_COLORS = ["#2563EB", "#0EA5E9", "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444"];

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dailyAnalytics, setDailyAnalytics] = useState<AnalyticsDaily[]>([]);
  const [contentAnalytics, setContentAnalytics] = useState<AnalyticsContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dashData, dailyData, contentData] = await Promise.all([
          api.admin.hub.dashboard(),
          api.admin.hub.analyticsDaily(),
          api.admin.hub.analyticsContent(),
        ]);
        setDashboard(dashData);
        setDailyAnalytics(dailyData);
        setContentAnalytics(contentData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatAmount = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(num || 0);
  };

  // Transform daily analytics for the traffic chart
  const trafficData = dailyAnalytics.map((d) => ({
    name: new Date(d.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
    value: d.totalVisits || 0,
  }));

  // Transform content analytics for the pie chart
  const contentDistribution = contentAnalytics?.categoryDistribution?.map((d, i) => ({
    name: d.category,
    value: d._count.id,
    color: PIE_COLORS[i % PIE_COLORS.length],
  })) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  const totalContent = (dashboard?.content.totalPrograms || 0) + (dashboard?.content.totalTestimonies || 0);

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
          title="Visiteurs Totaux"
          value={dashboard?.audience.totalVisits?.toLocaleString("fr-FR") || "0"}
          icon={Users}
          description="Visites totales"
        />
        <KPICard
          title="Contenus"
          value={totalContent.toLocaleString("fr-FR")}
          change={`${dashboard?.content.totalPrograms || 0} prog.`}
          changeType="neutral"
          icon={FileText}
          description={`${dashboard?.content.totalTestimonies || 0} temoignages`}
        />
        <KPICard
          title="Dons Recoltes"
          value={formatAmount(dashboard?.finances.totalDonations || "0")}
          change={`${dashboard?.finances.donorsCount || 0} donateurs`}
          changeType="positive"
          icon={TrendingUp}
          description="Total cumule"
        />
        <KPICard
          title="Temoignages en attente"
          value={dashboard?.content.pendingTestimonies || 0}
          change={`${dashboard?.content.activeAds || 0} pubs actives`}
          changeType="neutral"
          icon={Activity}
          description="A traiter"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Visitors Evolution Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Evolution du Trafic</h3>
          <div className="h-[300px] w-full">
            {trafficData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-slate-400">Aucune donnee disponible</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
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
            )}
          </div>
        </div>

        {/* Content Distribution Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Repartition des Contenus</h3>
          <div className="h-[300px] w-full">
            {contentDistribution.length === 0 ? (
              <div className="flex h-full items-center justify-center text-slate-400">Aucune donnee disponible</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {contentDistribution.map((entry, index) => (
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
            )}
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
                <h3 className="font-semibold text-slate-900 dark:text-white">Indice d&apos;Attractivite</h3>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Programmes</span>
                    <span className="font-bold text-slate-900 dark:text-white">{dashboard?.content.totalPrograms || 0}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${Math.min((dashboard?.content.totalPrograms || 0) / 5, 100)}%` }} />
                </div>

                <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-slate-500">Pubs actives</span>
                    <span className="font-bold text-slate-900 dark:text-white">{dashboard?.content.activeAds || 0}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500" style={{ width: `${Math.min((dashboard?.content.activeAds || 0) * 10, 100)}%` }} />
                </div>
            </div>
         </div>

         {/* Content Stats */}
         <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Detail des Contenus</h3>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Programmes</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{dashboard?.content.totalPrograms || 0}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Temoignages</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{dashboard?.content.totalTestimonies || 0}</p>
                    <p className="text-xs text-orange-500 mt-1">
                        {dashboard?.content.pendingTestimonies || 0} en attente
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Donateurs</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{dashboard?.finances.donorsCount || 0}</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
