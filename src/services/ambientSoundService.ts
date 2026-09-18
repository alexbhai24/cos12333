export interface AmbientSoundUrls {
  forest: string;
  space: string;
  ocean: string;
  desert: string;
}

export const DEFAULT_AMBIENT_SOUND_URLS: AmbientSoundUrls = {
  forest: 'https://youtu.be/xNN7iTA57jM?si=rygUkZ66KNeg9q9o',
  space: 'https://youtu.be/yLOM8R6lbzg?si=vJtNJD6_-tazOnCK',
  ocean: 'https://youtu.be/JekUNGo-RVk?si=ObU6awP2T0gzvuZH',
  desert: 'https://youtu.be/JekUNGo-RVk?si=ObU6awP2T0gzvuZH',
};

const STORAGE_KEY = 'cosmicbone_ambient_sound_urls';
type Listener = (urls: AmbientSoundUrls) => void;
const listeners = new Set<Listener>();

function loadUrls(): AmbientSoundUrls {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_AMBIENT_SOUND_URLS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_AMBIENT_SOUND_URLS, ...parsed };
  } catch {
    return DEFAULT_AMBIENT_SOUND_URLS;
  }
}

function saveUrls(urls: AmbientSoundUrls) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
  listeners.forEach((cb) => cb(urls));
}

export const ambientSoundService = {
  getUrls(): AmbientSoundUrls {
    return loadUrls();
  },

  updateUrls(urls: Partial<AmbientSoundUrls>): void {
    const current = loadUrls();
    const updated = { ...current, ...urls };
    saveUrls(updated);
  },

  subscribe(cb: Listener): () => void {
    listeners.add(cb);
    cb(loadUrls());
    return () => listeners.delete(cb);
  }
};

export default ambientSoundService;
