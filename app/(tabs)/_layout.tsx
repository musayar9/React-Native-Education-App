import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { icons } from "@/constants";

type TabIconProps = {
  icon:string,
  color:string,
  name:string,
  focused:any
}

const TabIcon = ({ icon, color, name, focused }:TabIconProps) => {
  return <View className="items-center justify-center gap-1">
  <Image source={icon} resizeMode="contain" tintColor={color}
  className="w-6 h-6"
  />
  <Text className={`${focused ? "font-psemibold":"font-pregular"} text-xs`}>
  {name}
  </Text>
  </View>;
};

const TabsLayout = () => {
  return (
    <>
      <Tabs screenOptions={{ tabBarShowLabel: false }}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                focused={focused}
                name={"Home"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmark"
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                focused={focused}
                name={"Bookmark"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                focused={focused}
                name={"Create"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                focused={focused}
                name={"Profile"}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
