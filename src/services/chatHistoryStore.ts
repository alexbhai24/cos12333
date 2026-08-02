import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  mode?: string;
  image?: string; // base64
  citations?: { title: string; url: string }[];
}

export interface ChatSession {
  id: string;
  title: string;
  userId: string;
  updatedAt: number;
  createdAt: number;
  messages: ChatMessage[];
}

interface ChatDB extends DBSchema {
  chats: {
    key: string;
    value: ChatSession;
    indexes: {
      'by-user': string;
      'by-updated': number;
    };
  };
}

const DB_NAME = 'BoneAILocalDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ChatDB>> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<ChatDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('chats')) {
          const store = db.createObjectStore('chats', { keyPath: 'id' });
          store.createIndex('by-user', 'userId');
          store.createIndex('by-updated', 'updatedAt');
        }
      },
    });
  }
  return dbPromise;
};

/**
 * ChatHistoryStore provides a secure interface for persisting Bone AI conversations.
 * 
 * Note: For the current frontend prototype, this uses IndexedDB mapped to the current mock user ID.
 * When a real backend is implemented, this interface can be replaced with a secure server-side storage implementation.
 */
export const chatHistoryStore = {
  async getChatsForUser(userId: string): Promise<ChatSession[]> {
    const db = await getDB();
    const chats = await db.getAllFromIndex('chats', 'by-user', userId);
    // Sort descending by updatedAt
    return chats.sort((a, b) => b.updatedAt - a.updatedAt);
  },

  async getChat(chatId: string): Promise<ChatSession | undefined> {
    const db = await getDB();
    return db.get('chats', chatId);
  },

  async saveChat(chat: ChatSession): Promise<void> {
    const db = await getDB();
    chat.updatedAt = Date.now();
    await db.put('chats', chat);
  },

  async deleteChat(chatId: string): Promise<void> {
    const db = await getDB();
    await db.delete('chats', chatId);
  },

  async clearAllHistory(userId: string): Promise<void> {
    const db = await getDB();
    const chats = await this.getChatsForUser(userId);
    const tx = db.transaction('chats', 'readwrite');
    for (const chat of chats) {
      tx.store.delete(chat.id);
    }
    await tx.done;
  }
};
