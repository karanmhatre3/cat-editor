import React, { useState, useEffect } from 'react';
import Segment from '../Segment/Segment';
import { SegmentData } from '../../types/segment';
import { ViewMode } from '../TopBar/TopBar';
import segmentsDataRaw from '../../data/segments.json';
import './SegmentList.css';

interface SegmentListProps {
  viewMode: ViewMode;
  onSegmentSelect?: (segment: SegmentData | null) => void;
}

const SegmentList: React.FC<SegmentListProps> = ({ viewMode, onSegmentSelect }) => {
  const [segments, setSegments] = useState<SegmentData[]>(() =>
    segmentsDataRaw.map(seg => ({
      ...seg,
      status: seg.status as SegmentData['status'],
      tmMatches: seg.tmMatches?.map(match => ({
        ...match,
        type: match.type as 'TB' | 'TM'
      })),
      issues: seg.issues?.map(issue => ({
        ...issue,
        type: issue.type as 'error' | 'warning',
        category: issue.category as 'reviewer' | 'ai-qa',
        severity: issue.severity as 'high' | 'medium' | 'low'
      }))
    }))
  );
  const [activeSegmentId, setActiveSegmentId] = useState<number | null>(1); // Start with first segment active

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD/Ctrl + Arrow Up/Down
      if ((e.metaKey || e.ctrlKey) && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();

        const currentIndex = segments.findIndex(seg => seg.id === activeSegmentId);

        if (e.key === 'ArrowDown' && currentIndex < segments.length - 1) {
          // Move to next segment
          setActiveSegmentId(segments[currentIndex + 1].id);
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
          // Move to previous segment
          setActiveSegmentId(segments[currentIndex - 1].id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [segments, activeSegmentId]);

  const handleSegmentClick = (segmentId: number) => {
    setActiveSegmentId(segmentId);
    const segment = segments.find(seg => seg.id === segmentId);
    onSegmentSelect?.(segment || null);
  };

  // Notify parent of initial active segment
  useEffect(() => {
    const segment = segments.find(seg => seg.id === activeSegmentId);
    onSegmentSelect?.(segment || null);
  }, [activeSegmentId, segments, onSegmentSelect]);

  const handleSegmentEdit = (segmentId: number, newTarget: string) => {
    setSegments(prevSegments =>
      prevSegments.map(seg =>
        seg.id === segmentId
          ? { ...seg, target: newTarget, status: 'editing' as const }
          : seg
      )
    );
  };

  return (
    <div className={`segment-list segment-list--${viewMode}`}>
      <div className="segment-list__content">
        {segments.map(segment => (
          <Segment
            key={segment.id}
            segment={segment}
            isActive={activeSegmentId === segment.id}
            onClick={() => handleSegmentClick(segment.id)}
            onEdit={(newTarget) => handleSegmentEdit(segment.id, newTarget)}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default SegmentList;
