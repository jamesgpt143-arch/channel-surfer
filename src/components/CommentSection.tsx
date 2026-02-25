import { useState, useEffect, useCallback } from "react";
import { MessageSquare, ThumbsUp, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: number; // timestamp
  likes: number;
  likedByMe: boolean;
}

const STORAGE_KEY = "pinoytv_comments";

const getStoredComments = (channelId: string): Comment[] => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return data[channelId] || [];
  } catch {
    return [];
  }
};

const saveComments = (channelId: string, comments: Comment[]) => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    data[channelId] = comments;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

const seedComments: Omit<Comment, "id">[] = [
  { user: "Juan dela Cruz", avatar: "JD", text: "Ganda ng stream! Crystal clear ang quality 🔥", time: Date.now() - 120000, likes: 12, likedByMe: false },
  { user: "Maria Santos", avatar: "MS", text: "Salamat sa free live TV! Ang dami pang channels", time: Date.now() - 300000, likes: 8, likedByMe: false },
  { user: "Pedro Reyes", avatar: "PR", text: "May bagong channel ba na dadagdag dito?", time: Date.now() - 600000, likes: 3, likedByMe: false },
  { user: "Ana Garcia", avatar: "AG", text: "Super smooth ng playback, walang buffer!", time: Date.now() - 900000, likes: 21, likedByMe: false },
  { user: "Carlo Mendoza", avatar: "CM", text: "Paborito ko talaga yung sports channels dito 💪", time: Date.now() - 1200000, likes: 5, likedByMe: false },
];

const formatTime = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

interface CommentSectionProps {
  channelId: string;
}

const CommentSection = ({ channelId }: CommentSectionProps) => {
  const [expanded, setExpanded] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  // Load comments for this channel
  useEffect(() => {
    const stored = getStoredComments(channelId);
    if (stored.length > 0) {
      setComments(stored);
    } else {
      // Seed with default comments
      const seeded = seedComments.map((c, i) => ({ ...c, id: `seed-${i}` }));
      setComments(seeded);
      saveComments(channelId, seeded);
    }
  }, [channelId]);

  const addComment = useCallback(() => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: `user-${Date.now()}`,
      user: "You",
      avatar: "U",
      text: commentText.trim(),
      time: Date.now(),
      likes: 0,
      likedByMe: false,
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    saveComments(channelId, updated);
    setCommentText("");
  }, [commentText, comments, channelId]);

  const toggleLike = useCallback((id: string) => {
    setComments((prev) => {
      const updated = prev.map((c) =>
        c.id === id
          ? { ...c, likedByMe: !c.likedByMe, likes: c.likedByMe ? c.likes - 1 : c.likes + 1 }
          : c
      );
      saveComments(channelId, updated);
      return updated;
    });
  }, [channelId]);

  const deleteComment = useCallback((id: string) => {
    setComments((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveComments(channelId, updated);
      return updated;
    });
  }, [channelId]);

  return (
    <div className="mt-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 mb-4"
      >
        <MessageSquare className="w-5 h-5 text-foreground" />
        <span className="text-foreground font-medium">{comments.length} Comments</span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <>
          {/* Comment Input */}
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 min-w-[40px] rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              U
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Mag-comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addComment()}
                className="w-full bg-transparent border-b border-border text-foreground py-2 text-sm outline-none focus:border-foreground placeholder:text-muted-foreground transition-colors"
              />
              {commentText && (
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setCommentText("")}
                    className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addComment}
                    className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-medium hover:opacity-90"
                  >
                    Comment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3 group">
                <div className="w-10 h-10 min-w-[40px] rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {c.user === "You" ? "You" : `@${c.user.replace(/ /g, "").toLowerCase()}`}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatTime(c.time)}</span>
                  </div>
                  <p className="text-sm text-foreground mt-0.5">{c.text}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <button
                      onClick={() => toggleLike(c.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        c.likedByMe ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="text-xs">{c.likes}</span>
                    </button>
                    {c.user === "You" && (
                      <button
                        onClick={() => deleteComment(c.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentSection;
