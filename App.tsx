import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "./screens/HomeScreen"
import MovieDetailScreen from "./screens/MovieDetailScreen"
import FavoritesScreen from "./screens/FavoritesScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Movie Search" }} />
        <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: "Movie Details" }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: "My Favorites" }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

