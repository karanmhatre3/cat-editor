import React, { useState } from 'react';
import {
  ChevronRight,
  List,
  MessageSquare,
  AlertCircle,
  FileText
} from 'lucide-react';
import { SegmentData, TMMatch } from '../../types/segment';
import './Sidebar.css';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedSegment: SegmentData | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse, selectedSegment }) => {
  const [activeTab, setActiveTab] = useState<'context' | 'comments' | 'issues' | 'notes'>('context');
  const [issuesSubTab, setIssuesSubTab] = useState<'reviewer' | 'ai-qa'>('reviewer');

  // Keyboard navigation for sidebar tabs (CTRL+1,2,3)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea or contentEditable element
      const target = e.target as HTMLElement;

      // Check if target is an input, textarea, or contentEditable
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true' ||
        target.isContentEditable
      ) {
        return;
      }

      // Check for Ctrl key with numbers 1, 2, or 3
      if (e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
        const key = e.key;

        if (key === '1') {
          e.preventDefault();
          e.stopPropagation();
          setActiveTab('context');
        } else if (key === '2') {
          e.preventDefault();
          e.stopPropagation();
          setActiveTab('issues');
        } else if (key === '3') {
          e.preventDefault();
          e.stopPropagation();
          setActiveTab('comments');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  // Helper function to render text with tags
  const renderTextWithTags = (text: string) => {
    const parts = text.split(/(\[k\]|\[\/k\]|\[b\]|\[\/b\]|\[term\]|\[\/term\])/);
    let currentTag: 'k' | 'b' | 'term' | null = null;

    return parts.map((part, index) => {
      if (part === '[k]') {
        currentTag = 'k';
        return null;
      }
      if (part === '[/k]') {
        currentTag = null;
        return null;
      }
      if (part === '[b]') {
        currentTag = 'b';
        return null;
      }
      if (part === '[/b]') {
        currentTag = null;
        return null;
      }
      if (part === '[term]') {
        currentTag = 'term';
        return null;
      }
      if (part === '[/term]') {
        currentTag = null;
        return null;
      }

      if (!part) return null;

      if (currentTag === 'k') {
        return (
          <React.Fragment key={index}>
            <span className="inline-tag inline-tag--open tag-purple">k</span>
            <span>{part}</span>
            <span className="inline-tag inline-tag--close tag-purple">k</span>
          </React.Fragment>
        );
      }
      if (currentTag === 'b') {
        return (
          <React.Fragment key={index}>
            <span className="inline-tag inline-tag--open tag-orange">b</span>
            <span>{part}</span>
            <span className="inline-tag inline-tag--close tag-orange">b</span>
          </React.Fragment>
        );
      }
      if (currentTag === 'term') {
        return (
          <React.Fragment key={index}>
            <span className="inline-tag inline-tag--open tag-gray">term</span>
            <span>{part}</span>
            <span className="inline-tag inline-tag--close tag-gray">term</span>
          </React.Fragment>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  // Helper function to get badge class based on match percentage and type
  const getBadgeClass = (match: TMMatch) => {
    if (match.type === 'TB') {
      return 'sidebar__badge--tb';
    }

    if (match.matchPercentage >= 80) {
      return 'sidebar__badge--tm-high';
    } else if (match.matchPercentage >= 60) {
      return 'sidebar__badge--tm-medium';
    } else {
      return 'sidebar__badge--tm-low';
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Left icon column */}
      <div className="sidebar__icon-column">
        <button
          className="sidebar__collapse-btn"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight size={16} />
        </button>

        <button
          className={`sidebar__icon-btn ${activeTab === 'context' ? 'sidebar__icon-btn--active' : ''}`}
          onClick={() => setActiveTab('context')}
          title="Context"
        >
          <List size={16} />
        </button>

        <button
          className={`sidebar__icon-btn ${activeTab === 'issues' ? 'sidebar__icon-btn--active' : ''}`}
          onClick={() => setActiveTab('issues')}
          title="Issues"
        >
          <AlertCircle size={16} />
        </button>

        <button
          className={`sidebar__icon-btn ${activeTab === 'comments' ? 'sidebar__icon-btn--active' : ''}`}
          onClick={() => setActiveTab('comments')}
          title="Comments"
        >
          <MessageSquare size={16} />
        </button>
      </div>

      {/* Right content area */}
      {!isCollapsed && (
        <div className="sidebar__content-wrapper">
          <div className="sidebar__content">
            {activeTab === 'context' && (
              <div className="sidebar__panel">
                {!selectedSegment ? (
                  <div className="sidebar__panel-content">
                    <p className="sidebar__empty-state">Select a segment to view suggestions.</p>
                  </div>
                ) : (
                  <>
                    {/* AI Suggestion */}
                    {selectedSegment.aiSuggestion && (
                      <div className="sidebar__suggestion">
                        <div className="sidebar__suggestion-text">
                          {renderTextWithTags(selectedSegment.aiSuggestion.text)}
                        </div>
                        <div className="sidebar__suggestion-footer">
                          <span className="sidebar__badge sidebar__badge--ai">
                            AI {selectedSegment.aiSuggestion.confidence}%
                          </span>
                          <div className="sidebar__action">
                            <span className="sidebar__action-text">Copy into segment</span>
                            <div className="sidebar__shortcut-group">
                              <span className="sidebar__shortcut">SHIFT</span>
                              <span className="sidebar__shortcut">ENTER</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TB/TM Results */}
                    {selectedSegment.tmMatches && selectedSegment.tmMatches.length > 0 && (
                      <div className="sidebar__results">
                        {selectedSegment.tmMatches.map((match) => (
                          <div key={match.id} className="sidebar__result">
                            <div className="sidebar__result-content">
                              <p className="sidebar__result-source">{match.source}</p>
                              <p className="sidebar__result-target">{match.target}</p>
                              <span className={`sidebar__badge ${getBadgeClass(match)}`}>
                                {match.type === 'TB' ? 'TB' : `TM ${match.matchPercentage}%`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="sidebar__panel sidebar__panel--comments">
                {!selectedSegment ? (
                  <div className="sidebar__panel-content">
                    <p className="sidebar__empty-state">Select a segment to view comments.</p>
                  </div>
                ) : (
                  <>
                    <div className="sidebar__comments-list">
                      {selectedSegment.comments && selectedSegment.comments.length > 0 ? (
                        selectedSegment.comments.map((comment) => (
                          <div key={comment.id} className="sidebar__comment">
                            <div className="sidebar__comment-avatar">{comment.avatar || comment.author.charAt(0)}</div>
                            <div className="sidebar__comment-content">
                              <div className="sidebar__comment-header">
                                <span className="sidebar__comment-author">{comment.author}</span>
                                <span className="sidebar__comment-time">
                                  {new Date(comment.timestamp).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </span>
                              </div>
                              <p className="sidebar__comment-message">{comment.message}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="sidebar__empty-state">No comments yet.</p>
                      )}
                    </div>
                    <div className="sidebar__comment-input">
                      <textarea
                        className="sidebar__comment-textarea"
                        placeholder="Add a comment..."
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'issues' && (
              <div className="sidebar__panel">
                {!selectedSegment ? (
                  <div className="sidebar__panel-content">
                    <p className="sidebar__empty-state">Select a segment to view issues.</p>
                  </div>
                ) : (
                  <>
                    <div className="sidebar__sub-tabs">
                      <button
                        className={`sidebar__sub-tab ${issuesSubTab === 'reviewer' ? 'sidebar__sub-tab--active' : ''}`}
                        onClick={() => setIssuesSubTab('reviewer')}
                      >
                        Reviewer feedback
                      </button>
                      <button
                        className={`sidebar__sub-tab ${issuesSubTab === 'ai-qa' ? 'sidebar__sub-tab--active' : ''}`}
                        onClick={() => setIssuesSubTab('ai-qa')}
                      >
                        AI QA
                      </button>
                    </div>
                    {selectedSegment.issues && selectedSegment.issues.filter(issue => issue.category === issuesSubTab).length > 0 ? (
                      <div className="sidebar__issues">
                        {selectedSegment.issues
                          .filter(issue => issue.category === issuesSubTab)
                          .map((issue) => (
                            <div key={issue.id} className="sidebar__issue">
                              {issuesSubTab === 'reviewer' ? (
                                // Reviewer feedback format
                                <div className="sidebar__reviewer-feedback">
                                  <div className="sidebar__reviewer-feedback-bullet"></div>
                                  <div className="sidebar__reviewer-feedback-content">
                                    <p className="sidebar__reviewer-feedback-message">{issue.message}</p>
                                    {issue.badges && issue.badges.length > 0 && (
                                      <div className="sidebar__reviewer-feedback-badges">
                                        {issue.badges.map((badge, index) => {
                                          // First badge uses severity color, second badge is always gray
                                          const badgeClass = index === 0
                                            ? (issue.severity === 'high' ? 'high' : 'yellow')
                                            : 'gray';
                                          return (
                                            <span key={index} className={`sidebar__badge sidebar__badge--${badgeClass}`}>
                                              {badge}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                // AI QA format
                                <div className="sidebar__ai-qa-item">
                                  <span className={`sidebar__ai-qa-indicator sidebar__ai-qa-indicator--${issue.severity}`}></span>
                                  <div className="sidebar__ai-qa-content">
                                    {issue.quotedText && (
                                      <p className="sidebar__ai-qa-quoted">{issue.quotedText}</p>
                                    )}
                                    <p className="sidebar__ai-qa-message">{issue.message}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="sidebar__panel-content">
                        <p className="sidebar__empty-state">No {issuesSubTab === 'reviewer' ? 'reviewer feedback' : 'AI QA issues'} detected.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="sidebar__panel">
                <h3 className="sidebar__panel-title">Notes</h3>
                <div className="sidebar__panel-content">
                  <p className="sidebar__empty-state">No notes added.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
