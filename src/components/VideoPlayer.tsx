import { useEffect, useRef, useState } from "react";
// @ts-ignore
import shaka from "shaka-player/dist/shaka-player.compiled";
import type { Channel } from "@/data/channels";

interface VideoPlayerProps {
  channel: Channel | null;
}

const VideoPlayer = ({ channel }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<shaka.Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    shaka.polyfill.installAll();
  }, []);

  useEffect(() => {
    if (!channel || !videoRef.current) return;

    const initPlayer = async () => {
      setError(null);
      setLoading(true);

      if (playerRef.current) {
        await playerRef.current.destroy();
      }

      const player = new shaka.Player();
      await player.attach(videoRef.current!);
      playerRef.current = player;

      // Configure ClearKey DRM
      const clearKeys: Record<string, string> = {};
      channel.keys.forEach(({ kid, key }) => {
        clearKeys[kid] = key;
      });

      player.configure({
        drm: {
          clearKeys,
        },
      });

      player.addEventListener("error", (event: any) => {
        console.error("Shaka error:", event.detail);
        setError("Hindi ma-load ang channel. Subukan ulit.");
        setLoading(false);
      });

      try {
        await player.load(channel.manifest);
        setLoading(false);
        videoRef.current?.play();
      } catch (e: any) {
        console.error("Load error:", e);
        setError("Hindi ma-load ang channel. Subukan ulit.");
        setLoading(false);
      }
    };

    initPlayer();

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [channel]);

  if (!channel) {
    return (
      <div className="w-full aspect-video bg-[hsl(var(--player-bg))] rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📺</div>
          <p className="text-muted-foreground text-lg">Pumili ng channel para manood</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-[hsl(var(--player-bg))] rounded-xl overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[hsl(var(--player-bg))]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Loading {channel.title}...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[hsl(var(--player-bg))]">
          <div className="text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
      />
    </div>
  );
};

export default VideoPlayer;
