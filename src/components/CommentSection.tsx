import { useState } from "react";
import { MessageSquare, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";

interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

const fakeComments: Comment[] = [
  { id: 1, user: "Juan dela Cruz", avatar: "JD", text: "Ganda ng stream! Crystal clear ang quality 🔥", time: "2 mins ago", likes: 12 },
  { id: 2, user: "Maria Santos", avatar: "MS", text: "Salamat sa free live TV! Ang dami pang channels", time: "5 mins ago", likes: 8 },
  { id: 3, user: "Pedro Reyes", avatar: "PR", text: "May bagong channel ba na dadagdag dito?", time: "10 mins ago", likes: 3 },
  { id: 4, user: "Ana Garcia", avatar: "AG", text: "Super smooth ng playback, walang buffer!", time: "15 mins ago", likes: 21 },
  { id: 5, user: "Carlo Mendoza", avatar: "CM", text: "Paborito ko talaga yung sports channels dito 💪", time: "20 mins ago", likes: 5 },
];

const CommentSection = () => {
  const [expanded, setExpanded] = useState(true);
  const [commentText, setCommentText] = useState("");

  return (
    <div className="mt-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 mb-4"
      >
        <MessageSquare className="w-5 h-5 text-foreground" />
        <span className="text-foreground font-medium">{fakeComments.length} Comments</span>
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
                  <button className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-medium hover:opacity-90">
                    Comment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {fakeComments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-10 h-10 min-w-[40px] rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">@{c.user.replace(/ /g, "").toLowerCase()}</span>
                    <span className="text-xs text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="text-sm text-foreground mt-0.5">{c.text}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="text-xs">{c.likes}</span>
                    </button>
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Reply
                    </button>
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
