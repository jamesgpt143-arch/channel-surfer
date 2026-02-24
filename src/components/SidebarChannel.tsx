import type { Channel } from "@/data/channels";

interface SidebarChannelProps {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}

const SidebarChannel = ({ channel, isActive, onClick }: SidebarChannelProps) => {
  const hue = channel.title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <button
      onClick={onClick}
      className={`flex gap-2 w-full text-left group hover:bg-[hsl(var(--channel-hover))] rounded-lg p-1.5 transition-colors ${
        isActive ? "bg-[hsl(var(--channel-hover))]" : ""
      }`}
    >
      {/* Mini Thumbnail */}
      <div
        className="w-[168px] min-w-[168px] aspect-video rounded-lg flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, hsl(${hue}, 40%, 20%), hsl(${(hue + 60) % 360}, 30%, 12%))`,
        }}
      >
        <span className="text-lg font-bold uppercase opacity-40 tracking-widest text-foreground">
          {channel.title.slice(0, 3)}
        </span>
        {isActive && (
          <span className="absolute top-1 right-1 bg-[hsl(var(--live-badge))] text-foreground text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
            LIVE
          </span>
        )}
      </div>
      {/* Info */}
      <div className="flex flex-col justify-center min-w-0 py-0.5">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 capitalize leading-tight">
          {channel.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">{channel.category}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Live now</p>
      </div>
    </button>
  );
};

export default SidebarChannel;
