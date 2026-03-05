import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "Posts" | "Replies" | "Media" | "Likes";

type Post = {
  id: string;
  text?: string;
  image?: string;
  likes: number;
  replies: number;
  reposts: number;
  time: string;
  isReply?: boolean;
  replyTo?: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROFILE = {
  name: "Alex Rivera",
  username: "alexrivera",
  bio: "Building things on the internet 🛠️  React Native & TypeScript enthusiast. Open source contributor. Coffee > sleep.",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  banner: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=600&h=200&fit=crop",
  location: "San Francisco, CA",
  website: "alexrivera.dev",
  joinedMonth: "March",
  joinedYear: "2019",
  following: 412,
  followers: 8_320,
  verified: true,
};

const POSTS: Post[] = [
  {
    id: "1",
    text: "Just shipped v2.0 of my open source component library 🎉 New animations, better TypeScript support, and a completely revamped docs site. Check it out!",
    likes: 284,
    replies: 42,
    reposts: 91,
    time: "2h",
  },
  {
    id: "2",
    text: "Hot take: the best productivity hack is just closing Slack for 3 hours.",
    likes: 1_204,
    replies: 87,
    reposts: 340,
    time: "1d",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop",
    text: "Late night coding sessions hit different ✨",
    likes: 532,
    replies: 29,
    reposts: 64,
    time: "3d",
  },
  {
    id: "4",
    text: "The gap between junior and senior isn't about knowing more APIs — it's about knowing which problems are worth solving.",
    likes: 3_812,
    replies: 201,
    reposts: 987,
    time: "5d",
  },
];

const REPLIES: Post[] = [
  {
    id: "r1",
    isReply: true,
    replyTo: "Dan Abramov",
    text: "100% agree. The mental model matters way more than the syntax. Once you get it, everything else clicks.",
    likes: 48,
    replies: 6,
    reposts: 12,
    time: "4h",
  },
  {
    id: "r2",
    isReply: true,
    replyTo: "Theo",
    text: "tRPC + Zod is genuinely one of the best DX improvements I've ever used. Type safety end-to-end without any codegen.",
    likes: 91,
    replies: 11,
    reposts: 23,
    time: "2d",
  },
];

const MEDIA_IMAGES = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=300&fit=crop",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatBlock = ({ value, label }: { value: number; label: string }) => (
  <TouchableOpacity className="mr-5">
    <Text className="text-gray-900 font-bold text-sm">{formatCount(value)}</Text>
    <Text className="text-gray-500 text-sm">{label}</Text>
  </TouchableOpacity>
);

const PostCard = ({ post }: { post: Post }) => (
  <View className="px-4 py-3 border-b border-gray-100">
    {post.isReply && (
      <Text className="text-gray-400 text-xs mb-1 ml-12">
        Replying to{" "}
        <Text className="text-blue-500">@{post.replyTo?.toLowerCase().replace(" ", "")}</Text>
      </Text>
    )}
    <View className="flex-row">
      <Image
        source={{ uri: PROFILE.avatar }}
        className="w-10 h-10 rounded-full mr-3"
      />
      <View className="flex-1">
        {/* Author row */}
        <View className="flex-row items-center mb-1 flex-wrap">
          <Text className="font-bold text-gray-900 text-sm mr-1">{PROFILE.name}</Text>
          {PROFILE.verified && (
            <Feather name="check-circle" size={13} color="#1D9BF0" />
          )}
          <Text className="text-gray-400 text-sm ml-1">@{PROFILE.username} · {post.time}</Text>
        </View>

        {/* Text */}
        {post.text && (
          <Text className="text-gray-900 text-sm leading-5 mb-2">{post.text}</Text>
        )}

        {/* Image */}
        {post.image && (
          <Image
            source={{ uri: post.image }}
            className="w-full h-44 rounded-2xl mb-2"
            resizeMode="cover"
          />
        )}

        {/* Actions */}
        <View className="flex-row justify-between mt-1" style={{ maxWidth: 280 }}>
          <View className="flex-row items-center">
            <Feather name="message-circle" size={16} color="#657786" />
            <Text className="text-gray-400 text-xs ml-1">{formatCount(post.replies)}</Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="repeat" size={16} color="#657786" />
            <Text className="text-gray-400 text-xs ml-1">{formatCount(post.reposts)}</Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="heart" size={16} color="#657786" />
            <Text className="text-gray-400 text-xs ml-1">{formatCount(post.likes)}</Text>
          </View>
          <Feather name="share" size={16} color="#657786" />
        </View>
      </View>
    </View>
  </View>
);

