import { useEffect, useState } from "react";
import { X, Bell } from "lucide-react";

export interface ToastNotification {
  id: string;
  senderName: string;
  messageText: string;
  timestamp: Date;
  type: "dm" | "room";
  metadata?: {
    senderId?: number | string;
    [key: string]: any;
  };
}

interface NotificationCenterProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
  onClickNotification?: (notification: ToastNotification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onDismiss,
  onClickNotification,
}) => {
  return (
    <div className="fixed top-20 right-4 z-40 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => onClickNotification?.(notification)}
          className="bg-white border-l-4 border-purple-500 rounded-lg shadow-lg p-4 flex items-start gap-3 cursor-pointer hover:shadow-xl transition animate-in fade-in slide-in-from-top-2"
        >
          <div className="shrink-0 mt-1">
            <Bell size={18} className="text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 text-sm">
              📨 {notification.senderName}
            </p>
            <p className="text-slate-600 text-sm truncate mt-1">
              {notification.messageText}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {new Date(notification.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(notification.id);
            }}
            className="shrink-0 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

/**
 * Custom hook to manage toast notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = (
    senderName: string,
    messageText: string,
    type: "dm" | "room" = "dm",
    metadata?: { senderId?: number | string; [key: string]: any }
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    const notification: ToastNotification = {
      id,
      senderName,
      messageText,
      timestamp: new Date(),
      type,
      metadata,
    };

    setNotifications((prev) => [...prev, notification]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 5000);

    return id;
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
  };
};
