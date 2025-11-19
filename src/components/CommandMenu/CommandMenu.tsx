import React, { useEffect, useState, useMemo } from 'react';
import './CommandMenu.css';

interface CommandMenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  shortcut?: string;
  category: 'recent' | 'suggested' | 'all';
}

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const allCommands: CommandMenuItem[] = [
    // Recently Used
    {
      id: 'search-concordance',
      title: 'Search in concordance',
      description: 'Search for a term or phrase in our concordance to find previous similar uses',
      icon: '📚',
      shortcut: '⌘⇧ F',
      category: 'recent'
    },
    {
      id: 'toggle-tag',
      title: 'Toggle tag content',
      description: 'Hide/unhide additional tag content that is displayed with each tag',
      icon: '🏷️',
      shortcut: '⌘⇧ A',
      category: 'recent'
    },
    {
      id: 'filter-segment',
      title: 'Filter segment',
      description: 'Filter the segments on the screen by completion status, match %, etc.',
      icon: '🔍',
      shortcut: '⌘⌥ X',
      category: 'recent'
    },
    // Suggested Actions
    {
      id: 'run-batch-qa',
      title: 'Run Batch QA',
      description: 'Run Batch QA on the document to identify translation issues',
      icon: '📝',
      category: 'suggested'
    },
    {
      id: 'mark-complete',
      title: 'Mark the document as complete',
      description: "If you're done working on the document, mark it as complete so we can send it ahead.",
      icon: '✅',
      category: 'suggested'
    },
    {
      id: 'view-in-context',
      title: 'View document in-context',
      description: 'Adjust settings to personalize your experience',
      icon: '👁️',
      shortcut: '⌥ S',
      category: 'suggested'
    },
    // All Commands
    {
      id: 'show-invisible-chars',
      title: 'Show invisible characters',
      description: 'Display hidden characters like spaces, tabs, and line breaks',
      icon: '👻',
      category: 'all'
    },
    {
      id: 'copy-source-to-target',
      title: 'Copy source to target',
      description: 'Copy the source text into the target segment',
      icon: '📋',
      shortcut: '⌘⇧ C',
      category: 'all'
    },
    {
      id: 'insert-special-char',
      title: 'Insert special character',
      description: 'Open dialog to insert special characters',
      icon: '✨',
      category: 'all'
    },
    {
      id: 'forward-overwrite',
      title: 'Forward overwrite confirmed segments',
      description: 'Overwrite confirmed segments going forward',
      icon: '➡️',
      category: 'all'
    },
    {
      id: 'show-tag-content',
      title: 'Show tag content',
      description: 'Display the content within tags',
      icon: '🏷️',
      category: 'all'
    },
    {
      id: 'add-term',
      title: 'Add a new term',
      description: 'Add a new term to the terminology database',
      icon: '📖',
      category: 'all'
    },
    {
      id: 'insert-rtl-mark',
      title: 'Insert right-to-left mark',
      description: 'Insert RTL directional mark for right-to-left languages',
      icon: '◀️',
      category: 'all'
    },
    {
      id: 'backward-overwrite',
      title: 'Backward overwrite confirmed segments',
      description: 'Overwrite confirmed segments going backward',
      icon: '⬅️',
      category: 'all'
    },
    {
      id: 'show-source-tags',
      title: 'Show source tags',
      description: 'Display tags in the source text',
      icon: '🔖',
      category: 'all'
    },
    {
      id: 'insert-ltr-mark',
      title: 'Insert left-to-right mark',
      description: 'Insert LTR directional mark for left-to-right languages',
      icon: '▶️',
      category: 'all'
    },
    {
      id: 'show-target-tags',
      title: 'Show target tags',
      description: 'Display tags in the target text',
      icon: '🎯',
      category: 'all'
    },
    {
      id: 'insert-nbsp',
      title: 'Insert non-breaking space',
      description: 'Insert a non-breaking space character',
      icon: '␣',
      category: 'all'
    },
    {
      id: 'keep-sidebar-open',
      title: 'Keep sidebar open',
      description: 'Prevent the sidebar from automatically closing',
      icon: '📌',
      category: 'all'
    },
    {
      id: 'project-target-tags',
      title: 'Project target tags',
      description: 'Project tags from source to target segment',
      icon: '🎬',
      category: 'all'
    },
    {
      id: 'insert-line-break',
      title: 'Insert line break',
      description: 'Insert a line break in the segment',
      icon: '↵',
      shortcut: '⇧ Enter',
      category: 'all'
    },
    {
      id: 'auto-scroll-editor',
      title: 'Auto-scroll editor',
      description: 'Enable automatic scrolling as you translate',
      icon: '📜',
      category: 'all'
    },
    {
      id: 'open-style-guide',
      title: 'Open style guide',
      description: 'View the translation style guide',
      icon: '📐',
      category: 'all'
    }
  ];

  // Filter commands based on search query
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) {
      return allCommands;
    }

    const query = searchQuery.toLowerCase();
    return allCommands.filter(cmd =>
      cmd.title.toLowerCase().includes(query) ||
      cmd.description.toLowerCase().includes(query)
    );
  }, [searchQuery, allCommands]);

  // Group filtered commands by category
  const recentCommands = filteredCommands.filter(cmd => cmd.category === 'recent');
  const suggestedCommands = filteredCommands.filter(cmd => cmd.category === 'suggested');
  const otherCommands = filteredCommands.filter(cmd => cmd.category === 'all');

  // Reset state when menu opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands.length > 0) {
        e.preventDefault();
        // Execute selected command
        const selectedCommand = filteredCommands[selectedIndex];
        console.log('Execute command:', selectedCommand.id);
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <div className="command-menu-overlay" onClick={onClose}>
      <div className="command-menu" onClick={(e) => e.stopPropagation()}>
        {/* Header with search input */}
        <div className="command-menu__header">
          <div className="command-menu__input">
            <svg className="command-menu__ai-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C7.5 1.5 7 2 6.5 2.5C6 3 5.5 3.5 5.5 4C5.5 4.5 5.5 5 6 5.5C6.5 6 7 6.5 7.5 6.5C8 6.5 8.5 6.5 9 6C9.5 5.5 10 5 10.5 4.5C11 4 11 3.5 10.5 3C10 2.5 9.5 2 9 1.5C8.5 1 8.5 1.5 8 1.5Z" fill="currentColor"/>
              <path d="M4 7.5C3.5 7.5 3 8 2.5 8.5C2 9 1.5 9.5 1.5 10C1.5 10.5 1.5 11 2 11.5C2.5 12 3 12.5 3.5 12.5C4 12.5 4.5 12.5 5 12C5.5 11.5 6 11 6.5 10.5C7 10 7 9.5 6.5 9C6 8.5 5.5 8 5 7.5C4.5 7 4.5 7.5 4 7.5Z" fill="currentColor"/>
              <path d="M12 7.5C11.5 7.5 11 8 10.5 8.5C10 9 9.5 9.5 9.5 10C9.5 10.5 9.5 11 10 11.5C10.5 12 11 12.5 11.5 12.5C12 12.5 12.5 12.5 13 12C13.5 11.5 14 11 14.5 10.5C15 10 15 9.5 14.5 9C14 8.5 13.5 8 13 7.5C12.5 7 12.5 7.5 12 7.5Z" fill="currentColor"/>
            </svg>
            <input
              type="text"
              className="command-menu__search-input"
              placeholder="Ask Assist"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <div className="command-menu__shortcut">
              <span className="shortcut-key">⌘</span>
              <span className="shortcut-key">K</span>
            </div>
          </div>
        </div>

        {/* Command list */}
        <div className="command-menu__content">
          {filteredCommands.length === 0 ? (
            <div className="command-menu__empty">
              <p>No commands found for "{searchQuery}"</p>
            </div>
          ) : (
            <>
              {/* Recently Used */}
              {recentCommands.length > 0 && (
                <div className="command-menu__section">
                  <div className="command-menu__section-header">RECENTLY USED</div>
                  {recentCommands.map((command, index) => {
                    const globalIndex = filteredCommands.indexOf(command);
                    return (
                      <div
                        key={command.id}
                        className={`command-menu__item ${selectedIndex === globalIndex ? 'command-menu__item--selected' : ''}`}
                        onClick={() => {
                          console.log('Execute command:', command.id);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                      >
                        <span className="command-menu__icon">{command.icon}</span>
                        <div className="command-menu__text">
                          <div className="command-menu__title">{command.title}</div>
                          <div className="command-menu__description">{command.description}</div>
                        </div>
                        {command.shortcut && (
                          <div className="command-menu__shortcut-hint">{command.shortcut}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Suggested Actions */}
              {suggestedCommands.length > 0 && (
                <div className="command-menu__section">
                  <div className="command-menu__section-header">SUGGESTED ACTIONS</div>
                  {suggestedCommands.map((command) => {
                    const globalIndex = filteredCommands.indexOf(command);
                    return (
                      <div
                        key={command.id}
                        className={`command-menu__item ${selectedIndex === globalIndex ? 'command-menu__item--selected' : ''}`}
                        onClick={() => {
                          console.log('Execute command:', command.id);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                      >
                        <span className="command-menu__icon">{command.icon}</span>
                        <div className="command-menu__text">
                          <div className="command-menu__title">{command.title}</div>
                          <div className="command-menu__description">{command.description}</div>
                        </div>
                        {command.shortcut && (
                          <div className="command-menu__shortcut-hint">{command.shortcut}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* All Commands */}
              {otherCommands.length > 0 && (
                <div className="command-menu__section">
                  <div className="command-menu__section-header">ALL COMMANDS</div>
                  {otherCommands.map((command) => {
                    const globalIndex = filteredCommands.indexOf(command);
                    return (
                      <div
                        key={command.id}
                        className={`command-menu__item ${selectedIndex === globalIndex ? 'command-menu__item--selected' : ''}`}
                        onClick={() => {
                          console.log('Execute command:', command.id);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                      >
                        <span className="command-menu__icon">{command.icon}</span>
                        <div className="command-menu__text">
                          <div className="command-menu__title">{command.title}</div>
                          <div className="command-menu__description">{command.description}</div>
                        </div>
                        {command.shortcut && (
                          <div className="command-menu__shortcut-hint">{command.shortcut}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="command-menu__footer">
          <div className="command-menu__footer-left">
            <span>Use</span>
            <div className="command-menu__nav-keys">
              <span className="shortcut-key">↓</span>
              <span className="shortcut-key">↑</span>
            </div>
            <span>to navigate</span>
          </div>
          <div className="command-menu__footer-right">
            <span>View all hotkeys</span>
            <div className="command-menu__shortcut">
              <span className="shortcut-key">⌘</span>
              <span className="shortcut-key">H</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandMenu;
