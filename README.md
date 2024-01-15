# movie-web native-app

Native-app for movie-web.

## Getting started

```bash
pnpm install

// Having nx installed globally is recommended
pnpm install -g nx

// If you don't want nx installed globally, you can use the following command
(pnpm exec or npx) nx <command>
```

## Running tasks

To execute tasks with Nx use the following syntax:

```bash
nx <target> <project> <...options>
```

For example, to run the mobile app:

### Android

```bash
nx run mobile:android
```

### iOS

```bash
nx run mobile:ios
```

## Building archives

### Android .apk

```bash
nx run mobile:prebuild --platform=android
cd apps/mobile/android && ./gradlew assembleRelease
```

### iOS .app

#### Real device

```bash
nx run mobile:prebuild --platform=ios
cd apps/mobile/ios && xcodebuild archive -workspace movieweb.xcworkspace -scheme "movieweb" -sdk iphoneos -configuration "Release"  -archivePath "build/app.xcarchive" -destination generic/platform=iOS CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO
```

#### Simulator

```bash
nx run mobile:prebuild --platform=ios
cd apps/mobile/ios && xcodebuild archive -workspace movieweb.xcworkspace -scheme "movieweb" -sdk iphonesimulator -configuration "Release"  -archivePath "build/app.xcarchive" -destination "generic/platform=iOS Simulator" CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO
```

## Repository information

This project uses Nx to manage the monorepo. For more information about Nx, visit [nx.dev](https://nx.dev).

### Mobile app

The mobile app is built with React Native and Expo. For more information about Expo, visit [expo.io](https://expo.io).
