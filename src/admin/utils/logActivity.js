// src/admin/utils/logActivity.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase";

/**
 * Call this function anywhere in the app to log an activity.
 *
 * @param {string} type    - 'admin' | 'robot' | 'borrow' | 'return' | 'member' | 'search' | 'system'
 * @param {string} icon    - 'bot' | 'book' | 'user' | 'settings'
 * @param {string} message - Human-readable description of the event
 *
 * Usage examples:
 *   logActivity('admin',  'settings', 'Admin logged in');
 *   logActivity('borrow', 'book',     'Book borrowed: "Clean Code"');
 *   logActivity('robot',  'bot',      'Robot arrived at Shelf C-12');
 *   logActivity('member', 'user',     'Member logged in: M-0241');
 */
const logActivity = async (type, icon, message) => {
  try {
    await addDoc(collection(firestore, "activityLogs"), {
      type,
      icon,
      message,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

export default logActivity;