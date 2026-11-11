import React, { useState, useEffect } from 'react';
import { Package, ShieldAlert, BarChart3, AlertTriangle, ListFilter } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import api from '../api/client';
import { useAppContext } from '../context/AppContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { t, theme } = useAppContext();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/analytics/summary');
            setStats(data);
        } catch (e) {
            console.error(e);
        }
    };

    if (!stats) return <div className="text-text-secondary p-8">Loading dashboard...</div>;

    const isDark = theme === 'dark';
    const textColor = isDark ? '#9CA3AF' : '#4B5563';
    const gridColor = isDark ? '#374151' : '#E5E7EB';

    const barData = {
        labels: Object.keys(stats.demand_by_category),
        datasets: [
            {
                label: 'Current Demand',
                data: Object.values(stats.demand_by_category),
                backgroundColor: 'rgb(var(--critical))',
            },
            {
                label: 'Available Supply',
                data: Object.keys(stats.demand_by_category).map(k => stats.supply_by_category[k] || 0),
                backgroundColor: 'rgb(var(--low))',
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: textColor } },
            title: { display: false },
        },
        scales: {
            y: { ticks: { color: textColor }, grid: { color: gridColor } },
            x: { ticks: { color: textColor }, grid: { display: false } }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mt-2 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">{t('dashboard')}</h1>
                    <p className="text-text-secondary mt-1">Real-time overview of disaster relief operations</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-panel border border-border rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-text-secondary/10 group-hover:text-primary/10 transition">
                        <Package size={120} />
                    </div>
                    <div className="relative z-10 flex items-center space-x-4 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-low/20 text-low flex items-center justify-center">
                            <Package size={20} />
                        </div>
                        <h3 className="text-text-secondary font-medium">Total Supply (Units)</h3>
                    </div>
                    <p className="text-4xl font-bold text-text-primary relative z-10">{stats.total_supply}</p>
                </div>

                <div className="bg-panel border border-border rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-text-secondary/10 group-hover:text-critical/10 transition">
                        <AlertTriangle size={120} />
                    </div>
                    <div className="relative z-10 flex items-center space-x-4 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-critical/20 text-critical flex items-center justify-center">
                            <AlertTriangle size={20} />
                        </div>
                        <h3 className="text-text-secondary font-medium">Total Demand (Units)</h3>
                    </div>
                    <p className="text-4xl font-bold text-text-primary relative z-10">{stats.total_demand}</p>
                </div>

                <div className="bg-panel border border-border rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-text-secondary/10 group-hover:text-high/10 transition">
                        <ShieldAlert size={120} />
                    </div>
                    <div className="relative z-10 flex items-center space-x-4 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-high/20 text-high flex items-center justify-center">
                            <ShieldAlert size={20} />
                        </div>
                        <h3 className="text-text-secondary font-medium">Verified Active Alerts</h3>
                    </div>
                    <p className="text-4xl font-bold text-text-primary relative z-10">{stats.total_alerts}</p>
                </div>

                <div className="bg-panel border border-border rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-text-secondary/10 group-hover:text-primary/10 transition">
                        <BarChart3 size={120} />
                    </div>
                    <div className="relative z-10 flex items-center space-x-4 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                            <BarChart3 size={20} />
                        </div>
                        <h3 className="text-text-secondary font-medium">Total Allocations</h3>
                    </div>
                    <p className="text-4xl font-bold text-text-primary relative z-10">{stats.total_allocations}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-panel border border-border rounded-2xl p-6 flex flex-col items-center justify-center">
                    <div className="w-full flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-text-primary flex items-center"><ListFilter className="mr-2 h-5 w-5 text-primary" /> Supply vs Demand</h3>
                    </div>
                    <div className="w-full relative h-[300px]">
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
