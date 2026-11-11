import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Package, HelpingHand, Zap, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const routes = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Map View', path: '/map', icon: Map },
    { name: 'Warehouse Panel', path: '/warehouse', icon: Package },
    { name: 'NGO Panel', path: '/ngo', icon: HelpingHand },
    { name: 'Optimization', path: '/optimization', icon: Zap },
    { name: 'News Page', path: '/news', icon: Newspaper },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full shadow-lg">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <Zap className="w-6 h-6 text-blue-500" />
          <span>RahatLink</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-medium text-sm",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )
              }
            >
              <Icon className="w-5 h-5" />
              {route.name}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
        RahatLink Optimizer v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
