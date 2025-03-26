# Movie Search App

A React Native mobile application that allows users to search for movies using the OMDB API. Built with Expo and TypeScript.

## Features

- Search movies by title
- View movie details including year and poster
- Infinite scroll for loading more results
- Save favorite movies
- Responsive grid layout
- Popular movies displayed on startup

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your mobile device

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Vikas2430/MovieSearchApp.git
cd MovieSearchApp
```

2. Install dependencies:
```bash
npm install
npm install @react-native-async-storage/async-storage@1.23.1 @react-navigation/native@6.1.9 @react-navigation/native-stack@6.9.17 expo@50.0.5 expo-status-bar@1.11.1 react@18.2.0 react-native@0.73.2 react-native-safe-area-context@4.8.2 react-native-screens@3.29.0 react-native-web@0.19.6 @babel/core@7.20.0 @types/react@18.2.45 typescript@5.1.3 tailwindcss@3.3.2 @types/tailwindcss@3.1.0# 
```

## Running the App

You can start the development server using either of these commands:

1. Using npm:
```bash
npm start
```

2. Using Expo CLI:
```bash
npx expo start
```

3. Running on your device:
   - Scan the QR code with Expo Go App (Android) or the Camera app (iOS) and make sure the phone device and your laptop/PC should be on the same netweok
   - Press 'a' to open in Android emulator
   - Press 'i' to open in iOS simulator
   - Press 'w' to open in web browser

Note: Both `npm start` and `npx expo start` will work the same way. Use whichever you prefer.

## Project Structure

```
MovieSearchApp/
├── app/              # App entry point
├── screens/          # Screen components
│   ├── HomeScreen.tsx
│   ├── MovieDetailScreen.tsx
│   └── FavoritesScreen.tsx
├── components/       # Reusable components
├── assets/          # Images and fonts
└── App.tsx          # Root component
```

## Environment Variables

The app uses the OMDB API. You'll need to:
1. Get an API key from [OMDB API](http://www.omdbapi.com/)
2. The API key is already configured in the app: "6cb1c495"


## Troubleshooting

Common issues and solutions:

1. If you see "Unable to find expo in this project":
```bash
npm install expo
```

2. If you have dependency issues:
```bash
npm install --force
```

3. To clear Metro bundler cache:
```bash
npx expo start --clear
# or
npm start -- --clear
```


## Acknowledgments

- [OMDB API](http://www.omdbapi.com/) for providing movie data
- [Expo](https://expo.dev/) for the development framework
- [React Native](https://reactnative.dev/) for the mobile framework
