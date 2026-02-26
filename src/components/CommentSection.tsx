import { useState, useEffect, useCallback } from "react";
import { MessageSquare, ThumbsUp, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AuthDialog from "./AuthDialog";

interface CommentData {
  id: string;
  channel_id: string;
  user_id: string;
  text: string;
  likes: number;
  created_at: string;
  display_name: string;
}

const formatTime = (timestamp: string): string => {
  const diff = Date.now() - new Date(timestamp).getTime();
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
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentData[]>([]);
  const [myLikes, setMyLikes] = useState<Set<string>>(new Set());
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch comments with profile display names
  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from("comments")
      .select("id, channel_id, user_id, text, likes, created_at")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: false });

    if (!data) return;

    // Fetch profile names for all unique user_ids
    const userIds = [...new Set(data.map((c: any) => c.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds);

    const nameMap = new Map((profiles || []).map((p: any) => [p.id, p.display_name]));

    setComments(
      data.map((c: any) => ({
        ...c,
        display_name: nameMap.get(c.user_id) || "User",
      }))
    );
  }, [channelId]);

  // Fetch my likes
  const fetchMyLikes = useCallback(async () => {
    if (!user) { setMyLikes(new Set()); return; }
    const { data } = await supabase
      .from("comment_likes")
      .select("comment_id")
      .eq("user_id", user.id);
    setMyLikes(new Set((data || []).map((l: any) => l.comment_id)));
  }, [user]);

  useEffect(() => {
    fetchComments();
    fetchMyLikes();
  }, [fetchComments, fetchMyLikes]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`comments-${channelId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments", filter: `channel_id=eq.${channelId}` },
        () => fetchComments()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [channelId, fetchComments]);

  const addComment = useCallback(async () => {
    if (!commentText.trim()) return;
    if (!user) { setAuthOpen(true); return; }
    setLoading(true);
    await supabase.from("comments").insert({
      channel_id: channelId,
      user_id: user.id,
      text: commentText.trim(),
    });
    setCommentText("");
    setLoading(false);
  }, [commentText, user, channelId]);

  const toggleLike = useCallback(async (commentId: string) => {
    if (!user) { setAuthOpen(true); return; }
    const liked = myLikes.has(commentId);
    if (liked) {
      await supabase.from("comment_likes").delete().eq("comment_id", commentId).eq("user_id", user.id);
      setMyLikes((prev) => { const next = new Set(prev); next.delete(commentId); return next; });
    } else {
      await supabase.from("comment_likes").insert({ comment_id: commentId, user_id: user.id });
      setMyLikes((prev) => new Set(prev).add(commentId));
    }
    fetchComments();
  }, [user, myLikes, fetchComments]);

  const deleteComment = useCallback(async (id: string) => {
    await supabase.from("comments").delete().eq("id", id);
  }, []);

  const getInitials = (name: string) => {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <div className="mt-6">
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 mb-4"
      >
        <MessageSquare className="w-5 h-5 text-foreground" />
        <span className="text-foreground font-medium">{comments.length} Comments</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <>
          {/* Comment Input */}
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 min-w-[40px] rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              {user ? getInitials(user.user_metadata?.display_name || "U") : "?"}
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder={user ? "Mag-comment..." : "Mag-login para maka-comment..."}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={() => { if (!user) setAuthOpen(true); }}
                onKeyDown={(e) => e.key === "Enter" && addComment()}
                className="w-full bg-transparent border-b border-border text-foreground py-2 text-sm outline-none focus:border-foreground placeholder:text-muted-foreground transition-colors"
              />
              {commentText && (
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setCommentText("")} className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full">
                    Cancel
                  </button>
                  <button onClick={addComment} disabled={loading} className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-medium hover:opacity-90 disabled:opacity-50">
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
                  {getInitials(c.display_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {c.user_id === user?.id ? "You" : `@${c.display_name.replace(/ /g, "").toLowerCase()}`}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatTime(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-foreground mt-0.5">{c.text}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <button
                      onClick={() => toggleLike(c.id)}
                      className={`flex items-center gap-1 transition-colors ${myLikes.has(c.id) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="text-xs">{c.likes}</span>
                    </button>
                    {c.user_id === user?.id && (
                      <button onClick={() => deleteComment(c.id)} className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Wala pang comments. Maging una kang mag-comment!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentSection;
