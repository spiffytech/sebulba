import FeedMe from 'feedme';

import {Feed, FeedItem} from '../lib/types';

export function parseOpml(opml: string): Feed[] {
  const opmlText = (event.target as any).result;
  const dom = new DOMParser().parseFromString(opmlText, 'text/xml');
  const nodes = Array.from(
    dom.querySelectorAll('body outline[type="rss"][text][xmlUrl]')
  );
  return nodes.map((node) => ({
    name: (node.attributes as any).text.textContent,
    url: (node.attributes as any).xmlUrl.textContent,
  }));
}

export async function fetchFeed(feed: Feed): Promise<{image: string; items: FeedItem[]}> {
  const response = await(fetch(feed.url));
  const xml = await response.text();
  const parser = new FeedMe(true);
  parser.write(xml);
  const parserResult = parser.done();
  const feedItems = parserResult.items;
  const items = feedItems.map((entry) => {
    const item: FeedItem = {
      title: entry.title,
      pubDate: entry.pubDate,
      content: entry['content:encoded'] || entry.content || entry.description,
      guid: entry.guid.text,
      enclosure: entry.enclosure,
    };
    return item;
  });

  console.log(parserResult.image.url);
  return {image: parserResult.image.url, items};
}
