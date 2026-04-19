// VideoEmbed
// ui-ux-pro-max: ux-guidelines.csv "Auto-Play Video" (Severity Medium — click-to-play, never autoplay)
// ui-ux-pro-max: stacks/nextjs.csv "Avoid layout shifts" (Severity High — aspect-video wrapper reserves space)
// DESIGN-SYSTEM.md §6 VideoEmbed — iframe loading="lazy", no autoplay param, descriptive title for SR users.

import { youtubeEmbedUrl } from "@/lib/youtube";

export function VideoEmbed({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title: string;
}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md border border-rule bg-ink">
      <iframe
        src={youtubeEmbedUrl(youtubeId, { noCookie: true })}
        title={`YouTube player: ${title}`}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
