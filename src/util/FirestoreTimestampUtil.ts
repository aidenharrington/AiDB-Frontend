import { Timestamp } from "firebase/firestore";

export class FirestoreTimestampUtil {
    /**
     * Formats a Firestore Timestamp to a localized string.
     * Returns empty string if no timestamp provided.
     */
    static formatTimestamp(ts?: Timestamp | { seconds: number; nanos: number }): string {
      if (!ts) return "";

      // If already Firestore Timestamp instance, use toDate()
      if (ts instanceof Timestamp) {
        return ts.toDate().toLocaleString();
      }
  
      // Else if plain object, convert to Timestamp then toDate()
      if ("seconds" in ts && "nanos" in ts) {
        const firestoreTs = new Timestamp(ts.seconds, ts.nanos);
        return firestoreTs.toDate().toLocaleString();
      }
  
      return "";
    }
  }