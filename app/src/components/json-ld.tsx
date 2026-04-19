// JsonLd
// Emits a <script type="application/ld+json"> tag with escaped JSON.
// DESIGN-SYSTEM.md / TRD §6 structured data per page type (WebSite, VideoObject, Article, Place, Restaurant, Event).

export function JsonLd({ data }: { data: unknown }) {
  // Defense-in-depth: replace `<` to guard against injected `</script>`.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
