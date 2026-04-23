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
import CreateClientForm from '@/components/planner/ClientForm';

export default function PlannerPage() {
  const [activeNav, setActiveNav] = useState('calendar');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { viewMode, fetchInitialData } = useAppStore();

  // FIXED: Logic to handle highlighting and drawer visibility
  const handleNavChange = (nav: string) => {
    if (nav === 'settings') {
      setActiveNav('settings');
      setSidebarOpen(true); // Open drawer on mobile
    } else {
      setActiveNav(nav);
      setSidebarOpen(false); // Close drawer when navigating elsewhere
    }
  };
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        await fetchInitialData();
      } catch (error) {
        console.error("Failed to load initial planner data:", error);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchInitialData]);

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
      case 'settings':
        return (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Settings</h2>
              <p className="text-muted-foreground">Manage your account and preferences.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
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

      <TaskModal />
      <CreateClientForm />
      <BulkRequestModal />
      <IssueModal />
    </div>
  );
}