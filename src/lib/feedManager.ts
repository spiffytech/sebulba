import {Feed} from '../lib/types';

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
