import { openDB } from 'idb';

const dbPromise = openDB('ceritakita-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('stories')) {
      db.createObjectStore('stories', { keyPath: 'id' });
    }
  },
});

const Database = {
async saveStory(story) {
  if (!Object.hasOwn(story, 'id')) {
      throw new Error('`id` is required to save.');
    }
    return (await dbPromise).put('stories', story);
  },

async getAllStories() {
  const db = await dbPromise;
  return db.getAll('stories');
},

  async getStoryById(id) {
    if (!id) {
      throw new Error('`id` is required.');
    }
    return (await dbPromise).get('stories', id);
  },

async deleteStory(id) {
  const db = await dbPromise;
  return db.delete('stories', id);
}
}

export default Database;
