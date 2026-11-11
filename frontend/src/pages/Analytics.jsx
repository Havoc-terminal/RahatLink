import React, { useState, useEffect } from 'react';
import { DownloadCloud, Table2 } from 'lucide-react';
import api from '../api/client';
import { useAppContext } from '../context/AppContext';

const Analytics = () => {
    const { t } = useAppContext();
    const [allocations, setAllocations] = useState([]);

    useEffect(() => {
        fetchAllocations();
    }, []);

    const fetchAllocations = async () => {
        try {
            const { data } = await api.get('/allocations/');
            setAllocations(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleExport = () => {
        const headers = "ID,Warehouse ID,Camp ID,Item Type,Quantity,Date\n";
        const rows = allocations.map(a => `${a.id},${a.warehouse_id},${a.camp_id},${a.item_type},${a.qty},${new Date(a.created_at).toLocaleString()}`).join("\n");

        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rahatlink_allocations_${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary flex items-center">
                        <Table2 className="mr-3 text-primary" size={32} /> Analytics Center
                    </h1>
                    <p className="text-text-secondary mt-1">Detailed view of historic distribution logs</p>
                </div>
                <button
                    onClick={handleExport}
                    className="bg-panel border border-border hover:bg-background text-text-primary px-4 py-2 rounded-lg flex items-center transition"
                >
                    <DownloadCloud size={18} className="mr-2" /> Export to CSV
                </button>
            </div>

            <div className="bg-panel border border-border rounded-2xl p-6 mt-6 overflow-hidden">
                {allocations.length === 0 ? (
                    <div className="py-12 text-center text-text-secondary">
                        No allocation history available yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border text-text-secondary">
                                    <th className="pb-4 font-medium px-4">Log ID</th>
                                    <th className="pb-4 font-medium px-4">Warehouse</th>
                                    <th className="pb-4 font-medium px-4">Destination Camp</th>
                                    <th className="pb-4 font-medium px-4">Item Type</th>
                                    <th className="pb-4 font-medium text-right px-4">Quantity Dispatched</th>
                                    <th className="pb-4 font-medium text-right px-4">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {allocations.map(alloc => (
                                    <tr key={alloc.id} className="hover:bg-background/40 transition">
                                        <td className="py-4 px-4 text-text-secondary">#{alloc.id}</td>
                                        <td className="py-4 px-4 text-text-primary">WH-{alloc.warehouse_id}</td>
                                        <td className="py-4 px-4 text-text-primary">CAMP-{alloc.camp_id}</td>
                                        <td className="py-4 px-4 text-primary font-medium">{alloc.item_type}</td>
                                        <td className="py-4 px-4 text-right font-bold text-low">{alloc.qty}</td>
                                        <td className="py-4 px-4 text-right text-sm text-text-secondary">{new Date(alloc.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
