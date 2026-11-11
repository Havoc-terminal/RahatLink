import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, PackageSearch, ClipboardList,
  MapPin, Phone, Mail, ChevronRight, CheckCircle2, Clock,
  XCircle, Droplets, UtensilsCrossed, Pill, Package, LogOut,
  Send, AlertTriangle, Sun, Moon, Languages, Newspaper
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import NewsPage from './NewsPage';
import ChatBox from '../components/ChatBox';

// ── DUMMY DATA ──────────────────────────────────────────────────────────────
const NEARBY_NGOS = [
  { id: 1, name: 'Red Relief Foundation', category: 'Medical Aid', location: 'New Delhi', distance: '1.2 km', isOpen: true, phone: '+91 98100 11234', email: 'contact@redrelief.org', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=80&h=80&fit=crop', color: '#ef4444', materials: [{ name: 'Medicine Kits', icon: 'pill', stock: 'High', qty: 200, unit: 'kits' }] },
  { id: 2, name: 'Sahayata Sewa Sangh', category: 'Food & Water', location: 'Mumbai', distance: '2.5 km', isOpen: true, phone: '+91 98200 55678', email: 'help@sahayatasewa.org', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=80&h=80&fit=crop', color: '#3b82f6', materials: [{ name: 'Food Packets', icon: 'food', stock: 'High', qty: 500, unit: 'packets' }] },
];

const DUMMY_REQUESTS = [
  { id: 'REQ-001', type: 'Food', qty: '50 packets', status: 'accepted', ngo: 'Sahayata Sewa Sangh', time: '2 hours ago' },
  { id: 'REQ-002', type: 'Medicine', qty: '10 kits', status: 'pending', ngo: 'Red Relief Foundation', time: '4 hours ago' },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────
const stockColor = (s) => s === 'High' ? 'rgb(var(--low))' : s === 'Medium' ? 'rgb(var(--high))' : 'rgb(var(--critical))';

const MaterialIcon = ({ icon, size = 20 }) => {
  if (icon === 'water') return <Droplets size={size} />;
  if (icon === 'food') return <UtensilsCrossed size={size} />;
  if (icon === 'pill') return <Pill size={size} />;
  return <Package size={size} />;
};

const StatusBadge = ({ status }) => {
  const { t } = useAppContext();
  const cfg = {
    accepted: { color: 'rgb(var(--low))', bg: 'rgb(var(--low) / 0.1)', icon: <CheckCircle2 size={14} />, label: t('accepted') },
    pending:  { color: 'rgb(var(--high))', bg: 'rgb(var(--high) / 0.1)', icon: <Clock size={14} />, label: t('pending') },
    rejected: { color: 'rgb(var(--critical))', bg: 'rgb(var(--critical) / 0.1)', icon: <XCircle size={14} />, label: t('rejected') },
  }[status] || {};
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 700, border: `1px solid ${cfg.color}` }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

// ── NGO MATERIALS MODAL ───────────────────────────────────────────────────────
const NGOMaterialsModal = ({ ngo, onClose }) => {
  const { t } = useAppContext();
  if (!ngo) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'rgb(var(--panel))', border: '1px solid rgb(var(--border))', borderRadius: 24, width: '100%', maxWidth: 440, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgb(var(--border))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={ngo.image} alt={ngo.name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }} />
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'rgb(var(--text-primary))' }}>{ngo.name}</h3>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: ngo.color + '22', color: ngo.color }}>{ngo.category}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 24px' }}>
          <p style={{ color: 'rgb(var(--text-secondary))', fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{t('essentials')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ngo.materials.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(var(--background) / 0.5)', borderRadius: 12, padding: '12px 16px', border: '1px solid rgb(var(--border))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgb(var(--text-primary))' }}>
                  <div style={{ color: stockColor(m.stock) }}><MaterialIcon icon={m.icon} /></div>
                  <span style={{ fontWeight: 600 }}>{m.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'rgb(var(--text-primary))', fontSize: 14 }}>{m.qty} {m.unit}</div>
                  <div style={{ fontSize: 11, color: stockColor(m.stock), fontWeight: 600 }}>{m.stock} Stock</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '0 24px 20px', display: 'flex', gap: 10 }}>
          <a href={`tel:${ngo.phone}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', background: 'rgb(var(--low) / 0.1)', border: '1px solid rgb(var(--low) / 0.3)', borderRadius: 12, color: 'rgb(var(--low))', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
            <Phone size={16} /> {t('phone')}
          </a>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'rgb(var(--background) / 0.2)', border: '1px solid rgb(var(--border))', borderRadius: 12, color: 'rgb(var(--text-secondary))', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ── NGO CARD ─────────────────────────────────────────────────────────────────
const NGOCard = ({ ngo, onClick }) => {
  const { t } = useAppContext();
  return (
    <div
      onClick={() => onClick(ngo)}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'rgb(var(--panel))', border: '1px solid rgb(var(--border))', borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s' }}
      className="hover:border-primary/50"
    >
      <img src={ngo.image} alt={ngo.name} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, color: 'rgb(var(--text-primary))', fontSize: '0.95rem' }}>{ngo.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, color: 'rgb(var(--text-secondary))', fontSize: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={11} />{ngo.distance}</span>
          <span style={{ color: ngo.color }}>{ngo.category}</span>
        </div>
      </div>
      <ChevronRight size={18} style={{ color: 'rgb(var(--text-secondary))' }} />
    </div>
  );
};

// ── DASHBOARD TAB ─────────────────────────────────────────────────────────────
const DashboardTab = ({ victim, onNGOClick }) => {
  const { t } = useAppContext();
  const openNGOs = NEARBY_NGOS.filter(n => n.isOpen);
  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ background: 'linear-gradient(135deg, rgb(var(--primary) / 0.1), rgb(var(--critical) / 0.1))', border: '1px solid rgb(var(--primary) / 0.2)', borderRadius: 16, padding: '16px 20px', marginBottom: 24 }}>
        <p style={{ color: 'rgb(var(--primary))', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{t('brand')} Profile</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgb(var(--text-primary))' }}><Phone size={14} style={{ color: 'rgb(var(--primary))' }} />{victim.phone || '+91 99999 00000'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgb(var(--text-primary))' }}><MapPin size={14} style={{ color: 'rgb(var(--primary))' }} />{victim.location || 'Location detected'}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[{ label: t('nearbyNgos'), val: openNGOs.length, color: 'rgb(var(--low))' }, { label: t('addRequest'), val: 3, color: 'rgb(var(--primary))' }, { label: t('accepted'), val: 1, color: 'rgb(var(--primary))' }].map(s => (
          <div key={s.label} style={{ background: 'rgb(var(--panel))', border: '1px solid rgb(var(--border))', borderRadius: 14, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'rgb(var(--text-secondary))', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <h3 style={{ color: 'rgb(var(--text-primary))', fontWeight: 700, marginBottom: 14, fontSize: '1rem' }}>{t('nearbyNgos')}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {openNGOs.map(ngo => <NGOCard key={ngo.id} ngo={ngo} onClick={onNGOClick} />)}
      </div>
    </div>
  );
};

// ── NEARBY NGOS TAB ──────────────────────────────────────────────────────────
const NearbyNGOsTab = ({ onNGOClick }) => {
  const { t } = useAppContext();
  return (
    <div style={{ padding: '24px 0' }}>
      <p style={{ color: 'rgb(var(--text-secondary))', fontSize: 13, marginBottom: 18 }}>{t('nearbyNgos')}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {NEARBY_NGOS.map(ngo => <NGOCard key={ngo.id} ngo={ngo} onClick={onNGOClick} />)}
      </div>
    </div>
  );
};

// ── TRACK ORDER TAB ───────────────────────────────────────────────────────────
const TrackOrderTab = ({ onChatClick }) => {
  const { t } = useAppContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/victim-requests');
      const data = await res.json();
      setRequests(data);
    } catch (e) {
      console.error("Error fetching requests:", e);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <p style={{ color: 'rgb(var(--text-secondary))', fontSize: 13 }}>{t('trackOrder')}</p>
        <button onClick={fetchRequests} style={{ background: 'none', border: 'none', color: 'rgb(var(--primary))', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
          {loading ? '...' : 'Refresh'}
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {requests.length === 0 && !loading && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'rgb(var(--text-secondary))', border: '1px border-dashed rgb(var(--border))', borderRadius: 16 }}>
            No requests found.
          </div>
        )}
        {requests.map(req => (
          <div key={req.id} style={{ background: 'rgb(var(--panel))', border: '1px solid rgb(var(--border))', borderRadius: 16, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 11, color: 'rgb(var(--text-secondary))', fontWeight: 600 }}>{req.id}</span>
                <h4 style={{ color: 'rgb(var(--text-primary))', fontWeight: 700, marginTop: 2 }}>{t(req.type.toLowerCase()) || req.type} — {req.qty}</h4>
              </div>
              <StatusBadge status={req.status} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 16, color: 'rgb(var(--text-secondary))', fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={12} />{req.ngo}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} />{req.time}</span>
              </div>
              {req.status === 'accepted' && (
                <button 
                    onClick={() => onChatClick({ id: req.id, ngoName: req.ngo })}
                    style={{ background: 'rgb(var(--primary) / 0.1)', border: '1px solid rgb(var(--primary) / 0.3)', color: 'rgb(var(--primary))', borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    Chat with NGO
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── REQUEST TAB ───────────────────────────────────────────────────────────────
const RequestTab = ({ victim }) => {
  const { t } = useAppContext();
  const [form, setForm] = useState({ type: 'food', qty: '', urgency: 'Medium', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('http://localhost:8000/api/victim-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phone: victim.phone, lat: victim.lat, lng: victim.lng }),
      });
      setTimeout(() => { 
        setLoading(false); 
        setSubmitted(true); 
      }, 1000);
    } catch (_) {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div style={{ padding: '60px 0', textAlign: 'center' }}>
      <CheckCircle2 size={64} style={{ color: 'rgb(var(--low))', margin: '0 auto 16px' }} />
      <h3 style={{ color: 'rgb(var(--text-primary))', fontWeight: 800, fontSize: '1.4rem', marginBottom: 8 }}>{t('status')}: {t('accepted')}</h3>
      <p style={{ color: 'rgb(var(--text-secondary))', marginBottom: 20 }}>Your request has been submitted to nearby NGOs.</p>
      <button onClick={() => setSubmitted(false)} style={{ padding: '10px 28px', borderRadius: 12, background: 'linear-gradient(135deg,rgb(var(--primary)),#ef4444)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
        Submit Another
      </button>
    </div>
  );

  const inputStyle = { width: '100%', padding: '11px 14px', background: 'rgb(var(--background) / 0.5)', border: '1px solid rgb(var(--border))', borderRadius: 12, color: 'rgb(var(--text-primary))', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ padding: '24px 0' }}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ color: 'rgb(var(--text-secondary))', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('category')} *</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
            {['food', 'water', 'medicine', 'shelter'].map(tk => (
              <button type="button" key={tk} onClick={() => setForm(f => ({ ...f, type: tk }))}
                style={{ padding: '10px', borderRadius: 10, border: `1px solid ${form.type === tk ? 'rgb(var(--primary))' : 'rgb(var(--border))'}`, background: form.type === tk ? 'rgb(var(--primary) / 0.1)' : 'rgb(var(--panel))', color: form.type === tk ? 'rgb(var(--primary))' : 'rgb(var(--text-secondary))', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <MaterialIcon icon={tk} size={14} /> {t(tk)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ color: 'rgb(var(--text-secondary))', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Quantity *</label>
          <input required value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} style={inputStyle} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 14, background: loading ? 'rgb(var(--border))' : 'linear-gradient(135deg,rgb(var(--primary)),#ef4444)', border: 'none', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? '...' : t('submit')}
        </button>
      </form>
    </div>
  );
};

// ── MAIN VICTIM PORTAL ────────────────────────────────────────────────────────
const VictimPortal = () => {
  const navigate = useNavigate();
  const { t, theme, toggleTheme, language, setLanguage } = useAppContext();
  const location = useLocation();
  const victim = location.state || {};
   const [activeTab, setActiveTab] = useState('dashboard');
   const [selectedNGO, setSelectedNGO] = useState(null);
   const [activeChat, setActiveChat] = useState(null);

  const TABS = [
    { id: 'dashboard',  label: t('dashboard'),   icon: LayoutDashboard },
    { id: 'ngos',       label: t('nearbyNgos'), icon: Building2 },
    { id: 'track',      label: t('trackOrder'),  icon: PackageSearch },
    { id: 'request',    label: t('request'),    icon: ClipboardList },
    { id: 'news',       label: t('news'),       icon: Newspaper },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'rgb(var(--background))', color: 'rgb(var(--text-primary))', transition: 'background-color 0.3s' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgb(var(--panel) / 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgb(var(--border))', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="RahatLink" style={{ height: 36, width: 'auto', borderRadius: 6 }} />
          <span style={{ fontWeight: 800, color: 'rgb(var(--primary))', letterSpacing: '0.05em' }}>{t('brand')}</span>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title={t('theme')}>
            {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-600" />}
          </button>
          
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-background text-xs border border-border p-1 rounded text-text-primary">
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="gu">GU</option>
            <option value="mr">MR</option>
            <option value="ta">TA</option>
            <option value="te">TE</option>
          </select>

          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 10, background: 'transparent', border: '1px solid rgb(var(--border))', color: 'rgb(var(--text-secondary))', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
            <LogOut size={14} /> {t('logout')}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6, padding: '16px 0 0' }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', borderRadius: 14, border: `1px solid ${active ? 'rgb(var(--primary))' : 'rgb(var(--border))'}`, background: active ? 'rgb(var(--primary) / 0.1)' : 'rgb(var(--panel))', color: active ? 'rgb(var(--primary))' : 'rgb(var(--text-secondary))', fontWeight: active ? 700 : 500, fontSize: 11, cursor: 'pointer', transition: 'all 0.2s' }}>
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
        {activeTab === 'dashboard' && <DashboardTab victim={victim} onNGOClick={setSelectedNGO} />}
        {activeTab === 'ngos' && <NearbyNGOsTab onNGOClick={setSelectedNGO} />}
        {activeTab === 'track' && <TrackOrderTab onChatClick={setActiveChat} />}
        {activeTab === 'request' && <RequestTab victim={victim} />}
        {activeTab === 'news' && <div style={{padding: '24px 0'}}><NewsPage location={victim.location} /></div>}
      </div>
      <NGOMaterialsModal ngo={selectedNGO} onClose={() => setSelectedNGO(null)} />
      {activeChat && (
        <ChatBox 
            requestId={activeChat.id} 
            sender="victim" 
            ngoName={activeChat.ngoName} 
            onClose={() => setActiveChat(null)} 
        />
      )}
    </div>
  );
};

export default VictimPortal;
