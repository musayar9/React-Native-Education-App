import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Posts } from "@/app/(tabs)/home";
import * as Animatable from "react-native-animatable";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: { scale: 1 },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({
  activeItem,
  item,
}: {
  activeItem: Posts;
  item: Posts;
}) => {
  const [play, setPlay] = useState(false);
  console.log("actvie", activeItem);
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem.$id === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative items-center justify-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg
    shadow-black/40
    "
            resizeMode="cover"
            source={{ uri: item.thumbnail }}
          />
          <Image source={icons.play} className="w-12 h-12 absolute" />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }: { posts: Posts[] }) => {
  const [activeItem, setActiveItem] = useState<Posts>(posts[1]);

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<{ item: Posts }>;
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0]?.item);
    }
  };
  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 150, y: 0 }}
    />
  );
};

export default Trending;
