import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Map, LayoutDashboard, Package, ShieldAlert, TrendingUp, HandHeart, CheckCircle, Navigation, Sun, Moon, Languages, LogOut, Newspaper } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, theme, toggleTheme, language, setLanguage } = useAppContext();
    const hiddenPaths = ['/', '/role-selection', '/location-setup', '/victim'];
    const showSidebar = !hiddenPaths.includes(location.pathname);

    if (!showSidebar) {
        return <Outlet />;
    }

    const links = [
        { name: t('dashboard'), path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: t('history'), path: '/map', icon: <Map size={20} /> },
        { name: 'Analytics', path: '/analytics', icon: <TrendingUp size={20} /> },
        { name: 'NGO Panel', path: '/ngo/panel', icon: <HandHeart size={20} /> },
        { name: 'Distribution', path: '/distribution', icon: <Navigation size={20} /> },
        { name: 'Optimization', path: '/optimization', icon: <Activity size={20} /> },
        { name: t('news'), path: '/news', icon: <Newspaper size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-background text-text-primary">
            <aside className="w-64 bg-panel border-r border-border flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-border gap-3">
                    <img src="/logo.png" alt="RahatLink" style={{ height: 32, width: 'auto', borderRadius: 6 }} />
                    <h1 className="text-xl font-bold tracking-wider text-primary uppercase">{t('brand')}</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {links.map((link) => {
                        const active = location.pathname.startsWith(link.path);
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-primary/10 text-primary' : 'hover:bg-background/50 text-text-secondary hover:text-text-primary'}`}
                            >
                                {link.icon}
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        )
                    })}
                </nav>
                
                {/* Sidebar Footer Controls */}
                <div className="p-4 border-t border-border space-y-4">
                    <div className="flex items-center justify-between">
                        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-background/50 transition-colors">
                            {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-600" />}
                        </button>
                        <div className="flex items-center gap-2 text-xs">
                            <Languages size={14} />
                            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent outline-none cursor-pointer font-bold">
                                <option value="en">EN</option>
                                <option value="hi">HI</option>
                                <option value="gu">GU</option>
                                <option value="mr">MR</option>
                                <option value="ta">TA</option>
                                <option value="te">TE</option>
                            </select>
                        </div>
                    </div>
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-sm font-semibold">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-panel border-b border-border flex items-center px-6 md:hidden justify-between">
                    <h1 className="text-xl font-bold text-primary">{t('brand')}</h1>
                    <button onClick={toggleTheme}>
                         {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
