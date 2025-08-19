export const formatLimitDisplay = (usage: string, limit: string): string => {
  const limitNum = parseInt(limit);
  
  if (limitNum === -1) {
    return `${usage} / ∞`;
  }
  
  return `${usage} / ${limit}`;
};

export const isLimitReached = (usage: string, limit: string): boolean => {
  const limitNum = parseInt(limit);
  
  if (limitNum === -1) {
    return false; // No limit, so never reached
  }
  
  return parseInt(usage) >= limitNum;
};
