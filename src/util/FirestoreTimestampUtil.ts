import { Timestamp } from "firebase/firestore";

export class FirestoreTimestampUtil {
    /**
     * Formats a Firestore Timestamp to a localized string.
     * Returns empty string if no timestamp provided.
     */
    static formatTimestamp(ts?: Timestamp | { seconds: number; nanos: number } | string | Date): string {
      if (!ts) return "";

      // If already Firestore Timestamp instance, use toDate()
      if (ts instanceof Timestamp) {
        return ts.toDate().toLocaleString();
      }

      // If it's a Date object
      if (ts instanceof Date) {
        return ts.toLocaleString();
      }

      // If it's a string (ISO date string), parse it
      if (typeof ts === 'string') {
        try {
          const date = new Date(ts);
          if (!isNaN(date.getTime())) {
            return date.toLocaleString();
          }
        } catch (error) {
          console.warn('Failed to parse timestamp string:', ts);
        }
        return "";
      }
  
      // Else if plain object with seconds and nanos, convert to Timestamp then toDate()
      if (typeof ts === 'object' && ts !== null && 'seconds' in ts && 'nanos' in ts) {
        const firestoreTs = new Timestamp(ts.seconds, ts.nanos);
        return firestoreTs.toDate().toLocaleString();
      }
  
      return "";
    }
  }