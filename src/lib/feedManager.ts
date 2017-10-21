const FeedMe = require('feedme');

import {Podcast, Episode} from '../lib/types';

export function parseOpml(opml: string): Podcast[] {
  const dom = new DOMParser().parseFromString(opml, 'text/xml');
  const nodes = Array.from(
    dom.querySelectorAll('body outline[type="rss"][text][xmlUrl]')
  );
  return nodes.map((node) => ({
    name: (node.attributes as any).text.textContent,
    url: (node.attributes as any).xmlUrl.textContent,
  }));
}

export async function fetchPodcast(podcast: Podcast): Promise<{image: string; episodes: Episode[]}> {
  const response = await(fetch(podcast.url));
  const xml = await response.text();
  const parser = new FeedMe(true);
  parser.write(xml);
  const parserResult = parser.done();
  const episodesRaw: any[] = parserResult.items;
  const episodes = episodesRaw.map((entry) => {
    const episode: Episode = {
      podcastId: podcast.url,
      id: entry.enclosure.url,
      guid: entry.guid.text,
      title: entry.title,
      pubDate: entry.pubDate,
      content: entry['content:encoded'] || entry.content || entry.description,
      enclosure: entry.enclosure,
    };
    return episode;
  });

  return {image: parserResult.image.url, episodes};
}
