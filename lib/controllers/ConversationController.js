// /lib/controllers/ConversationController.js

import { db } from '@/lib/firebase.js';
import {
  ref,
  child,
  get,
  push
} from 'firebase/database';

/**
 * Fetch messages under a specific conversation key.
 * @param {string} conversationKey
 * @returns {Promise<Array>} Sorted messages array
 */
export async function getMessagesByKey(conversationKey) {
  try {
    const snapshot = await get(child(ref(db), `conversations/${conversationKey}`));
    const data = snapshot.val() ?? {};
    return Object.entries(data)
      .map(([id, msg]) => ({ id, ...msg }))
      .sort((a, b) => a.created - b.created);
  } catch (err) {
    console.error('getMessagesByKey error:', err);
    return [];
  }
}

/**
 * Push a message to the conversation key node.
 * @param {string} conversationKey
 * @param {string} uid - Sender's UID
 * @param {string} message - Message content
 */
export async function postConversation(conversationKey, uid, message) {
  try {
    const conversationRef = child(ref(db), `conversations/${conversationKey}`);
    await push(conversationRef, {
      uid,
      message,
      created: Date.now(),
    });
  } catch (err) {
    console.error('postConversation error:', err);
  }
}
