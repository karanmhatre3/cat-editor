import React, { useState } from 'react';
import './TopBar.css';

export type ViewMode = 'segment' | 'split' | 'document' | 'in-context';

interface TopBarProps {
  onOpenCommandMenu: () => void;
  onViewChange?: (view: ViewMode) => void;
}

const TopBar: React.FC<TopBarProps> = ({ onOpenCommandMenu, onViewChange }) => {
  const [activeView, setActiveView] = useState<ViewMode>('segment');

  const handleViewChange = (view: ViewMode) => {
    setActiveView(view);
    onViewChange?.(view);
  };

  return (
    <div className="top-bar">
      {/* Left Section - Logo */}
      <div className="top-bar__left">
        <div className="top-bar__logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 15C10.3431 15 9 13.6569 9 12C9 10.3432 10.3431 9 12 9C13.6569 9 15 10.3432 15 12C15 13.6569 13.6569 15 12 15Z" fill="#6E747E"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M24 20.25H4.5C4.08581 20.25 3.75 19.9142 3.75 19.5V6H0V20.25C0 22.3211 1.67888 24 3.75 24H20.25C22.3211 24 24 22.3211 24 20.25Z" fill="#6E747E"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M20.25 18H24V3.75C24 1.67888 22.3211 0 20.25 0H3.75C1.67888 0 0 1.67888 0 3.75H19.5C19.9142 3.75 20.25 4.08581 20.25 4.5V18Z" fill="#6E747E"/>
          </svg>
        </div>
      </div>

      {/* Center Section - Ask Assist Button */}
      <div className="top-bar__center">
        <button className="ask-assist-button" onClick={onOpenCommandMenu}>
          <svg className="ask-assist-button__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5C7.5 1.5 7 2 6.5 2.5C6 3 5.5 3.5 5.5 4C5.5 4.5 5.5 5 6 5.5C6.5 6 7 6.5 7.5 6.5C8 6.5 8.5 6.5 9 6C9.5 5.5 10 5 10.5 4.5C11 4 11 3.5 10.5 3C10 2.5 9.5 2 9 1.5C8.5 1 8.5 1.5 8 1.5Z" fill="currentColor"/>
            <path d="M4 7.5C3.5 7.5 3 8 2.5 8.5C2 9 1.5 9.5 1.5 10C1.5 10.5 1.5 11 2 11.5C2.5 12 3 12.5 3.5 12.5C4 12.5 4.5 12.5 5 12C5.5 11.5 6 11 6.5 10.5C7 10 7 9.5 6.5 9C6 8.5 5.5 8 5 7.5C4.5 7 4.5 7.5 4 7.5Z" fill="currentColor"/>
            <path d="M12 7.5C11.5 7.5 11 8 10.5 8.5C10 9 9.5 9.5 9.5 10C9.5 10.5 9.5 11 10 11.5C10.5 12 11 12.5 11.5 12.5C12 12.5 12.5 12.5 13 12C13.5 11.5 14 11 14.5 10.5C15 10 15 9.5 14.5 9C14 8.5 13.5 8 13 7.5C12.5 7 12.5 7.5 12 7.5Z" fill="currentColor"/>
          </svg>
          <span className="ask-assist-button__text">Ask Assist</span>
          <div className="ask-assist-button__shortcut">
            <span className="shortcut-key">⌘</span>
            <span className="shortcut-key">K</span>
          </div>
        </button>
      </div>

      {/* Right Section - View Tabs */}
      <div className="top-bar__right">
        <div className="view-tabs">
          <button
            className={`view-tab ${activeView === 'segment' ? 'view-tab--active' : ''}`}
            onClick={() => handleViewChange('segment')}
          >
            Segment view
          </button>
          <button
            className={`view-tab ${activeView === 'split' ? 'view-tab--active' : ''}`}
            onClick={() => handleViewChange('split')}
          >
            Split view
          </button>
          <button
            className={`view-tab ${activeView === 'document' ? 'view-tab--active' : ''}`}
            onClick={() => handleViewChange('document')}
          >
            Document view
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
