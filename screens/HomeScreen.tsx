"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

// Define types
type Movie = {
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

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const navigation = useNavigation<NavigationProp>()

  // Load initial popular movies when component mounts
  useEffect(() => {
    searchMovies("star wars", 1)
  }, [])

  // Function to search movies
  const searchMovies = async (query: string, pageNum: number) => {
    if (!query.trim()) {
      setMovies([])
      return
    }

    if (pageNum === 1) {
      setLoading(true)
    } else {
      setIsLoadingMore(true)
    }
    setError("")

    try {
      const apiKey = "6cb1c495"
      const response = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&page=${pageNum}&apikey=${apiKey}`,
      )
      const data = await response.json()

      if (data.Response === "True") {
        const totalResultsCount = parseInt(data.totalResults, 10)
        setTotalResults(totalResultsCount)
        
        if (pageNum === 1) {
          setMovies(data.Search || [])
        } else {
          // Filter out duplicates before adding new movies
          const newMovies = data.Search.filter((newMovie: Movie) => 
            !movies.some(movie => movie.imdbID === newMovie.imdbID)
          )
          setMovies(prevMovies => [...prevMovies, ...newMovies])
        }
      } else {
        setError(data.Error || "No movies found")
        if (pageNum === 1) setMovies([])
      }
    } catch (err) {
      setError("Failed to fetch movies. Please try again.")
      if (pageNum === 1) setMovies([])
    } finally {
      if (pageNum === 1) {
        setLoading(false)
      } else {
        setIsLoadingMore(false)
      }
    }
  }

  // Handle search submission
  const handleSearch = () => {
    setPage(1)
    searchMovies(searchQuery, 1)
  }

  // Load more movies
  const loadMoreMovies = () => {
    if (isLoadingMore || loading || movies.length >= totalResults) return
  
    const nextPage = page + 1
    setPage(nextPage)
    searchMovies(searchQuery, nextPage)
  }

  // Navigate to favorites screen
  const navigateToFavorites = () => {
    navigation.navigate("Favorites")
  }

  // Render movie item
  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => navigation.navigate("MovieDetail", { movieId: item.imdbID })}
    >
      <Image
        source={{
          uri: item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/150x225?text=No+Poster",
        }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.movieInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {item.Title}
        </Text>
        <Text style={styles.year}>{item.Year}</Text>
      </View>
    </TouchableOpacity>
  )

  // Render footer (loading indicator and load more button)
  const renderFooter = () => {
    if (movies.length === 0) return null;

    const remainingMovies = totalResults - movies.length;
    const shouldShowLoadMore = remainingMovies > 0 && !isLoadingMore && !loading;

    return (
      <View style={styles.footerContainer}>
        {isLoadingMore ? (
          <ActivityIndicator size="large" color="#228be6" />
        ) : shouldShowLoadMore ? (
          <TouchableOpacity 
            style={styles.loadMoreButton} 
            onPress={loadMoreMovies}
            disabled={isLoadingMore || loading}
          >
            <Text style={styles.loadMoreText}>
              Load More ({remainingMovies} remaining)
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for movies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.favButton} onPress={navigateToFavorites}>
          <Ionicons name="heart" size={24} color="#ff6b6b" />
        </TouchableOpacity>
      </View>

      {loading && page === 1 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#228be6" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : movies.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholderText}>Search for movies to see results</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.imdbID}
          numColumns={3}
          contentContainerStyle={styles.movieList}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={
            !searchQuery ? (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Movies</Text>
              </View>
            ) : null
          }
          removeClippedSubviews={false}
          maxToRenderPerBatch={6}
          windowSize={3}
          initialNumToRender={6}
          updateCellsBatchingPeriod={100}
          getItemLayout={(data, index) => ({
            length: 250,
            offset: 250 * Math.floor(index / 3),
            index,
          })}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
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
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f3f5",
    overflow: "hidden",
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#212529",
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: "#228be6",
    justifyContent: "center",
    alignItems: "center",
  },
  favButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "white",
  },
  placeholderText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#fa5252",
    textAlign: "center",
    lineHeight: 24,
  },
  movieList: {
    padding: 12,
  },
  movieItem: {
    width: "30%",
    margin: "1.5%",
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
    width: "100%",
    height: 200,
    backgroundColor: "#e9ecef",
  },
  movieInfo: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 6,
    lineHeight: 20,
  },
  year: {
    fontSize: 12,
    color: "#6c757d",
  },
  footerContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadMoreButton: {
    backgroundColor: "#228be6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadMoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212529",
  },
})