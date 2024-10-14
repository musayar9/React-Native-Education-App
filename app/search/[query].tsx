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
import { getAllPosts, getLatestPosts, searchPosts } from "@/lib/appwrite";
import useAppWrite from "@/lib/useAppWrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";

export type Posts = {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: { username: string; avatar: string };
};

const Search = () => {
  const { query } = useLocalSearchParams();

  // searchPosts'i çağırmak için async bir fonksiyon tanımlayın
  const fetchPosts = async () => {
    const searchQuery = Array.isArray(query) ? query[0] : query || "";

    // searchPosts fonksiyonunu çağır
    return await searchPosts(searchQuery);
    // return await searchPosts(query);
  };

  const { data: posts, refetch } = useAppWrite<Posts[]>(fetchPosts);


  return (
    <SafeAreaView className="bg-[#161622] h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
  
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Search Results
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {query}
                </Text>
                <View className="mt-6 mb-8">
                  <SearchInput
                    initialQuery={Array.isArray(query) ? query[0] : query}
                  />
                </View>
              </View>
          
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={"No Videos Found"}
            subtitle={"No videos found for this search query"}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
