import React, { useState, useEffect } from 'react';
import { Newspaper, ShieldCheck, ShieldAlert, Plus, BrainCircuit } from 'lucide-react';
import api from '../api/client';
import { useAppContext } from '../context/AppContext';

const NewsPage = ({ location: filterLocation }) => {
    const { t } = useAppContext();
    const [news, setNews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: '',
        location: '',
        lat: 19.0760,
        lng: 72.8777,
        is_verified: true
    });

    useEffect(() => {
        fetchNews();
    }, [filterLocation]);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const url = filterLocation ? `/news/?location=${encodeURIComponent(filterLocation)}` : '/news/';
            const { data } = await api.get(url);
            setNews(data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handlePostNews = async (e) => {
        e.preventDefault();
        if (!form.title || !form.location) return;

        try {
            await api.post('/news/', {
                ...form,
                lat: parseFloat(form.lat),
                lng: parseFloat(form.lng)
            });
            setShowForm(false);
            setForm({ title: '', location: '', lat: 19.0760, lng: 72.8777, is_verified: true });
            fetchNews();
        } catch (e) {
            console.error(e);
            alert('Failed to post news');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary flex items-center">
                        {filterLocation ? (
                            <>
                                <div className="relative mr-3">
                                    <BrainCircuit className="text-primary animate-pulse" size={32} />
                                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-ping"></div>
                                </div>
                                AI Local Alert Detector
                            </>
                        ) : (
                            <>
                                <Newspaper className="mr-3 text-primary" size={32} /> Disaster Feed
                            </>
                        )}
                    </h1>
                    <p className="text-text-secondary mt-1">
                        {filterLocation ? `AI is scanning for natural disasters near ${filterLocation}` : 'Real-time verified disaster intelligence network'}
                    </p>
                </div>
                {!filterLocation && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-panel border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg flex items-center transition"
                    >
                        <Plus size={18} className="mr-1" /> Add Alert
                    </button>
                )}
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-secondary animate-pulse italic">AI analyzing satellite feeds and local reports...</p>
                </div>
            )}

            {!loading && showForm && (
                <div className="bg-panel border border-primary rounded-2xl p-6 shadow-xl mb-8 animate-in fade-in zoom-in-95">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Broadcast Critical Alert</h2>
                    <form onSubmit={handlePostNews} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Alert Title</label>
                                <input
                                    type="text" required
                                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
                                    placeholder="e.g. Magnitude 6.5 Earthquake"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Affected Region / Camp Name</label>
                                <input
                                    type="text" required
                                    value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
                                    placeholder="Matches Camps to upgrade priority"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 pt-2">
                            <input
                                type="checkbox"
                                id="verified"
                                checked={form.is_verified}
                                onChange={e => setForm({ ...form, is_verified: e.target.checked })}
                                className="h-5 w-5 rounded bg-background border-border text-primary focus:ring-primary"
                            />
                            <label htmlFor="verified" className="text-text-primary font-medium flex items-center">
                                <ShieldCheck size={18} className="mr-1 text-low" />
                                Mark as Confirmed (Will upgrade priority for matching camps)
                            </label>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-text-secondary hover:text-text-primary mr-2">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-critical hover:bg-red-500 text-white rounded-lg font-bold transition">Publish Broadcast</button>
                        </div>
                    </form>
                </div>
            )}

            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-text-secondary border border-dashed border-border rounded-2xl bg-panel/30">
                            {filterLocation ? `No immediate threats detected in ${filterLocation}. System monitoring...` : 'No alerts active on the network.'}
                        </div>
                    ) : (
                        news.map(alert => (
                            <div key={alert.id} className="bg-panel border border-border hover:border-primary/50 rounded-2xl p-6 transition flex flex-col h-full group">
                                <div className="flex justify-between items-start mb-4">
                                    {alert.is_verified ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-low/10 text-low border border-low/20">
                                            <ShieldCheck size={12} className="mr-1" /> Verified Priority
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-text-secondary/10 text-text-secondary border border-border">
                                            <ShieldAlert size={12} className="mr-1" /> Unverified
                                        </span>
                                    )}
                                    <span className="text-xs text-text-secondary">{new Date(alert.date).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-lg font-bold text-text-primary mb-2 leading-tight group-hover:text-primary transition-colors">{alert.title}</h3>
                                <p className="text-text-secondary text-sm flex-1">{alert.location}</p>
                                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Global Intelligence</span>
                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NewsPage;
