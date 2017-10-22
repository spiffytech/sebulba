export interface Podcast {
  name: string;
  url: string;
  image?: string;
  error?: string | null;
}

export interface Enclosure {
  url: string;
  type: string;
}

export interface Episode {
  podcastId: string;
  id: string;
  guid: string;
  title: string;
  pubDate: string;
  content: string;
  enclosure: Enclosure;
}

export interface HistoryItem {
  episodeId: string;
  finished: boolean;
  listenTime: number;
}

export interface Player {
  episode: Episode | null;
  playing: boolean;
}
