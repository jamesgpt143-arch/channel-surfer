import type { Channel } from "@/data/channels";

interface ChannelCardProps {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}

const ChannelCard = ({ channel, isActive, onClick }: ChannelCardProps) => {
  // Generate a deterministic color based on channel title
  const hue = channel.title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <button
      onClick={onClick}
      className={`group w-full text-left rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.02] ${
        isActive ? "ring-2 ring-[hsl(var(--live-badge))]" : ""
      }`}
    >
      {/* Thumbnail */}
      <div
        className="aspect-video w-full flex items-center justify-center relative"
        style={{
          background: channel.logo ? undefined : `linear-gradient(135deg, hsl(${hue}, 40%, 20%), hsl(${(hue + 60) % 360}, 30%, 12%))`,
        }}
      >
        {channel.logo ? (
          <img src={channel.logo} alt={channel.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-bold uppercase opacity-40 tracking-widest text-foreground">
            {channel.title.slice(0, 3)}
          </span>
        )}
        {isActive && (
          <span className="absolute top-2 right-2 bg-[hsl(var(--live-badge))] text-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            LIVE
          </span>
        )}
        <span className="absolute bottom-2 right-2 bg-background/80 text-foreground text-[10px] px-1.5 py-0.5 rounded">
          {channel.category}
        </span>
      </div>
      {/* Info */}
      <div className="p-3 bg-card group-hover:bg-[hsl(var(--channel-hover))] transition-colors">
        <h3 className="text-sm font-medium text-foreground truncate capitalize">
          {channel.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">Live • {channel.category}</p>
      </div>
    </button>
  );
};

export default ChannelCard;
