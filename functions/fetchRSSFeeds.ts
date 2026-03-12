import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const RSS_FEEDS = [
  { url: "https://www.sciencedaily.com/rss/mind_brain/consciousness.xml", source: "Science Daily - Consciousness", category: "consciousness" },
  { url: "https://blogs.scientificamerican.com/observations/feed/", source: "Scientific American", category: "neuroscience" },
  { url: "https://www.psychologytoday.com/us/blog/consciousness-and-the-brain/feed", source: "Psychology Today", category: "consciousness" },
  { url: "https://irva.org/feed/", source: "IRVA - Remote Viewing", category: "remote_viewing" },
  { url: "https://www.sheldrake.org/feed", source: "Rupert Sheldrake", category: "parapsychology" },
  { url: "https://noetic.org/feed/", source: "Institute of Noetic Sciences", category: "consciousness" },
  { url: "https://psi-encyclopedia.spr.ac.uk/feed", source: "SPR Psi Encyclopedia", category: "parapsychology" },
  { url: "https://www.dailygrail.com/feed/", source: "The Daily Grail", category: "uap_anomalous" },
  { url: "https://www.frontiersin.org/journals/consciousness/rss", source: "Frontiers in Consciousness", category: "consciousness" },
  { url: "https://mindmatters.ai/feed/", source: "Mind Matters", category: "neuroscience" },
  { url: "https://realitysandwich.com/feed/", source: "Reality Sandwich", category: "psychedelics" },
  { url: "https://www.theunexplained.tv/feed/", source: "The Unexplained", category: "uap_anomalous" },
  { url: "https://www.consciousnessresearch.com/feed", source: "Consciousness Research", category: "consciousness" },
  { url: "https://maps.org/feed/", source: "MAPS", category: "psychedelics" },
  { url: "https://tricycle.org/feed/", source: "Tricycle - Meditation", category: "meditation" },
  { url: "https://www.lionsroar.com/feed/", source: "Lion's Roar", category: "meditation" },
];

function extractImageFromContent(content) {
  if (!content) return null;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  const mediaMatch = content.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (mediaMatch) return mediaMatch[1];
  const enclosureMatch = content.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  if (enclosureMatch) return enclosureMatch[1];
  return null;
}

function extractImage(item, fullXml) {
  // Try media:content
  const mediaContent = item.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (mediaContent) return mediaContent[1];

  // Try media:thumbnail
  const mediaThumbnail = item.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
  if (mediaThumbnail) return mediaThumbnail[1];

  // Try enclosure
  const enclosure = item.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image/i);
  if (enclosure) return enclosure[1];

  // Try image in content
  const contentEncoded = item.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i);
  if (contentEncoded) {
    const img = extractImageFromContent(contentEncoded[1]);
    if (img) return img;
  }

  // Try description
  const desc = item.match(/<description>([\s\S]*?)<\/description>/i);
  if (desc) {
    const img = extractImageFromContent(desc[1]);
    if (img) return img;
  }

  return null;
}

function getTextContent(item, tag) {
  const cdataMatch = item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'));
  if (cdataMatch) return cdataMatch[1].trim();
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (match) return match[1].replace(/<[^>]+>/g, '').trim();
  return null;
}

function parseRSSItems(xml, feedInfo) {
  const items = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/gi) || [];
  
  for (const itemXml of itemMatches.slice(0, 15)) {
    const title = getTextContent(itemXml, 'title');
    const link = getTextContent(itemXml, 'link');
    const description = getTextContent(itemXml, 'description');
    const pubDate = getTextContent(itemXml, 'pubDate');
    const image = extractImage(itemXml, xml);
    
    // Extract categories/tags from feed
    const categoryMatches = itemXml.match(/<category[^>]*>([\s\S]*?)<\/category>/gi) || [];
    const tags = categoryMatches.map(c => {
      const cdataMatch = c.match(/>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*</);
      if (cdataMatch) return cdataMatch[1].trim().toLowerCase();
      return c.replace(/<[^>]+>/g, '').trim().toLowerCase();
    }).filter(Boolean);

    if (title && link) {
      items.push({
        title: title.substring(0, 300),
        description: description ? description.substring(0, 500) : "",
        link,
        image_url: image || "",
        source: feedInfo.source,
        source_url: feedInfo.url,
        category: feedInfo.category,
        tags: tags.length > 0 ? tags.slice(0, 5) : [feedInfo.category],
        pub_date: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        is_featured: false,
      });
    }
  }
  return items;
}

// Also handle Atom feeds
function parseAtomItems(xml, feedInfo) {
  const items = [];
  const entryMatches = xml.match(/<entry>([\s\S]*?)<\/entry>/gi) || [];
  
  for (const entryXml of entryMatches.slice(0, 15)) {
    const title = getTextContent(entryXml, 'title');
    const linkMatch = entryXml.match(/<link[^>]+href=["']([^"']+)["']/i);
    const link = linkMatch ? linkMatch[1] : null;
    const summary = getTextContent(entryXml, 'summary') || getTextContent(entryXml, 'content');
    const published = getTextContent(entryXml, 'published') || getTextContent(entryXml, 'updated');
    const image = extractImage(entryXml, xml);

    if (title && link) {
      items.push({
        title: title.substring(0, 300),
        description: summary ? summary.substring(0, 500) : "",
        link,
        image_url: image || "",
        source: feedInfo.source,
        source_url: feedInfo.url,
        category: feedInfo.category,
        tags: [feedInfo.category],
        pub_date: published ? new Date(published).toISOString() : new Date().toISOString(),
        is_featured: false,
      });
    }
  }
  return items;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  const user = await base44.auth.me();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allArticles = [];
  const errors = [];

  for (const feedInfo of RSS_FEEDS) {
    try {
      const response = await fetch(feedInfo.url, {
        headers: { 'User-Agent': 'ConsciousnessRSSReader/1.0' },
        signal: AbortSignal.timeout(10000),
      });
      
      if (!response.ok) {
        errors.push({ source: feedInfo.source, error: `HTTP ${response.status}` });
        continue;
      }

      const xml = await response.text();
      
      let items;
      if (xml.includes('<entry>')) {
        items = parseAtomItems(xml, feedInfo);
      } else {
        items = parseRSSItems(xml, feedInfo);
      }
      
      allArticles.push(...items);
    } catch (err) {
      errors.push({ source: feedInfo.source, error: err.message });
    }
  }

  // Mark some as featured (latest from each source)
  const sourceMap = {};
  for (const article of allArticles) {
    if (!sourceMap[article.source]) {
      sourceMap[article.source] = article;
      article.is_featured = true;
    }
  }

  // Delete old articles (older than 7 days)
  try {
    const existingArticles = await base44.asServiceRole.entities.Article.filter({});
    for (const existing of existingArticles) {
      await base44.asServiceRole.entities.Article.delete(existing.id);
    }
  } catch (e) {
    // Ignore cleanup errors
  }

  // Bulk create new articles
  let created = 0;
  const batchSize = 25;
  for (let i = 0; i < allArticles.length; i += batchSize) {
    const batch = allArticles.slice(i, i + batchSize);
    try {
      await base44.asServiceRole.entities.Article.bulkCreate(batch);
      created += batch.length;
    } catch (e) {
      errors.push({ error: `Bulk create failed: ${e.message}` });
    }
  }

  return Response.json({
    success: true,
    total_fetched: allArticles.length,
    created,
    errors,
    sources_attempted: RSS_FEEDS.length,
  });
});