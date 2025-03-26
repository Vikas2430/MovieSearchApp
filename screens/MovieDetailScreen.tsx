"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native"
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Define types
type MovieDetail = {
  imdbID: string
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Array<{ Source: string; Value: string }>
  imdbRating: string
  imdbVotes: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
}

type RootStackParamList = {
  MovieDetail: { movieId: string }
}

type MovieDetailScreenRouteProp = RouteProp<RootStackParamList, "MovieDetail">

export default function MovieDetailScreen() {
  const route = useRoute<MovieDetailScreenRouteProp>()
  const navigation = useNavigation()
  const { movieId } = route.params

  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Replace with your actual API key
        const apiKey = "6cb1c495"
        const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=${apiKey}`)
        const data = await response.json()

        if (data.Response === "True") {
          setMovie(data)
        } else {
          setError(data.Error || "Failed to load movie details")
        }
      } catch (err) {
        setError("An error occurred while fetching movie details")
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
    checkIfFavorite()
  }, [movieId])

  // Check if movie is in favorites
  const checkIfFavorite = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem("favorites")
      if (favoritesJson) {
        const favorites = JSON.parse(favoritesJson)
        setIsFavorite(favorites.some((fav: { imdbID: string }) => fav.imdbID === movieId))
      }
    } catch (err) {
      console.error("Error checking favorites:", err)
    }
  }

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!movie) return

    try {
      const favoritesJson = await AsyncStorage.getItem("favorites")
      let favorites = favoritesJson ? JSON.parse(favoritesJson) : []

      if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter((fav: { imdbID: string }) => fav.imdbID !== movieId)
        Alert.alert("Removed", `"${movie.Title}" removed from favorites`)
      } else {
        // Add to favorites
        const movieToSave = {
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Poster: movie.Poster,
        }
        favorites.push(movieToSave)
        Alert.alert("Added", `"${movie.Title}" added to favorites`)
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(favorites))
      setIsFavorite(!isFavorite)
    } catch (err) {
      console.error("Error updating favorites:", err)
      Alert.alert("Error", "Failed to update favorites")
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    )
  }

  if (error || !movie) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Movie not found"}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.posterContainer}>
          <Image
            source={{
              uri: movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster",
            }}
            style={styles.poster}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
            onPress={toggleFavorite}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={28}
              color={isFavorite ? "white" : "#ff6b6b"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{movie.Title}</Text>
          <Text style={styles.year}>
            {movie.Year} • {movie.Rated} • {movie.Runtime}
          </Text>

          <View style={styles.ratingContainer}>
            {movie.imdbRating !== "N/A" && (
              <View style={styles.ratingItem}>
                <Text style={styles.ratingValue}>{movie.imdbRating}</Text>
                <Text style={styles.ratingLabel}>IMDb</Text>
              </View>
            )}

            {movie.Ratings &&
              movie.Ratings.map((rating, index) => {
                if (rating.Source === "Internet Movie Database") return null
                return (
                  <View key={index} style={styles.ratingItem}>
                    <Text style={styles.ratingValue}>
                      {rating.Source === "Rotten Tomatoes" ? rating.Value.replace("%", "") : rating.Value}
                    </Text>
                    <Text style={styles.ratingLabel}>
                      {rating.Source === "Rotten Tomatoes"
                        ? "RT"
                        : rating.Source === "Metacritic"
                          ? "Meta"
                          : rating.Source}
                    </Text>
                  </View>
                )
              })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genre</Text>
            <Text style={styles.sectionContent}>{movie.Genre}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plot</Text>
            <Text style={styles.sectionContent}>{movie.Plot}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Director</Text>
            <Text style={styles.sectionContent}>{movie.Director}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <Text style={styles.sectionContent}>{movie.Actors}</Text>
          </View>

          {movie.Awards !== "N/A" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Awards</Text>
              <Text style={styles.sectionContent}>{movie.Awards}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
  },
  posterContainer: {
    position: "relative",
    width: "100%",
    height: 450,
  },
  poster: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ddd",
  },
  favoriteButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  favoriteButtonActive: {
    backgroundColor: "#ff6b6b",
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  year: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  ratingItem: {
    marginRight: 24,
    alignItems: "center",
  },
  ratingValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  ratingLabel: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
})

