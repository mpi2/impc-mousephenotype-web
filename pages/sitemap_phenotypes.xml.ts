import phenotypesList from '../mocks/data/all_phenotypes_list.json';
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

function getFormatedDate(date: Date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.getDay().toString().padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
function generateSiteMap() {
  const now = new Date();
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    ${phenotypesList.map(geneAccessionId => {
    return `
      <url>
        <loc>${WEBSITE_URL}/data/phenotypes/${geneAccessionId}</loc>
        <lastmod>${getFormatedDate(now)}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
      </url>
    `;
  })
    .join("")}
   </urlset>
 `;
}
export function getServerSideProps({ res }) {
  const sitemap = generateSiteMap();
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
}
export default function PhenotypesSiteMap() {};