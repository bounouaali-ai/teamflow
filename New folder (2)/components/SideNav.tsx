import React from 'react';
import { Page } from '../App';

interface SideNavProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    isAttending: boolean;
}

const NavItem: React.FC<{
    page: Page;
    label: string;
    icon: string;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    disabled?: boolean;
}> = ({ page, label, icon, currentPage, setCurrentPage, disabled = false }) => {
    const isActive = currentPage === page;

    return (
        <li>
            <button
                onClick={() => !disabled && setCurrentPage(page)}
                disabled={disabled}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-right transition-colors duration-200 ${
                    isActive
                        ? 'bg-cyan-500 text-slate-900 font-bold shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/50'
                } ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title={disabled ? 'يجب تأكيد الحضور أولاً' : label}
            >
                <i className={`fa-solid ${icon} w-6 text-center text-xl`}></i>
                <span className="hidden md:inline">{label}</span>
            </button>
        </li>
    );
}

const SideNav: React.FC<SideNavProps> = ({ currentPage, setCurrentPage, isAttending }) => {
    return (
        <aside className="w-20 md:w-64 bg-slate-800/50 p-4 border-l border-slate-700 min-h-screen sticky top-0">
             <div className="flex items-center gap-3 justify-center md:justify-start mb-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-sky-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
                TF
                </div>
                <div className="hidden md:block">
                <h1 className="text-lg font-bold text-white">TeamFlow</h1>
                <p className="text-xs text-slate-400">فريق كرة القدم</p>
                </div>
            </div>
            <nav>
                <ul className="space-y-3">
                    <NavItem page="DASHBOARD" label="لوحة المعلومات" icon="fa-home" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem page="ATTENDANCE" label="تسجيل الحضور" icon="fa-user-check" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem page="PREFERENCES" label="تفضيلات المباراة" icon="fa-sliders" currentPage={currentPage} setCurrentPage={setCurrentPage} disabled={!isAttending} />
                    <NavItem page="TEAMS" label="تشكيلة الفرق" icon="fa-people-group" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem page="REVIEW" label="تقييم المباراة" icon="fa-star" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </ul>
            </nav>
        </aside>
    );
};

export default SideNav;
