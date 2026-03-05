import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type NotificationType = "like" | "retweet" | "follow" | "reply" | "mention";

type Notification = {
  id: string;
  type: NotificationType;
  user: { name: string; username: string; avatar: string };
  content?: string;
  time: string;
  read: boolean;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "like",
    user: {
      name: "James Doe",
      username: "jamesdoe",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    content: "liked your post about React Native performance",
    time: "2m",
    read: false,
  },
  {
    id: "2",
    type: "follow",
    user: {
      name: "Coffee Lover",
      username: "coffeelover",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    time: "15m",
    read: false,
  },
  {
    id: "3",
    type: "retweet",
    user: {
      name: "Alex Johnson",
      username: "alexj",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    content: "reposted your tweet",
    time: "1h",
    read: false,
  },
  {
    id: "4",
    type: "reply",
    user: {
      name: "Design Studio",
      username: "designstudio",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    content: "replied: Great work on the new app! The UI looks clean 🔥",
    time: "3h",
    read: true,
  },
  {
    id: "5",
    type: "mention",
    user: {
      name: "James Doe",
      username: "jamesdoe",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    content: "mentioned you in a post",
    time: "5h",
    read: true,
  },
  {
    id: "6",
    type: "like",
    user: {
      name: "Alex Johnson",
      username: "alexj",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    content: "liked your reply",
    time: "1d",
    read: true,
  },
];

const ICON_CONFIG: Record<NotificationType, { name: string; color: string; bg: string }> = {
  like:    { name: "heart",      color: "#F91880", bg: "#FDE8F2" },
  retweet: { name: "repeat",     color: "#00BA7C", bg: "#E6F9F3" },
  follow:  { name: "user-plus",  color: "#1D9BF0", bg: "#E8F5FE" },
  reply:   { name: "message-circle", color: "#1D9BF0", bg: "#E8F5FE" },
  mention: { name: "at-sign",    color: "#7856FF", bg: "#EDE8FF" },
};

const ACTION_LABEL: Record<NotificationType, string> = {
  like:    "liked your post",
  retweet: "reposted your tweet",
  follow:  "followed you",
  reply:   "replied to you",
  mention: "mentioned you",
};

const NotificationItem = ({
  item,
  onPress,
}: {
  item: Notification;
  onPress: (id: string) => void;
}) => {
  const icon = ICON_CONFIG[item.type];

  return (
    <TouchableOpacity
      onPress={() => onPress(item.id)}
      className={`flex-row px-4 py-3 border-b border-gray-100 ${
        !item.read ? "bg-blue-50" : "bg-white"
      }`}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View
        className="w-9 h-9 rounded-full items-center justify-center mr-3 mt-0.5"
        style={{ backgroundColor: icon.bg }}
      >
        <Feather name={icon.name as any} size={16} color={icon.color} />
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-1">
          <Image
            source={{ uri: item.user.avatar }}
            className="w-9 h-9 rounded-full"
          />
          <Text className="text-gray-400 text-xs">{item.time}</Text>
        </View>

        <Text className="text-gray-900 text-sm leading-5">
          <Text className="font-bold">{item.user.name} </Text>
          <Text className="text-gray-600">
            {item.content ?? ACTION_LABEL[item.type]}
          </Text>
        </Text>
      </View>

      {/* Unread dot */}
      {!item.read && (
        <View className="w-2 h-2 rounded-full bg-blue-500 ml-2 mt-2" />
      )}
    </TouchableOpacity>
  );
};

const TABS = ["All", "Verified", "Mentions"] as const;

const NotificationScreen = () => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const filtered = notifications.filter((n) => {
    if (activeTab === "Mentions") return n.type === "mention";
    if (activeTab === "Verified") return n.type === "follow";
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text className="text-blue-500 text-sm font-medium">
              Mark all read ({unreadCount})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-100">
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className="flex-1 items-center py-3"
          >
            <Text
              className={`text-sm font-semibold ${
                activeTab === tab ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {tab}
            </Text>
            {activeTab === tab && (
              <View className="absolute bottom-0 w-12 h-1 bg-blue-500 rounded-full" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Feather name="bell-off" size={40} color="#CBD5E1" />
          <Text className="text-gray-400 mt-3 text-base">No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem item={item} onPress={markRead} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;