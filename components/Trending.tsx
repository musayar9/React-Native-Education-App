import { View, Text, FlatList } from "react-native";
import React from "react";

type TrendingProps = {
  posts: Array<{ id: number }>;
};

const Trending = ({ posts }: TrendingProps) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <Text className="text-3xl text-white">{item.id}</Text>
      )}
    />
  );
};

export default Trending;
