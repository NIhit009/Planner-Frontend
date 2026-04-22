'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/planner/sidebar';
import { Header, CalendarHeader } from '@/components/planner/header';
import { CalendarView } from '@/components/planner/calendar-view';
import { AdminDashboard, ClientDashboard } from '@/components/planner/dashboard';
import { PerformanceOverview } from '@/components/planner/performance-chart';
import { ClientList } from '@/components/planner/client-list';
import { TaskModal } from '@/components/planner/task-modal';
import { BulkRequestModal } from '@/components/planner/bulk-request-modal';
import { IssueModal } from '@/components/planner/issue-modal';
import { useAppStore } from '@/lib/store';
import { BASE_URL } from '@/lib/Base_url';
import { useRouter } from 'next/router';

export default function PlannerPage() {
  // const router = useRouter();
  const [activeNav, setActiveNav] = useState('calendar');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { viewMode, fetchInitialData } = useAppStore();
  
  const handleNavChange = (nav: string) => {
    setActiveNav(nav);
    setSidebarOpen(false);
  };

  useEffect(() => {
    const loadData = async () => {await fetchInitialData()};
    loadData()
  }
  , []);

  // useEffect(() => {
  //   const getRefreshToken = async () => {
  //     const response = await fetch(`${BASE_URL}/auth/refresh`);
  //     const data  = await response.json();
  //     console.log(data);
  //     if(!response.ok) router.push("/login");
      
  //   }
  // })
  
  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return viewMode === 'admin' ? <AdminDashboard /> : <ClientDashboard />;
      case 'calendar':
        return (
          <div className="flex flex-col flex-1 overflow-hidden">
            <CalendarHeader />
            <CalendarView />
          </div>
        );
      case 'clients':
        return viewMode === 'admin' ? <ClientList /> : <ClientDashboard />;
      case 'reports':
        return <PerformanceOverview />;
      default:
        return (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Settings</h2>
              <p className="text-muted-foreground">Settings page coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar 
        activeNav={activeNav} 
        onNavChange={handleNavChange} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-hidden flex flex-col bg-muted/30">
          {renderContent()}
        </main>
      </div>
      
      {/* Modals */}
      <TaskModal />
      <BulkRequestModal />
      <IssueModal />
    </div>
  );
}
