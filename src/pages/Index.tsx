import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import ChannelCard from "@/components/ChannelCard";
import CategoryFilter from "@/components/CategoryFilter";
import { channels, categories } from "@/data/channels";
import type { Channel } from "@/data/channels";

const Index = () => {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

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
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
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

      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6">
        {/* Player Section */}
        {activeChannel && (
          <div className="mb-6">
            <div className="max-w-4xl">
              <VideoPlayer channel={activeChannel} />
              <div className="mt-3">
                <h2 className="text-xl font-bold text-foreground capitalize">{activeChannel.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[hsl(var(--live-badge))] text-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    LIVE
                  </span>
                  <span className="text-sm text-muted-foreground">{activeChannel.category}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-4">
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((ch) => (
            <ChannelCard
              key={ch.id}
              channel={ch}
              isActive={activeChannel?.id === ch.id}
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
    </div>
  );
};

export default Index;
