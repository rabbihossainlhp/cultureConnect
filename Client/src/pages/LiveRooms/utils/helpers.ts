// Utility functions for LiveRooms component

export const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const formatMessageTime = (timestamp: string | Date | undefined): string => {
  if (!timestamp) return "Just now";
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.warn("Invalid timestamp:", timestamp);
      return "Just now";
    }
    return date.toLocaleString();
  } catch (error) {
    console.error("Date parsing error:", error, timestamp);
    return "Just now";
  }
};

// Format relative time for DM list
export const formatRelativeTime = (timestamp: string | undefined): string => {
  if (!timestamp) return "Just now";
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Just now";
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  } catch (error) {
    return "Just now";
  }
};
