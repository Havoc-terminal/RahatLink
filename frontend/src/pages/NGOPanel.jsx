import React, { useState, useEffect } from 'react';
import { FormInput, ListChecks } from 'lucide-react';
import api from '../api/client';
import { useAppContext } from '../context/AppContext';
import ChatBox from '../components/ChatBox';

const NGOPanel = () => {
    const { t } = useAppContext();
    const [needs, setNeeds] = useState([]);
    const [itemType, setItemType] = useState('Food');
    const [quantity, setQuantity] = useState('');
    const [urgency, setUrgency] = useState('Medium');
    const [loading, setLoading] = useState(false);
    const [activeChat, setActiveChat] = useState(null); // { id, ngoName }

    const campId = localStorage.getItem('rahatlink_entity_id') || 1;

    useEffect(() => {
        fetchNeeds();
    }, [campId]);

    const fetchNeeds = async () => {
        try {
            const { data } = await api.get(`/camps/${campId}/needs`);
            setNeeds(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handlePostNeed = async (e) => {
        e.preventDefault();
        if (!quantity || isNaN(quantity) || quantity <= 0) return;

        setLoading(true);
        try {
            await api.post(`/camps/${campId}/needs`, {
                item_type: itemType,
                quantity: parseInt(quantity),
                urgency: urgency
            });
            setQuantity('');
            fetchNeeds();
        } catch (e) {
            console.error(e);
            alert('Failed to post need request');
        }
        setLoading(false);
    };

    const statusColors = {
        'Pending': 'bg-text-secondary/20 text-text-secondary',
        'Partial': 'bg-high/20 text-high',
        'Fulfilled': 'bg-low/20 text-low'
    };

    const urgencyColors = {
        'Low': 'text-low',
        'Medium': 'text-high',
        'High': 'text-primary',
        'Critical': 'text-critical font-bold'
    };

    const [victimRequests, setVictimRequests] = useState([]);
    const [fetchingVictims, setFetchingVictims] = useState(false);

    useEffect(() => {
        fetchVictimRequests();
    }, []);

    const fetchVictimRequests = async () => {
        setFetchingVictims(true);
        try {
            const { data } = await api.get('/victim-requests');
            setVictimRequests(data);
        } catch (e) {
            console.error("Error fetching victim requests:", e);
        }
        setFetchingVictims(false);
    };

    const handleUpdateVictimRequest = async (reqId, status) => {
        try {
            const ngoName = "NGO-" + campId; // Simplified for demo
            await api.patch(`/victim-requests/${reqId}`, { status, ngo: ngoName });
            fetchVictimRequests();
        } catch (e) {
            console.error("Error updating request:", e);
            alert("Failed to update request");
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">NGO {t('request')} Panel</h1>
                    <p className="text-text-secondary mt-1">Submit resource needs and track fulfillment status</p>
                </div>
                <button 
                    onClick={fetchVictimRequests}
                    disabled={fetchingVictims}
                    className="p-2 text-primary hover:bg-primary/10 rounded-full transition"
                >
                    <ListChecks className={fetchingVictims ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Victim Requests Section */}
            <div className="bg-panel border border-border rounded-2xl p-6">
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
                    <FormInput className="mr-2 text-primary" size={24} /> Victim Aid Requests
                </h2>
                
                {victimRequests.length === 0 ? (
                    <div className="py-10 text-center text-text-secondary border border-dashed border-border rounded-xl">
                        No victim requests currently assigned to your area.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {victimRequests.map(req => (
                            <div key={req.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background/50 border border-border rounded-xl hover:border-primary/30 transition">
                                <div className="mb-4 md:mb-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-xs font-bold text-text-secondary bg-border px-2 py-0.5 rounded">{req.id}</span>
                                        <h4 className="font-bold text-text-primary">{req.type} — {req.qty}</h4>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${statusColors[req.status.charAt(0).toUpperCase() + req.status.slice(1)] || 'bg-border text-text-primary'}`}>
                                            {req.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-secondary flex items-center gap-4">
                                        <span>Time: {req.time}</span>
                                        {req.ngo && <span>Assigned to: {req.ngo}</span>}
                                    </p>
                                </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setActiveChat({ id: req.id, ngoName: req.ngo || 'Victim' })}
                                            className="p-2 text-text-secondary hover:text-primary transition"
                                            title="Chat"
                                        >
                                            <ListChecks size={20} />
                                        </button>
                                        {req.status === 'pending' && (
                                        <>
                                            <button 
                                                onClick={() => handleUpdateVictimRequest(req.id, 'accepted')}
                                                className="px-4 py-2 bg-low hover:bg-green-600 text-white text-sm font-bold rounded-lg transition"
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateVictimRequest(req.id, 'rejected')}
                                                className="px-4 py-2 bg-critical/20 hover:bg-critical/30 text-critical text-sm font-bold rounded-lg transition"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {req.status !== 'pending' && (
                                        <button 
                                            onClick={() => handleUpdateVictimRequest(req.id, 'pending')}
                                            className="px-4 py-2 text-text-secondary hover:text-text-primary text-xs font-medium"
                                        >
                                            Reset Status
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-panel border border-border rounded-2xl p-6 h-fit">
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
                        <FormInput className="mr-2 text-primary" size={24} /> {t('addRequest')}
                    </h2>

                    <form onSubmit={handlePostNeed} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">{t('category')}</label>
                            <select
                                value={itemType}
                                onChange={e => setItemType(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition"
                            >
                                <option>Food</option>
                                <option>Water</option>
                                <option>Medical Kits</option>
                                <option>Essentials</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Quantity Required</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition"
                                placeholder="0"
                                min="1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Urgency Level</label>
                            <select
                                value={urgency}
                                onChange={e => setUrgency(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition"
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl transition disabled:opacity-50 mt-4"
                        >
                            {t('submit')}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 bg-panel border border-border rounded-2xl p-6 min-h-[400px]">
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
                        <ListChecks className="mr-2 text-primary" size={24} /> {t('trackOrder')}
                    </h2>

                    {needs.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-text-secondary border border-dashed border-border rounded-xl">
                            No active requests. Submit one above.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border text-text-secondary">
                                        <th className="pb-3 font-medium">Item Req</th>
                                        <th className="pb-3 font-medium">Urgency</th>
                                        <th className="pb-3 font-medium">Pending Qty</th>
                                        <th className="pb-3 font-medium text-right">Fulfillment Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {needs.map(need => (
                                        <tr key={need.id} className="hover:bg-background/50 transition">
                                            <td className="py-4 font-medium text-text-primary">{need.item_type}</td>
                                            <td className="py-4">
                                                <span className={urgencyColors[need.urgency]}>{need.urgency}</span>
                                            </td>
                                            <td className="py-4 font-medium text-text-primary">{need.quantity} Units</td>
                                            <td className="py-4 text-right">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[need.status]}`}>
                                                    {need.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            {activeChat && (
                <ChatBox 
                    requestId={activeChat.id} 
                    sender="ngo" 
                    ngoName={activeChat.ngoName}
                    onClose={() => setActiveChat(null)} 
                />
            )}
        </div>
    );
};

export default NGOPanel;
