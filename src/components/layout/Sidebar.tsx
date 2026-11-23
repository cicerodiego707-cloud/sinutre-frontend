//import { useState } from 'react';
import { NAV_ITEMS } from '@/constants/navigation';
import { SidebarBrand } from './SidebarBrand';
import { SidebarItem } from './SidebarItem';
import { useAuth } from '@/context/AuthContext';
import { SignOut } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
interface SidebarProps {
  drawerId: string;
}

export function Sidebar({ drawerId }: SidebarProps) {
 // const [activeId, setActiveId] = useState<string>('home');
  const { logout } = useAuth();
  const expanded = true;
  const navigate = useNavigate();

       function handleLogout() {
          logout();
        navigate('/login', { replace: true });
}
  return (
    <aside className="drawer-side z-50">
      <label
        htmlFor={drawerId}
        aria-label="Fechar menu"
        className="drawer-overlay"
      />
      <div
        className={`bg-base-100 flex flex-col min-h-full border-r border-base-200 shadow-sm transition-all duration-300 ${
          expanded ? 'w-64 items-start' : 'w-20 items-center'
        }`}
      >
        <SidebarBrand expanded={expanded} />
        
        <ul className="menu w-full grow pt-4 gap-2">
          {NAV_ITEMS.map(item => (
            <SidebarItem
              key={item.id}
              label={item.label}
              Icon={item.Icon}
              to={item.to}
              expanded={expanded}
            />
          ))}
        </ul>
        <div className="w-full p-4">
  <button
    type="button"
    onClick={handleLogout}
    className="btn btn-error btn-outline w-full"
  >
    <SignOut size={22} />
    Sair
  </button>
</div>
      </div>
    </aside>
  );
}
