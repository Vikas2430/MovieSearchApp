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
# or
yarn install
```

## Running the App

You can start the development server using either of these commands:

1. Using npm:
```bash
npm start
```
Then scan the QR code with Expo Go app and make sure the phone device is connected to the same network which is connected to laptop/PC

2. Using Expo CLI:
```bash
npx expo start
```

3. Running on your device:
   - Scan the QR code with Expo Go (Android) or the Camera app (iOS)
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

## Building for Production

To create a production build:

1. Build for Android:
```bash
expo build:android
```

2. Build for iOS:
```bash
expo build:ios
```

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
