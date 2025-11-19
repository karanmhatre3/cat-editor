import React, { useRef, useEffect, useMemo, useState } from 'react';
import { SegmentData } from '../../types/segment';
import { ViewMode } from '../TopBar/TopBar';
import './Segment.css';

interface SegmentProps {
  segment: SegmentData;
  isActive: boolean;
  onClick: () => void;
  onEdit: (newTarget: string) => void;
  viewMode: ViewMode;
}

const Segment: React.FC<SegmentProps> = ({ segment, isActive, onClick, onEdit, viewMode }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const wasActiveRef = useRef(false);
  const isInitialRender = useRef(true);
  const initialTargetContent = useRef(segment.target);
  const [currentText, setCurrentText] = useState(segment.target);
  const [editorKey, setEditorKey] = useState(0);

  // Calculate suggested completion based on original target
  const getSuggestedCompletion = () => {
    if (!segment.suggestedText || currentText.length >= segment.suggestedText.length) {
      return null;
    }

    // Check if current text matches the beginning of suggested text
    if (segment.suggestedText.startsWith(currentText)) {
      return segment.suggestedText.substring(currentText.length);
    }

    return null;
  };

  // Attach click handlers to all tags in the contentEditable
  const attachTagHandlers = () => {
    if (!targetRef.current) return;

    const tags = targetRef.current.querySelectorAll('.inline-tag');
    tags.forEach((tag) => {
      const htmlTag = tag as HTMLElement;
      // Remove existing listener to avoid duplicates
      htmlTag.removeEventListener('mousedown', handleTagClickNative);
      // Add new listener
      htmlTag.addEventListener('mousedown', handleTagClickNative);
    });
  };

  // Native event handler for dynamically added tags
  const handleTagClickNative = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const tag = e.currentTarget as HTMLElement;

    // Remove selected class from all tags
    if (targetRef.current) {
      const allTags = targetRef.current.querySelectorAll('.inline-tag');
      allTags.forEach(t => t.classList.remove('selected'));
    }

    // Add selected class to clicked tag
    tag.classList.add('selected');

    // Select just this tag element
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNode(tag);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  // Store initial content when segment becomes active
  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      initialTargetContent.current = segment.target;

      if (targetRef.current) {
        targetRef.current.focus();

        // Place cursor at end and attach handlers
        setTimeout(() => {
          const range = document.createRange();
          const sel = window.getSelection();
          if (targetRef.current && targetRef.current.childNodes.length > 0) {
            range.selectNodeContents(targetRef.current);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }

          // Attach handlers to initial tags
          attachTagHandlers();
        }, 0);
      }
    }

    // Track whether this segment is/was active
    wasActiveRef.current = isActive;
    isInitialRender.current = false;
  }, [isActive, segment.target]);

  // Handle click on individual tag to select it
  const handleTagClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const tag = e.currentTarget;

    // Remove selected class from all tags
    if (targetRef.current) {
      const allTags = targetRef.current.querySelectorAll('.inline-tag');
      allTags.forEach(t => t.classList.remove('selected'));
    }

    // Add selected class to clicked tag
    tag.classList.add('selected');

    // Select just this tag element
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNode(tag);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  // Parse text with tags and render with proper styling
  const renderTextWithTags = (text: string, isSuggested: boolean = false, editable: boolean = false) => {
    // Parse [k]text[/k], [b]text[/b], [term]text[/term] tags
    const parts: React.ReactElement[] = [];
    let lastIndex = 0;

    const tagRegex = /\[(k|b|term)\](.*?)\[\/(k|b|term)\]/g;
    let match;

    while ((match = tagRegex.exec(text)) !== null) {
      // Add text before tag
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        parts.push(
          <span key={`text-${lastIndex}`} className={isSuggested ? 'suggested-text' : ''}>
            {beforeText}
          </span>
        );
      }

      // Add tagged text with opening and closing tags visible
      const tagType = match[1];
      const tagContent = match[2];
      let tagClass = '';

      if (tagType === 'k') {
        tagClass = 'tag-purple';
      } else if (tagType === 'b') {
        tagClass = 'tag-orange';
      } else if (tagType === 'term') {
        tagClass = 'tag-gray';
      }

      parts.push(
        <React.Fragment key={`tag-${match.index}`}>
          <span
            className={`inline-tag inline-tag--open ${tagClass}`}
            contentEditable={false}
            data-tag="open"
            data-tag-type={tagType}
            onMouseDown={handleTagClick}
          >
            {tagType}
          </span>
          <span>{tagContent}</span>
          <span
            className={`inline-tag inline-tag--close ${tagClass}`}
            contentEditable={false}
            data-tag="close"
            data-tag-type={tagType}
            onMouseDown={handleTagClick}
          >
            {tagType}
          </span>
        </React.Fragment>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className={isSuggested ? 'suggested-text' : ''}>
          {text.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (!targetRef.current) return;

    // Clear selected class from all tags when user types
    const allTags = targetRef.current.querySelectorAll('.inline-tag');
    allTags.forEach(t => t.classList.remove('selected'));

    // Convert HTML back to tag notation
    const convertHTMLToTags = (element: HTMLElement): string => {
      let result = '';
      const nodes = Array.from(element.childNodes);

      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          result += node.textContent || '';
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;

          // Check if it's a tag element
          if (el.classList.contains('inline-tag')) {
            const tagType = el.getAttribute('data-tag-type');
            const isOpen = el.getAttribute('data-tag') === 'open';
            if (isOpen) {
              result += `[${tagType}]`;
            } else {
              result += `[/${tagType}]`;
            }
          } else {
            // Recursively process child nodes
            result += convertHTMLToTags(el);
          }
        }
      });

      return result;
    };

    const newText = convertHTMLToTags(targetRef.current);

    // Update current text for suggestion matching
    setCurrentText(newText);

    // Only update parent state without re-rendering this component
    onEdit(newText);

    // Re-attach handlers after content changes
    setTimeout(() => {
      attachTagHandlers();
    }, 0);
  };

  const handleCopy = (e: React.ClipboardEvent<HTMLDivElement>) => {
    // Check if selection contains any tags
    const selection = window.getSelection();
    if (!selection || !targetRef.current) return;

    const range = selection.getRangeAt(0);
    const container = document.createElement('div');
    container.appendChild(range.cloneContents());

    // Check if the selection contains any tag elements
    const hasTags = container.querySelector('.inline-tag') !== null;

    if (hasTags) {
      // Prevent copying tags - only allow cut
      e.preventDefault();
      // Optionally show a message or just silently prevent
      return;
    }
  };

  const handleCut = (e: React.ClipboardEvent<HTMLDivElement>) => {
    // Allow cut operations - this is the default behavior
    // Tags will be removed from the source and can be pasted elsewhere
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    // Get the HTML content being pasted
    const html = e.clipboardData.getData('text/html');

    // Check if we're pasting tags
    if (html.includes('inline-tag')) {
      // Check if target already contains these tags
      if (targetRef.current) {
        const parser = new DOMParser();
        const pastedDoc = parser.parseFromString(html, 'text/html');
        const pastedTags = pastedDoc.querySelectorAll('.inline-tag');

        pastedTags.forEach((pastedTag) => {
          const tagType = pastedTag.getAttribute('data-tag-type');
          const tagPosition = pastedTag.getAttribute('data-tag');

          // Check if this tag already exists in target
          const existingTag = targetRef.current!.querySelector(
            `.inline-tag[data-tag-type="${tagType}"][data-tag="${tagPosition}"]`
          );

          if (existingTag) {
            // Tag already exists, prevent paste
            e.preventDefault();
            return;
          }
        });
      }
    }
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // If click is not on a tag, clear all selected classes
    if (!target.classList.contains('inline-tag')) {
      if (targetRef.current) {
        const allTags = targetRef.current.querySelectorAll('.inline-tag');
        allTags.forEach(t => t.classList.remove('selected'));
      }
    }
  };

  const acceptSuggestion = (text: string) => {
    setCurrentText(text);
    onEdit(text);

    // Force re-render by updating the initial content
    initialTargetContent.current = text;

    // Force React to completely re-mount the contentEditable by changing the key
    setEditorKey(prev => prev + 1);

    // Re-attach handlers and set cursor after React has re-rendered
    setTimeout(() => {
      attachTagHandlers();

      // Move cursor to end
      if (targetRef.current) {
        targetRef.current.focus();
        const range = document.createRange();
        const sel = window.getSelection();
        if (targetRef.current.childNodes.length > 0) {
          range.selectNodeContents(targetRef.current);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }
    }, 0);
  };

  // Helper to render tags directly to DOM
  const renderTagsToDOM = (text: string, container: DocumentFragment | HTMLElement) => {
    const tagRegex = /\[(k|b|term)\](.*?)\[\/(k|b|term)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = tagRegex.exec(text)) !== null) {
      // Add text before tag
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        container.appendChild(document.createTextNode(beforeText));
      }

      // Add opening tag
      const tagType = match[1];
      let tagClass = '';
      if (tagType === 'k') tagClass = 'tag-purple';
      else if (tagType === 'b') tagClass = 'tag-orange';
      else if (tagType === 'term') tagClass = 'tag-gray';

      const openTag = document.createElement('span');
      openTag.className = `inline-tag inline-tag--open ${tagClass}`;
      openTag.contentEditable = 'false';
      openTag.setAttribute('data-tag', 'open');
      openTag.setAttribute('data-tag-type', tagType);
      openTag.textContent = tagType;
      container.appendChild(openTag);

      // Add content
      const content = document.createElement('span');
      content.textContent = match[2];
      container.appendChild(content);

      // Add closing tag
      const closeTag = document.createElement('span');
      closeTag.className = `inline-tag inline-tag--close ${tagClass}`;
      closeTag.contentEditable = 'false';
      closeTag.setAttribute('data-tag', 'close');
      closeTag.setAttribute('data-tag-type', tagType);
      closeTag.textContent = tagType;
      container.appendChild(closeTag);

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      container.appendChild(document.createTextNode(text.substring(lastIndex)));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const suggestion = getSuggestedCompletion();

    // Handle Enter key for suggestions
    if (e.key === 'Enter' && suggestion) {
      e.preventDefault();

      if (e.shiftKey) {
        // Shift+Enter: Accept complete suggestion
        const newText = currentText + suggestion;
        acceptSuggestion(newText);
      } else {
        // Enter: Accept next word only
        const nextWordMatch = suggestion.match(/^(\s*\S+)/);
        if (nextWordMatch) {
          const nextWord = nextWordMatch[1];
          const newText = currentText + nextWord;
          acceptSuggestion(newText);
        }
      }
      return;
    }

    // Prevent Cmd/Ctrl+C when tags are selected
    if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
      const selection = window.getSelection();
      if (!selection || !targetRef.current) return;

      const range = selection.getRangeAt(0);
      const container = document.createElement('div');
      container.appendChild(range.cloneContents());

      // Check if the selection contains any tag elements
      const hasTags = container.querySelector('.inline-tag') !== null;

      if (hasTags) {
        e.preventDefault();
        return;
      }
    }
  };

  // Calculate character counts (excluding tag notation)
  const sourceCharCount = segment.source.replace(/\[(k|b|term)\]|\[\/(k|b|term)\]/g, '').length;
  const targetCharCount = currentText.replace(/\[(k|b|term)\]|\[\/(k|b|term)\]/g, '').length;
  const isTargetExceeded = targetCharCount > sourceCharCount;

  return (
    <div
      className={`segment segment--${viewMode} ${isActive ? 'segment--active' : ''}`}
      onClick={onClick}
    >
      <div className="segment__content">
        {/* Source Section */}
        <div className="segment__source">
          <div className="segment__source-text">
            {isActive ? renderTextWithTags(segment.source) : segment.source.replace(/\[(k|b|term)\]|\[\/(k|b|term)\]/g, '')}
          </div>
          <div className="segment__char-count">{sourceCharCount}</div>
        </div>

        {/* Target Section */}
        <div className="segment__target">
          {isActive ? (
            <div className="segment__target-wrapper">
              <div
                key={`editable-${segment.id}-${editorKey}`}
                ref={targetRef}
                className="segment__target-text segment__target-text--editable"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onCopy={handleCopy}
                onCut={handleCut}
                onPaste={handlePaste}
                onClick={handleContentClick}
                dir="ltr"
              >
                {renderTextWithTags(initialTargetContent.current, false, true)}
              </div>
              {getSuggestedCompletion() && (
                <div className="segment__suggestion" aria-hidden="true">
                  {renderTextWithTags(currentText + getSuggestedCompletion()!, true, true)}
                </div>
              )}
            </div>
          ) : (
            <div className="segment__target-text">
              {segment.target.replace(/\[(k|b|term)\]|\[\/(k|b|term)\]/g, '')}
            </div>
          )}
          <div className={`segment__char-count ${isTargetExceeded ? 'segment__char-count--exceeded' : ''}`}>
            {targetCharCount}
          </div>
        </div>
      </div>

      {/* Status Icons Column */}
      <div className="segment__status-column">
        {/* Top icon - Warning/Error indicator */}
        <div className="segment__status-icon segment__status-icon--warning">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="#6e747e" strokeWidth="1" fill="none"/>
            <path d="M8 5v4M8 11h.01" stroke="#6e747e" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        {/* Bottom icon - Chat/Comment indicator */}
        <div className="segment__status-icon segment__status-icon--chat">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 9.5c0 .83-.67 1.5-1.5 1.5H5L2 14V3.5C2 2.67 2.67 2 3.5 2h9c.83 0 1.5.67 1.5 1.5v6z"
                  stroke="#6e747e"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Segment;
