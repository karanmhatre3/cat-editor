import React from 'react';
import './BottomBar.css';

interface Document {
  id: string;
  name: string;
  isActive: boolean;
}

interface BottomBarProps {
  documents: Document[];
  onDocumentClick?: (documentId: string) => void;
  currentProgress: {
    translated: number;
    total: number;
  };
  status: string;
}

const BottomBar: React.FC<BottomBarProps> = ({
  documents,
  onDocumentClick,
  currentProgress,
  status
}) => {
  return (
    <div className="bottom-bar">
      <div className="bottom-bar__left">
        {documents.map((doc) => (
          <button
            key={doc.id}
            className={`bottom-bar__document ${doc.isActive ? 'bottom-bar__document--active' : ''}`}
            onClick={() => onDocumentClick?.(doc.id)}
          >
            {doc.name}
          </button>
        ))}
      </div>
      <div className="bottom-bar__right">
        <span className="bottom-bar__status-badge">{status}</span>
        <p className="bottom-bar__progress">
          <span className="bottom-bar__progress-numbers">{currentProgress.translated}/{currentProgress.total} </span>
          <span className="bottom-bar__progress-label">words translated</span>
        </p>
      </div>
    </div>
  );
};

export default BottomBar;
