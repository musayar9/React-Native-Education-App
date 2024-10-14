import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";
import SearchInput from "@/components/SearchInputs";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import {
  getAllPosts,
  getLatestPosts,
  getUserPosts,
  searchPosts,
  signOut,
} from "@/lib/appwrite";
import useAppWrite from "@/lib/useAppWrite";
import VideoCard from "@/components/VideoCard";
import { router, useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import InfoBox from "@/components/InfoBox";

export type Posts = {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: { username: string; avatar: string };
};

const Profile = () => {
  // searchPosts'i çağırmak için async bir fonksiyon tanımlayın
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const { data: posts } = useAppWrite<Posts[]>(() =>
    getUserPosts(user?.$id)
  );

  const logout = async() => {
  await signOut()
  setUser(null)
  setIsLoggedIn(false)
  router.replace("/sing-in")
  };
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
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-[#FF8E01] rounded-lg justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username || "unknown user"}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex-row">
              <InfoBox
                title={posts?.length || 0}
                subtitle="Posts"
                containerStyles="mr-5"
                titleStyles="text-xl"
              />
              <InfoBox
                title="11.2k"
                subtitle="Followers"
              
                titleStyles="text-xl"
              />
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

export default Profile;
