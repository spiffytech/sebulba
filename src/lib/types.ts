export interface Feed {
  name: string;
  url: string;
  image?: string;
  error?: string | null;
}

export interface Enclosure {
  url: string;
  type: string;
}

export interface FeedItem {
  title: string;
  pubDate: string;
  content: string;
  guid: string;
  enclosure: Enclosure;
}
