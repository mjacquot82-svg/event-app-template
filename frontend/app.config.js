// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

export default {
  expo: {
    name: "Walkerton Homecoming 2026",
    slug: "walkerton-home-coming-2026",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/whc-logo.png",
    scheme: "walkertonhomecoming2026",
    userInterfaceStyle: "dark",
    newArchEnabled: false,
    jsEngine: "jsc",
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "Navigate to event locations at Walkerton Homecoming 2026",
        NSLocationAlwaysAndWhenInUseUsageDescription: "Track your path through Walkerton Homecoming 2026"
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/whc-logo.png",
        backgroundColor: "#000000"
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ],
      package: "com.mjacquot.ipm2026"
    },
    web: {
      bundler: "metro",
      favicon: "./assets/images/magnet.jpeg",
      output: "single",
      build: {
        babel: {
          include: []
        }
      }
    },
    plugins: [
      "expo-router",
      "expo-notifications",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/homecoming-splash-poster-proposal.png",
          imageWidth: 360,
          resizeMode: "contain",
          backgroundColor: "#000000"
        }
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Navigate to event locations at Walkerton Homecoming 2026",
          locationWhenInUsePermission: "Navigate to event locations at Walkerton Homecoming 2026"
        }
      ]
      // Note: @rnmapbox/maps requires a development build, not Expo Go
      // Uncomment when building with EAS:
      // [
      //   "@rnmapbox/maps",
      //   {
      //     RNMapboxMapsImpl: "mapbox",
      //     RNMapboxMapsDownloadToken: "sk.eyJ1IjoibWphY3F1b3QiLCJhIjoiY21tdmRwcXVuMDJsbjJycHBrcXV6czl3dyJ9.pUiimStUZ4mIXhkErun2MQ"
      //   }
      // ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: "your-project-id"
      }
    }
  }
};
