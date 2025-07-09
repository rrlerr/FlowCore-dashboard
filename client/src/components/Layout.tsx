import Sidebar from "./Sidebar";
import { Bell, Settings, User } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export default function Layout({ children, activeModule, onModuleChange }: LayoutProps) {
  const moduleNames = {
    dashboard: "Dashboard",
    crm: "CRM",
    sales: "Sales & Revenue",
    tickets: "Support Tickets",
    projects: "Projects",
    email: "Email",
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeModule={activeModule} onModuleChange={onModuleChange} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              {moduleNames[activeModule as keyof typeof moduleNames]}
            </h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-600 hover:text-slate-800 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-600 hover:text-slate-800 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
