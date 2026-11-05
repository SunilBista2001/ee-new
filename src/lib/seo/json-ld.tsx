import type { Organization, WebSite, WithContext } from 'schema-dts';

type JsonLdDocument = WithContext<Organization> | WithContext<WebSite>;

/**
 * Renders schema.org JSON-LD. `<` is escaped so content can never close the script tag
 * (pattern from the Next.js JSON-LD guide).
 */
export function JsonLd({ data }: { data: JsonLdDocument | JsonLdDocument[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
