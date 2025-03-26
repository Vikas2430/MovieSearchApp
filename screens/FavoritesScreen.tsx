"use client"

import React, { useState } from "react"
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

// Define types
type FavoriteMovie = {
  imdbID: string
  Title: string
  Year: string
  Poster: string
}

type RootStackParamList = {
  Home: undefined;
  MovieDetail: { movieId: string };
  Favorites: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation<NavigationProp>()

  // Load favorites when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadFavorites()
    }, []),
  )

  // Load favorites from AsyncStorage
  const loadFavorites = async () => {
    try {
      setLoading(true)
      const favoritesJson = await AsyncStorage.getItem("favorites")
      if (favoritesJson) {
        setFavorites(JSON.parse(favoritesJson))
      } else {
        setFavorites([])
      }
    } catch (err) {
      console.error("Error loading favorites:", err)
      Alert.alert("Error", "Failed to load favorites")
    } finally {
      setLoading(false)
    }
  }

  // Remove a movie from favorites
  const removeFromFavorites = async (movie: FavoriteMovie) => {
    try {
      const updatedFavorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID)
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      setFavorites(updatedFavorites)
      Alert.alert("Removed", `"${movie.Title}" removed from favorites`)
    } catch (err) {
      console.error("Error removing from favorites:", err)
      Alert.alert("Error", "Failed to remove from favorites")
    }
  }

  // Confirm removal
  const confirmRemove = (movie: FavoriteMovie) => {
    Alert.alert("Remove from Favorites", `Are you sure you want to remove "${movie.Title}" from your favorites?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeFromFavorites(movie) },
    ])
  }

  // Render movie item
  const renderMovieItem = ({ item }: { item: FavoriteMovie }) => (
    <View style={styles.movieItem}>
      <TouchableOpacity onPress={() => navigation.navigate("MovieDetail", { movieId: item.imdbID })}>
        <Image
          source={{
            uri: item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/150x225?text=No+Poster",
          }}
          style={styles.poster}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.movieInfo}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MovieDetail", { movieId: item.imdbID })}
        >
          <Text style={styles.title} numberOfLines={2}>
            {item.Title}
          </Text>
          <Text style={styles.year}>{item.Year}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.removeButton} onPress={() => confirmRemove(item)}>
          <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorite Movies</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ddd" />
          <Text style={styles.emptyText}>No favorite movies yet</Text>
          <Text style={styles.emptySubtext}>Movies you add to favorites will appear here</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("Home")}>
            <Text style={styles.browseButtonText}>Browse Movies</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.imdbID}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212529",
  },
  list: {
    padding: 16,
  },
  movieItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  poster: {
    width: 100,
    height: 150,
    backgroundColor: "#e9ecef",
  },
  movieInfo: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 8,
  },
  year: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 12,
  },
  removeButton: {
    alignSelf: "flex-end",
    padding: 8,
    backgroundColor: "#fff5f5",
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "white",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212529",
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  browseButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: "#228be6",
    borderRadius: 28,
    elevation: 2,
    shadowColor: "#228be6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  browseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

