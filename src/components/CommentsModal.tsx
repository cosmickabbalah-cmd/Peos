import React, { useState } from 'react';
import { X, Send, Heart, ShieldCheck } from 'lucide-react';
import type { FeedPost, CommentItem } from '../types';
import { alertAudio } from '../utils/soundEffects';

interface CommentsModalProps {
  post: FeedPost;
  onClose: () => void;
  onAddComment: (postId: string, comment: CommentItem) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  post,
  onClose,
  onAddComment
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<CommentItem[]>(post.comments || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      user: 'Usuario Observador (Tú)',
      handle: 'usuario_civil',
      avatar: '🛡️',
      text: newCommentText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      likes: 1
    };

    setCommentsList((prev) => [newComment, ...prev]);
    onAddComment(post.id, newComment);
    setNewCommentText('');
    alertAudio.playLikeChime();
  };

  const handleLikeComment = (commentId: string) => {
    setCommentsList((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      )
    );
    alertAudio.playLikeChime();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="w-full sm:max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-2xl max-h-[85vh] h-[75vh] flex flex-col shadow-2xl text-neutral-100 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight">Comentarios de Inteligencia</h3>
            <span className="text-xs text-neutral-400">({commentsList.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Summary Kicker */}
        <div className="p-4 bg-neutral-950/60 border-b border-neutral-800/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm shrink-0">
            {post.authorAvatar}
          </div>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-neutral-200">@{post.authorHandle}</span>
              {post.verified && <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />}
            </div>
            <p className="text-neutral-300 line-clamp-2 leading-relaxed">{post.captionEs}</p>
          </div>
        </div>

        {/* Comments Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {commentsList.map((comment) => (
            <div key={comment.id} className="flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-xs shrink-0 border border-neutral-700">
                  {comment.avatar}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-neutral-200">@{comment.handle}</span>
                    {comment.verified && <ShieldCheck className="w-3 h-3 text-sky-400" />}
                    <span className="text-[11px] text-neutral-500">· {comment.timestamp}</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed">{comment.text}</p>
                </div>
              </div>

              <button
                onClick={() => handleLikeComment(comment.id)}
                className="flex flex-col items-center gap-0.5 text-neutral-500 hover:text-rose-400 transition-colors p-1"
              >
                <Heart className="w-3.5 h-3.5" />
                <span className="text-[10px] tabular-nums">{comment.likes}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Comment Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Añadir un comentario o reporte de campo..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
              newCommentText.trim()
                ? 'bg-rose-600 text-white hover:bg-rose-500'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-3 h-3" />
            <span>Publicar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
