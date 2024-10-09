import { icons } from "@/constants";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";



const SearchInput = () => {
  return (
    <View
      className="border-2 border-[#232533] w-full h-16 px-4 bg-[#1E1E2D]
      rounded-2xl focus:border-[#FF9C01] items-center flex-row space-x-4"
    >
      <TextInput
        className="flex-1 text-white font-regular mt-0.5 text-base "

        placeholder={  "Search for a video topic"}
        placeholderTextColor="#fff"
      />

      <TouchableOpacity>
        <Image source={icons.search} className="w-5 h-5" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
