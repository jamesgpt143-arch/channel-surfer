import { useState, useMemo } from "react";
import { Search, ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import ChannelCard from "@/components/ChannelCard";
import SidebarChannel from "@/components/SidebarChannel";
import CategoryFilter from "@/components/CategoryFilter";
import CommentSection from "@/components/CommentSection";
import { channels, categories } from "@/data/channels";
import type { Channel } from "@/data/channels";

const Index = () => {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [descExpanded, setDescExpanded] = useState(false);

  const filtered = useMemo(() => {
    return channels.filter((ch) => {
      const matchCat = activeCategory === "All" || ch.category === activeCategory;
      const matchSearch = ch.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-6 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📺</span>
            <h1 className="text-lg font-bold text-foreground hidden sm:block">PinoyTV</h1>
          </div>
          <div className="flex-1 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Maghanap ng channel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-secondary text-foreground pl-10 pr-4 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground hidden md:block">
            {channels.length} channels
          </div>
        </div>
      </header>

      {/* WATCH MODE - Desktop: Player left + sidebar right | Mobile: stacked */}
      {activeChannel ? (
        <main className="max-w-[1800px] mx-auto px-0 md:px-6 py-0 md:py-6">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 lg:h-[calc(100vh-3.5rem)]">
            {/* Left Column - Player + Info + Comments (scrollable together) */}
            <div className="flex-1 min-w-0 lg:overflow-y-auto lg:scrollbar-hide">
              {/* Video Player - sticky on mobile, static on desktop */}
              <div className="sticky top-14 z-40 lg:static lg:rounded-xl overflow-hidden bg-background">
                <VideoPlayer channel={activeChannel} />
              </div>

              {/* Video Info - YouTube style */}
              <div className="px-3 md:px-0 mt-3">
                <h2 className="text-lg md:text-xl font-bold text-foreground capitalize">
                  {activeChannel.title}
                </h2>

                {/* Channel info + actions row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                  {/* Channel avatar + name */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm uppercase">
                      {activeChannel.title.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">{activeChannel.title}</p>
                      <p className="text-xs text-muted-foreground">{activeChannel.category}</p>
                    </div>
                    <span className="bg-[hsl(var(--live-badge))] text-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-1">
                      LIVE
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                    <div className="flex items-center bg-secondary rounded-full">
                      <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-foreground hover:bg-[hsl(var(--channel-hover))] rounded-l-full transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-xs">Like</span>
                      </button>
                      <div className="w-px h-6 bg-border" />
                      <button className="flex items-center px-3 py-2 text-foreground hover:bg-[hsl(var(--channel-hover))] rounded-r-full transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="flex items-center gap-1.5 bg-secondary px-3 py-2 rounded-full text-sm text-foreground hover:bg-[hsl(var(--channel-hover))] transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs hidden sm:inline">Share</span>
                    </button>
                    <button className="flex items-center gap-1.5 bg-secondary px-3 py-2 rounded-full text-sm text-foreground hover:bg-[hsl(var(--channel-hover))] transition-colors">
                      <Download className="w-4 h-4" />
                      <span className="text-xs hidden sm:inline">Save</span>
                    </button>
                    <button className="flex items-center bg-secondary p-2 rounded-full text-foreground hover:bg-[hsl(var(--channel-hover))] transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description box */}
                <div
                  className="mt-3 bg-secondary rounded-xl p-3 cursor-pointer hover:bg-[hsl(var(--channel-hover))] transition-colors"
                  onClick={() => setDescExpanded(!descExpanded)}
                >
                  <p className="text-xs font-medium text-foreground">Live now • Streaming</p>
                  {descExpanded ? (
                    <div className="mt-1">
                      <p className="text-sm text-foreground">
                        Panoorin ang {activeChannel.title} live stream. Category: {activeChannel.category}.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">Show less</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-0.5">...more</p>
                  )}
                </div>

                {/* Comments - Desktop */}
                <div className="hidden md:block pb-10">
                  <CommentSection />
                </div>
              </div>
            </div>

            {/* Right Column - Recommended channels sidebar (desktop, independent scroll) */}
            <div className="hidden lg:block w-[402px] min-w-[402px] overflow-y-auto">
              <div className="mb-3">
                <CategoryFilter
                  categories={categories}
                  active={activeCategory}
                  onSelect={setActiveCategory}
                />
              </div>
              <div className="space-y-2">
                {filtered
                  .filter((ch) => ch.id !== activeChannel.id)
                  .map((ch) => (
                    <SidebarChannel
                      key={ch.id}
                      channel={ch}
                      isActive={false}
                      onClick={() => {
                        setActiveChannel(ch);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  ))}
              </div>
            </div>

            {/* Mobile: channel list below player */}
            <div className="lg:hidden px-3 mt-4">
              {/* Comments on mobile */}
              <div className="md:hidden">
                <CommentSection />
              </div>

              <div className="mt-6 mb-3">
                <CategoryFilter
                  categories={categories}
                  active={activeCategory}
                  onSelect={setActiveCategory}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-6">
                {filtered
                  .filter((ch) => ch.id !== activeChannel.id)
                  .map((ch) => (
                    <ChannelCard
                      key={ch.id}
                      channel={ch}
                      isActive={false}
                      onClick={() => {
                        setActiveChannel(ch);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* BROWSE MODE - Channel grid (YouTube home) */
        <main className="max-w-[1800px] mx-auto px-3 sm:px-6 py-4 md:py-6">
          <div className="mb-4">
            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
            {filtered.map((ch) => (
              <ChannelCard
                key={ch.id}
                channel={ch}
                isActive={false}
                onClick={() => setActiveChannel(ch)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Walang nahanap na channel</p>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default Index;
