import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, X, CheckCircle, AlertTriangle, Building2, UserCircle2, Navigation, Sun, Moon, Languages } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// ── VICTIM LOGIN MODAL ────────────────────────────────────────────────────────
const VictimLoginModal = ({ onClose, onLogin }) => {
  const { t } = useAppContext();
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const getGPS = () => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setGpsLoading(false);
      },
      () => { setGpsLoading(false); setLocation('GPS unavailable'); }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ phone, location, lat, lng });
  };

  const inputStyle = { width: '100%', padding: '11px 14px', background: 'var(--background)', opacity: 0.8, border: '1px solid rgb(var(--border))', borderRadius: 12, color: 'rgb(var(--text-primary))', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'rgb(var(--panel))', border: '1px solid rgb(var(--border))', borderRadius: 24, width: '100%', maxWidth: 420, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid rgb(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,rgb(var(--primary)),#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCircle2 size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ color: 'rgb(var(--text-primary))', fontWeight: 800, fontSize: '1.1rem', marginBottom: 2 }}>{t('victimLogin')}</h2>
              <p style={{ color: 'rgb(var(--text-secondary))', fontSize: 12 }}>Enter your details to get help</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgb(var(--text-secondary))', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ color: 'rgb(var(--text-secondary))', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>📱 {t('phone')} *</label>
            <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" type="tel" style={inputStyle} />
          </div>
          <div>
            <label style={{ color: 'rgb(var(--text-secondary))', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>📍 {t('location')} *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input required value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Near Railway Station, Delhi" style={{ ...inputStyle, flex: 1 }} />
              <button type="button" onClick={getGPS} title="Use GPS" style={{ padding: '11px 14px', borderRadius: 12, background: 'rgb(var(--primary) / 0.1)', border: '1px solid rgb(var(--primary) / 0.3)', color: 'rgb(var(--primary))', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, fontSize: 13 }}>
                {gpsLoading ? <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgb(var(--primary))', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} /> : <Navigation size={16} />}
                {t('gps')}
              </button>
            </div>
            {lat && <p style={{ color: 'rgb(var(--low))', fontSize: 11, marginTop: 4 }}>✓ GPS location captured</p>}
          </div>
          <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'linear-gradient(135deg,rgb(var(--primary)),#ef4444)', border: 'none', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
            {t('enterPortal')} →
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// Dummy NGO data with photos
const NGO_DATA = [
  { id: 1, name: 'Red Relief Foundation', category: 'Medical Aid', location: 'New Delhi, India', phone: '+91 98100 11234', email: 'contact@redrelief.org', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop', color: '#ef4444' },
  { id: 2, name: 'Sahayata Sewa Sangh', category: 'Food & Water', location: 'Mumbai, India', phone: '+91 98200 55678', email: 'help@sahayatasewa.org', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop', color: '#3b82f6' },
  { id: 3, name: 'Hope Bridge India', category: 'Shelter & Essentials', location: 'Bangalore, India', phone: '+91 99001 77890', email: 'info@hopebridgeindia.org', image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&h=300&fit=crop', color: '#10b981' },
  { id: 4, name: 'Raksha Volunteer Corps', category: 'Search & Rescue', location: 'Chennai, India', phone: '+91 97400 22345', email: 'ops@rakshacorps.org', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop', color: '#f59e0b' },
  { id: 5, name: 'Aasha Children Fund', category: 'Child Welfare', location: 'Kolkata, India', phone: '+91 96300 44567', email: 'care@aashachildren.org', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop&crop=top', color: '#8b5cf6' },
  { id: 6, name: 'Udaan Relief Network', category: 'Logistics & Supply', location: 'Hyderabad, India', phone: '+91 95500 66789', email: 'network@udaanrelief.org', image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&h=300&fit=crop', color: '#14b8a6' },
];

const NGOCard = ({ ngo, onClick }) => {
  const { t } = useAppContext();
  return (
    <div
      onClick={() => onClick(ngo)}
      className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      style={{ background: 'rgb(var(--panel))' }}
    >
      <div className="relative h-48 overflow-hidden bg-gray-900">
        <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <span className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: ngo.color + '33', color: ngo.color, border: `1px solid ${ngo.color}66` }}>
          {ngo.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">{ngo.name}</h3>
        <div className="flex items-center gap-1 text-text-secondary text-sm">
          <MapPin size={13} />
          <span>{ngo.location}</span>
        </div>
      </div>
    </div>
  );
};

const ContactModal = ({ ngo, onClose }) => {
  const { t } = useAppContext();
  if (!ngo) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-gray-700 shadow-2xl" style={{ background: 'rgb(var(--panel))' }} onClick={e => e.stopPropagation()}>
        <div className="relative h-40 overflow-hidden">
          <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-rgb(var(--panel))" />
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/80 transition"><X size={18} className="text-white" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">{ngo.name}</h2>
            <span className="inline-block mt-1 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: ngo.color + '22', color: ngo.color, border: `1px solid ${ngo.color}55` }}>{ngo.category}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <MapPin size={16} />
            <span>{ngo.location}</span>
          </div>
          <div className="space-y-3 bg-background opacity-80 rounded-2xl p-4 border border-gray-700">
            <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">{t('contactInfo')}</p>
            <a href={`tel:${ngo.phone}`} className="flex items-center gap-3 text-green-400 font-medium"><Phone size={18} /> {ngo.phone}</a>
            <a href={`mailto:${ngo.email}`} className="flex items-center gap-3 text-blue-400 font-medium"><Mail size={18} /> {ngo.email}</a>
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl font-semibold text-white transition-all" style={{ background: `linear-gradient(135deg, ${ngo.color}, ${ngo.color}99)` }}>Close</button>
        </div>
      </div>
    </div>
  );
};

const RequestModal = ({ status, onClose }) => {
  if (!status) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-sm rounded-3xl border border-gray-700 p-8 text-center space-y-4" style={{ background: 'rgb(var(--panel))' }}>
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-text-primary font-semibold text-lg">Getting your location…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={64} className="text-green-400 mx-auto" />
            <p className="text-text-primary font-bold text-xl">Request Sent!</p>
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-green-600 font-semibold text-white">OK</button>
          </>
        )}
      </div>
    </div>
  );
};

const EmergencyBar = () => {
  const { t } = useAppContext();
  return (
    <div style={{ 
      background: 'linear-gradient(90deg, #b91c1c, #ef4444)', 
      color: '#fff', 
      padding: '8px 20px', 
      textAlign: 'center', 
      fontSize: '13px', 
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      letterSpacing: '0.02em',
      position: 'relative',
      zIndex: 100
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <AlertTriangle size={16} />
        {t('helpline')}: 
      </span>
      <span style={{ fontSize: '15px' }}>{t('helplineNumbers')}</span>
    </div>
  );
};

const LandingPage = () => {
  const { t, theme, toggleTheme, language, setLanguage } = useAppContext();
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [showVictimLogin, setShowVictimLogin] = useState(false);
  const navigate = useNavigate();

  const handleVictimLogin = (data) => {
    setShowVictimLogin(false);
    navigate('/victim', { state: data });
  };

  const handleAddRequest = () => {
    setRequestStatus('loading');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            await fetch('http://localhost:8000/api/request-help', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lat: latitude, lng: longitude, message: 'Help needed' }),
            });
          } catch (_) {}
          setRequestStatus('success');
        },
        () => setRequestStatus('error'),
        { timeout: 8000 }
      );
    } else {
      setRequestStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'rgb(var(--background))', color: 'rgb(var(--text-primary))' }}>
      <EmergencyBar />
      {/* ── TOP NAVIGATION ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgb(var(--panel) / 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgb(var(--border))',
        padding: '0 2rem',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="RahatLink" style={{ height: 42, width: 'auto', borderRadius: '8px' }} />
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.05em', color: 'rgb(var(--primary))' }}>
            {t('brand')}
          </span>
        </div>

        {/* Nav Buttons */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title={t('theme')}>
            {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
          </button>

          {/* Language Selector */}
          <div className="relative group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 hover:border-primary transition-all cursor-pointer">
            <Languages size={18} className="text-text-secondary" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-sm font-semibold outline-none cursor-pointer text-text-primary"
              style={{ appearance: 'none', WebkitAppearance: 'none' }}
            >
              <option value="en" className="bg-panel">EN</option>
              <option value="hi" className="bg-panel">हिन्दी</option>
              <option value="gu" className="bg-panel">ગુજરાતી</option>
              <option value="mr" className="bg-panel">मराठी</option>
              <option value="ta" className="bg-panel">தமிழ்</option>
              <option value="te" className="bg-panel">తెలుగు</option>
            </select>
          </div>

          <nav style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={() => setShowVictimLogin(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: 'linear-gradient(135deg, rgb(var(--primary)), #ef4444)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
              <UserCircle2 size={16} /> {t('victimLogin')}
            </button>
            <button onClick={() => navigate('/role-selection')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: 'transparent', border: '1px solid rgb(var(--border))', color: 'rgb(var(--text-secondary))', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
              <Building2 size={16} /> {t('ngoLogin')}
            </button>
          </nav>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section style={{ textAlign: 'center', padding: '80px 2rem 60px', background: 'radial-gradient(ellipse at 50% 0%, rgb(var(--primary) / 0.12) 0%, transparent 70%)' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.2rem' }}>
          {t('heroTitle')} <br />
          <span style={{ background: 'linear-gradient(90deg, rgb(var(--primary)), #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('heroSubtitle')}
          </span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'rgb(var(--text-secondary))', maxWidth: '580px', margin: '0 auto 2.5rem' }}>
          {t('heroDesc')}
        </p>

        <button onClick={handleAddRequest} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 40px', borderRadius: '50px', background: 'linear-gradient(135deg, #ef4444, rgb(var(--primary)))', border: 'none', color: '#fff', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 32px rgba(239,68,68,0.4)' }}>
          <span style={{ fontSize: '1.3rem' }}>🆘</span>
          {t('addRequest')}
          <MapPin size={20} />
        </button>
        <p style={{ color: 'rgb(var(--text-secondary))', fontSize: '0.8rem', marginTop: '0.8rem', opacity: 0.7 }}>
          {t('notifyNearby')}
        </p>
      </section>

      {/* ── NGO GALLERY SECTION ── */}
      <section style={{ padding: '20px 2rem 80px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
            {t('partnerNgos').split(' ')[0]} <span style={{ color: 'rgb(var(--primary))' }}>{t('partnerNgos').split(' ')[1]}</span>
          </h2>
          <p style={{ color: 'rgb(var(--text-secondary))' }}>Click on any NGO to view their contact details</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {NGO_DATA.map(ngo => (<NGOCard key={ngo.id} ngo={ngo} onClick={setSelectedNGO} />))}
        </div>
      </section>

      <footer style={{ borderTop: '1px solid rgb(var(--border))', padding: '24px', textAlign: 'center', color: 'rgb(var(--text-secondary))', fontSize: '0.85rem' }}>
        ( made by bugbusters )
      </footer>

      <ContactModal ngo={selectedNGO} onClose={() => setSelectedNGO(null)} />
      <RequestModal status={requestStatus} onClose={() => setRequestStatus(null)} />
      {showVictimLogin && <VictimLoginModal onClose={() => setShowVictimLogin(false)} onLogin={handleVictimLogin} />}
    </div>
  );
};

export default LandingPage;
