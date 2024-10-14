import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { creativeVideoPost } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
type FileStatus = {
  fileName: string;
  mimeType: string | undefined;
  fileSize: number;
  uri: string;
};
const Create = () => {
  const { user } = useGlobalContext();
  console.log(user, "user")
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null as FileStatus | null,
    thumbnail: null as FileStatus | null,
    prompt: "",
  });

  const openPicker = async (selectType: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const pickedFile = result.assets[0];

      const fileStatus: FileStatus = {
        fileName: pickedFile.fileName || "unknown", // Eğer isim yoksa "unknown"
        mimeType: pickedFile.type,
        fileSize: pickedFile.fileSize || 0,
        uri: pickedFile.uri,
      };

      if (selectType === "image") {
        setForm({ ...form, thumbnail: fileStatus });
      }
      if (selectType === "video") {
        setForm({ ...form, video: fileStatus });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document Picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
  
    if (!user || !user.$id) {
      return Alert.alert("User ID not found, please login");
    }
    if (
      form.prompt === "" ||
      form.title === "" 
    ) {
      return Alert.alert("Please provide all fields");
    }
  if (!form.thumbnail || !form.video) {
    return Alert.alert("Thumbnail and video are required");
  }

   
    setUploading(false);

    try {
    
        console.log("Form data:", {
          ...form,
          userId: user.$id,
        });
      await creativeVideoPost({
        ...form,
        userId: user.$id,
      });
          Alert.alert("Success", "Post uploaded successfully");
          router.push("/home");
    } catch (error) {
      Alert.alert("Error", error?.message as string);
    throw new Error(error as string)
    }
  };
  return (
    <SafeAreaView className="bg-[#161622] h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          title="Video Title"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          value={form.title}
          placeholder="Give Your video a catch title..."
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-xl"
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-[#1e1e2d] rounded-xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-[#ff9001] items-center justify-center">
                  <Image
                    source={icons.upload}
                    className="w-1/2 h-1/2"
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-[#1e1e2d] rounded-2xl border-2 border-[#1e1e2d] flex justify-center items-center flew-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The AI prompt of your video..."
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7 "
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
