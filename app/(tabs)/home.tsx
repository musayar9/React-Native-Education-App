import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInputs";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { getAllPosts, getLatestPosts } from "@/lib/appwrite";
import useAppWrite from "@/lib/useAppWrite";
import VideoCard from "@/components/VideoCard";

export type Posts = {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: { username: string; avatar: string };
};

const Home = () => {
  const { data: posts, refetch } = useAppWrite<Posts[]>(getAllPosts);
  const { data: latesPosts } = useAppWrite<Posts[]> (getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  // console.log("data", posts);
  return (
    <SafeAreaView className="bg-[#161622] h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  JSMastery
                </Text>
              </View>

              <View className="mt-1">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />

            <View className="w-full flex-1 pt-3 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>
              <Trending posts={latesPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={"No Videos Found"}
            subtitle={"Be the first one to upload a video"}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
