// Renders one or more schema.org nodes as a single JSON-LD @graph.
export function JsonLd({ data }: { data: object | object[] }) {
  const graph = { "@context": "https://schema.org", "@graph": Array.isArray(data) ? data : [data] };
  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
