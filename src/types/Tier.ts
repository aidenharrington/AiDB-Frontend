export interface Tier {
  name: string;
  userId: string;
  queryLimit: string;
  queryLimitUsage: string;
  translationLimit: string;
  translationLimitUsage: string;
  dataRowLimit: string;
  dataRowLimitUsage: string;
  projectLimit: string;
  projectLimitUsage: string;
  maxFileSize: string;
}

export interface PayloadMetadata {
  tier: Tier | null;
}

export interface APIResponse<T> {
  meta: PayloadMetadata;
  data: T;
}
