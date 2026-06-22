# ⚡ QuizDuel

Real-time 1v1 quiz battles built with React Native + Expo + Firebase.

## Stack

| Layer | Tech |
|---|---|
| Framework | React Native 0.74 + Expo SDK 51 |
| Navigation | Expo Router v3 |
| Auth | Firebase Anonymous Auth |
| Live game state | Firebase Realtime Database |
| Questions / profiles | Firestore (local data included) |
| Animations | react-native-reanimated 3 |
| Haptics | expo-haptics |
| Gradients | expo-linear-gradient |
| Storage | @react-native-async-storage/async-storage |

---

## Project structure

```
QuizDuel/
├── app/                        # Expo Router routes (thin wrappers)
│   ├── _layout.tsx
│   ├── index.tsx               # → redirects to /home
│   ├── home.tsx
│   ├── topic-select.tsx
│   ├── matchmaking.tsx
│   ├── game.tsx
│   └── result.tsx
├── src/
│   ├── screens/                # All UI logic lives here
│   │   ├── HomeScreen.tsx
│   │   ├── TopicSelectScreen.tsx
│   │   ├── MatchmakingScreen.tsx
│   │   ├── GameScreen.tsx
│   │   └── ResultScreen.tsx
│   ├── services/
│   │   ├── firebase.ts         # Firebase app initialisation
│   │   ├── matchmaking.ts      # Room lifecycle + real-time subscription
│   │   └── scoring.ts          # Points calculation + combo multiplier
│   ├── components/
│   │   ├── AnswerButton.tsx    # Shake on wrong, pulse on correct
│   │   ├── QuestionCard.tsx
│   │   ├── TimerBar.tsx        # Animated, colour-shifting bar
│   │   ├── ScoreBoard.tsx      # Live scores for both players
│   │   └── PlayerAvatar.tsx
│   ├── data/
│   │   └── questions.ts        # 13 questions × 5 topics (65 total)
│   └── types/
│       └── index.ts
```

---

## Firebase setup

### 1. Create a project

Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.

### 2. Enable services

| Service | Where |
|---|---|
| Anonymous Auth | Authentication → Sign-in method → Anonymous → Enable |
| Realtime Database | Build → Realtime Database → Create database (start in **test mode** first) |
| Firestore | Build → Firestore Database → Create database (optional, used for future profile storage) |

### 3. Get your config

Project settings (gear icon) → Your apps → Web → Register app → copy the `firebaseConfig` object.

### 4. Set env vars

```bash
cp .env.example .env
# Fill in every EXPO_PUBLIC_* value from your firebaseConfig
```

Expo reads `EXPO_PUBLIC_*` variables at build time from `.env`.

### 5. Realtime Database security rules

Go to Realtime Database → Rules and paste:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

> For production, lock this down further so players can only write to their own player node.

---

## Local development

```bash
# Install dependencies
npm install

# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

> Requires Expo CLI (`npm i -g expo-cli`) and either Xcode (iOS) or Android Studio (Android).

---

## EAS Build (production)

```bash
# Install EAS CLI
npm i -g eas-cli

# Log in
eas login

# Configure (creates eas.json on first run)
eas build:configure

# Build for both platforms
npm run build:ios
npm run build:android
```

Make sure your `app.json` has the correct `bundleIdentifier` (iOS) and `package` (Android) before building.

---

## Game mechanics

### Scoring

| Event | Points |
|---|---|
| Correct answer | 100 base |
| Speed bonus | up to +90 (proportional to time remaining) |
| Combo multiplier | 2× after 3 correct answers in a row |
| Wrong answer | 0 (resets combo) |

### Sync model

- Host player writes `startedAt` to Firebase when the countdown reaches zero.
- Both clients derive the current question index from:
  ```
  questionIndex = floor((Date.now() - startedAt) / 10_500)
  ```
- This keeps both players on the same question without a round-trip per question change.

### Matchmaking

**Random** — queries Firebase RTDB for a `waiting` room with matching topic and 1 player slot open. Creates a new room if none found.

**Friend** — host creates a room and shares the room ID (6–20 chars) as a code. Guest enters it from the Matchmaking screen's `friendCode` param.

---

## Adding more questions

Edit `src/data/questions.ts`. Each question follows this shape:

```typescript
{
  id: 'unique_id',          // e.g. 'cin_14'
  topic: 'Cinema',          // Cinema | Sport | Geography | Music | Science
  text: 'Question text?',
  options: ['A', 'B', 'C', 'D'],
  correctIndex: 0,          // 0-based index into options
}
```

Each match draws 10 questions per topic at random using Fisher-Yates shuffle.

---

## Assets

Before building you need to add three image assets (Expo requires them):

| File | Size | Purpose |
|---|---|---|
| `assets/icon.png` | 1024×1024 | App icon |
| `assets/splash.png` | 1284×2778 | Splash screen |
| `assets/adaptive-icon.png` | 1024×1024 | Android adaptive icon foreground |

Use a dark background (`#0a0a1a`) with a purple ⚡ lightning bolt for a consistent look.

---

## Roadmap ideas

- [ ] Persistent leaderboard in Firestore
- [ ] Custom avatar selection
- [ ] Daily challenge mode
- [ ] Sound effects (expo-av)
- [ ] Push notifications for rematch requests
- [ ] Admin panel to manage questions
