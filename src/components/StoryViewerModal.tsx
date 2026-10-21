import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Heart, ShieldCheck, MapPin } from 'lucide-react';
import type { StoryItem } from '../types';
import { alertAudio } from '../utils/soundEffects';

interface StoryViewerModalProps {
  stories: StoryItem[];
  initialIndex: number;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [reactionSent, setReactionSent] = useState<string | null>(null);

  const currentStory = stories[currentIndex];

  // Auto advance story progress
  useEffect(() => {
    if (isPaused) return;
    setProgress(0);

    const step = 2; // update every 50ms (total 2500ms duration)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            clearInterval(interval);
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, stories.length, onClose]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleSendReaction = (emoji: string) => {
    alertAudio.playLikeChime();
    setReactionSent(emoji);
    setTimeout(() => setReactionSent(null), 1800);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    alertAudio.playLikeChime();
    setReactionSent('Mensaje enviado');
    setReplyText('');
    setTimeout(() => setReactionSent(null), 1800);
  };

  if (!currentStory) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-2 sm:p-4 select-none"
    >
      {/* Navigation Buttons for Desktop */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className={`hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900/80 text-white border border-neutral-700 hover:bg-neutral-800 transition-colors mr-4 ${
          currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
        }`}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Main Story Phone Aspect Container */}
      <div
        className="relative w-full max-w-md h-[90vh] max-h-[820px] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Image / Video Simulation */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentStory.mediaUrl}
            alt={currentStory.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />
        </div>

        {/* Top Story Header & Segmented Progress Bars */}
        <div className="relative z-10 p-3 sm:p-4 space-y-3">
          {/* Multi-story Segment Progress Indicators */}
          <div className="flex items-center gap-1.5 w-full">
            {stories.map((story, idx) => {
              let fill = 0;
              if (idx < currentIndex) fill = 100;
              else if (idx === currentIndex) fill = progress;
              return (
                <div
                  key={story.id}
                  className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all duration-75 ease-linear"
                    style={{ width: `${fill}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Profile & Metadata */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-lg border-2 border-rose-500 shadow-md">
                {currentStory.avatar}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold tracking-tight">{currentStory.author}</span>
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span className="text-xs text-white/70">· {currentStory.time}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-white/80">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <span>{currentStory.location}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reaction Splash Feedback Animation */}
        {reactionSent && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-in zoom-in-50 duration-200">
            <span className="text-6xl drop-shadow-lg">{reactionSent}</span>
          </div>
        )}

        {/* Tap areas for mobile story stepping */}
        <div className="absolute inset-y-20 inset-x-0 z-0 flex">
          <div className="w-1/2 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-1/2 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Story Caption & Interactive Bottom Bar */}
        <div className="relative z-10 p-4 space-y-3">
          {/* Story text caption */}
          <div className="bg-black/65 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs text-white leading-relaxed">
            <p className="font-semibold text-rose-300 mb-1">{currentStory.title}</p>
            <p>{currentStory.caption}</p>
          </div>

          {/* Quick Emoji Reaction Buttons */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {['🚨', '🔥', '🛡️', '🇮🇱', '🇺🇸', '🕊️'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleSendReaction(emoji)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm text-base flex items-center justify-center transition-transform hover:scale-115 active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Direct Reply Bar */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Responder a ${currentStory.handle}...`}
              className="flex-1 bg-neutral-900/80 border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-500 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Navigation Arrow for Desktop */}
      <button
        onClick={handleNext}
        className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900/80 text-white border border-neutral-700 hover:bg-neutral-800 transition-colors ml-4"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
