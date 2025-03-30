import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useSupabase from "../../lib/supabase"; // Updated hook
import { searchPosts } from "../../lib/supabase"; // Updated function
import { EmptyState, SearchInput, VideoCard } from "../../components";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useSupabase(() => searchPosts(query)); // Updated to Supabase

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id} // Changed $id → id (Supabase format)
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator_username} // Updated for Supabase format
            avatar={item.creator_avatar} // Updated for Supabase format
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4">
            <Text className="font-pmedium text-gray-100 text-sm">Search Results</Text>
            <Text className="text-2xl font-psemibold text-white mt-1">{query}</Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} refetch={refetch} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
