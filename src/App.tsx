import React, { useEffect, useState } from 'react';
import TopBar, { ViewMode } from './components/TopBar/TopBar';
import CommandMenu from './components/CommandMenu/CommandMenu';
import SegmentList from './components/SegmentList/SegmentList';
import Sidebar from './components/Sidebar/Sidebar';
import BottomBar from './components/BottomBar/BottomBar';
import { SegmentData } from './types/segment';
import './App.css';

function App() {
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('segment');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<SegmentData | null>(null);

  // Mock documents data
  const documents = [
    { id: '1', name: 'Document1...report.txt', isActive: true },
    { id: '2', name: 'Document2...summary.docx', isActive: false },
    { id: '3', name: 'Document3...presentation.pptx', isActive: false },
    { id: '4', name: 'Document4...analysis.xlsx', isActive: false }
  ];

  // Handle CMD+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app">
      <TopBar
        onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
        onViewChange={setViewMode}
      />
      <div className="app__main">
        <main className="app__content">
          <SegmentList
            viewMode={viewMode}
            onSegmentSelect={setSelectedSegment}
          />
        </main>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          selectedSegment={selectedSegment}
        />
      </div>

      {/* Command Menu */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
      />

      {/* Bottom Bar */}
      <BottomBar
        documents={documents}
        currentProgress={{ translated: 32, total: 412 }}
        status="In review"
      />
    </div>
  );
}

export default App;
