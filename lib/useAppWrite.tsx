import { useEffect, useState } from "react";
import { getAllPosts } from "./appwrite";
import { Alert } from "react-native";

const useAppWrite = <T,>(fn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fn();
      setData(response);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const refetch = () => fetchData();

  return { data, setData, isLoading, setIsLoading, refetch };
};

export default useAppWrite;