const MediaGrid = () => (
  <View className="flex-row flex-wrap">
    {MEDIA_IMAGES.map((uri, i) => (
      <TouchableOpacity key={i} activeOpacity={0.85}>
        <Image
          source={{ uri }}
          style={{ width: width / 3, height: width / 3 }}
          className="border border-white"
          resizeMode="cover"
        />
      </TouchableOpacity>
    ))}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const TABS: Tab[] = ["Posts", "Replies", "Media", "Likes"];

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Posts");
  const [following, setFollowing] = useState(false);

  const tabContent = () => {
    switch (activeTab) {
      case "Posts":
        return <FlatList data={POSTS} keyExtractor={(i) => i.id} renderItem={({ item }) => <PostCard post={item} />} scrollEnabled={false} />;
      case "Replies":
        return <FlatList data={REPLIES} keyExtractor={(i) => i.id} renderItem={({ item }) => <PostCard post={item} />} scrollEnabled={false} />;
      case "Media":
        return <MediaGrid />;
      case "Likes":
        return (
          <View className="flex-1 items-center justify-center py-16">
            <Feather name="heart" size={36} color="#CBD5E1" />
            <Text className="text-gray-400 mt-3">No liked posts yet</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>

        {/* ── Top Nav ── */}
        <View className="flex-row items-center justify-between px-4 py-2">
          <TouchableOpacity className="w-9 h-9 items-center justify-center">
            <Feather name="arrow-left" size={22} color="#0F1419" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="font-bold text-base text-gray-900">{PROFILE.name}</Text>
            <Text className="text-gray-400 text-xs">{formatCount(POSTS.length + REPLIES.length)} posts</Text>
          </View>
          <TouchableOpacity className="w-9 h-9 items-center justify-center">
            <Feather name="more-horizontal" size={22} color="#0F1419" />
          </TouchableOpacity>
        </View>

        {/* ── Banner + Avatar ── */}
        <View>
          <Image
            source={{ uri: PROFILE.banner }}
            className="w-full h-32"
            resizeMode="cover"
          />
          <View className="px-4">
            {/* Avatar row */}
            <View className="flex-row justify-between items-end" style={{ marginTop: -36 }}>
              <View className="border-4 border-white rounded-full">
                <Image
                  source={{ uri: PROFILE.avatar }}
                  className="w-20 h-20 rounded-full"
                />
              </View>
              <View className="flex-row items-center gap-2 mb-1">
                <TouchableOpacity className="w-9 h-9 border border-gray-200 rounded-full items-center justify-center">
                  <Feather name="mail" size={16} color="#0F1419" />
                </TouchableOpacity>
                <TouchableOpacity className="w-9 h-9 border border-gray-200 rounded-full items-center justify-center">
                  <Feather name="bell" size={16} color="#0F1419" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFollowing((f) => !f)}
                  className={`px-5 py-2 rounded-full border ${
                    following
                      ? "border-gray-300 bg-white"
                      : "border-transparent bg-gray-900"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      following ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {following ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Name & bio */}
            <View className="mt-3">
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-gray-900 mr-1">{PROFILE.name}</Text>
                {PROFILE.verified && (
                  <Feather name="check-circle" size={18} color="#1D9BF0" />
                )}
              </View>
              <Text className="text-gray-400 text-sm">@{PROFILE.username}</Text>
              <Text className="text-gray-900 text-sm leading-5 mt-2">{PROFILE.bio}</Text>

              {/* Meta info */}
              <View className="flex-row flex-wrap mt-2 gap-y-1">
                <View className="flex-row items-center mr-4">
                  <Feather name="map-pin" size={13} color="#657786" />
                  <Text className="text-gray-400 text-sm ml-1">{PROFILE.location}</Text>
                </View>
                <View className="flex-row items-center mr-4">
                  <Feather name="link" size={13} color="#657786" />
                  <Text className="text-blue-500 text-sm ml-1">{PROFILE.website}</Text>
                </View>
                <View className="flex-row items-center">
                  <Feather name="calendar" size={13} color="#657786" />
                  <Text className="text-gray-400 text-sm ml-1">
                    Joined {PROFILE.joinedMonth} {PROFILE.joinedYear}
                  </Text>
                </View>
              </View>

              {/* Stats */}
              <View className="flex-row mt-3 mb-1">
                <StatBlock value={PROFILE.following} label="Following" />
                <StatBlock value={PROFILE.followers} label="Followers" />
              </View>
            </View>
          </View>
        </View>

        {/* ── Sticky Tabs ── */}
        <View className="flex-row bg-white border-b border-gray-100">
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
                <View className="absolute bottom-0 w-10 h-1 bg-blue-500 rounded-full" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Tab Content ── */}
        <View>{tabContent()}</View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;