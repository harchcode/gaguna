export type TrieNode = {
  [k: string]: TrieNode | undefined;
};

export class Trie {
  data: TrieNode = {};

  clear = () => {
    this.data = {};
  };

  insert = (w: string) => {
    let current = this.data;

    for (const ch of w) {
      if (!current[ch]) current[ch] = {};

      current = current[ch] as TrieNode;
    }

    current["*"] = undefined;
  };

  collect = (len = -1, node = this.data, w = "", ws: string[] = []) => {
    if (len > -1 && ws.length >= len) return ws;

    const current = node;

    for (const k in current) {
      const v = current[k];

      if (k === "*") {
        ws.push(w);
        if (len > -1 && ws.length >= len) break;
      } else this.collect(len, v, w + k, ws);
    }

    return ws;
  };

  search = (w: string) => {
    let current = this.data;

    for (const ch of w) {
      if (current[ch]) current = current[ch] as TrieNode;
      else return undefined;
    }

    return current;
  };

  suggest = (w: string, len = 100) => {
    let node = undefined;
    let wtmp = w;

    node = this.search(wtmp);

    while (node === undefined && wtmp.length > 0) {
      wtmp = wtmp.substring(0, wtmp.length - 1);
      node = this.search(wtmp);
    }

    return [this.collect(len, node), wtmp];
  };
}

export function createTrie() {
  return new Trie();
}
