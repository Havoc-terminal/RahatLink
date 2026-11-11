import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageOpen, HandHeart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const RoleSelection = () => {
    const navigate = useNavigate();
    const { t } = useAppContext();

    const selectRole = (role) => {
        localStorage.setItem('rahatlink_role', role);
        navigate('/location-setup');
    };

    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-6">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold mb-3">{t('selectRole')}</h1>
                <p className="text-text-secondary max-w-md mx-auto">{t('roleDesc')}</p>
            </div>

            <div className="flex justify-center w-full max-w-lg">
                <button
                    onClick={() => selectRole('NGO')}
                    className="group relative flex flex-col items-center justify-center p-12 bg-panel border-2 border-border rounded-3xl hover:border-primary transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-2 cursor-pointer w-full"
                >
                    <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <HandHeart className="text-primary" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2 text-center">{t('ngoLogin')}</h2>
                    <p className="text-text-secondary text-center">{t('ngoDesc')}</p>
                </button>
            </div>
        </div>
    );
};

export default RoleSelection;
