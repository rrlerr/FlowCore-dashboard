import { Activity, Users, TrendingUp, Ticket, FolderOpen, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export default function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "crm", label: "CRM", icon: Users },
    { id: "sales", label: "Sales & Revenue", icon: TrendingUp },
    { id: "tickets", label: "Support Tickets", icon: Ticket },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "email", label: "Email", icon: Mail },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">
          <Activity className="inline w-6 h-6 text-primary mr-2" />
          FlowCore
        </h1>
        <p className="text-sm text-slate-600">Business Management</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onModuleChange(item.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 transition-colors",
                    activeModule === item.id
                      ? "bg-primary text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
