<div align="center">
  <h1>🌍 Triply : AI Trip Planner</h1>
  <p><i>Your intelligent, AI-powered travel companion.</i></p>

  <!-- Tech Stack Badges -->
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini" />
</div>

<br />

Welcome to **AI Trip Planner**, a modern web application designed to take the stress out of travel planning. By leveraging the power of advanced Artificial Intelligence (Google Gemini), this app crafts highly personalized, day-by-day itineraries based on your exact destination, budget, travel companions, and dietary preferences. 

Say goodbye to hours of research and let AI engineer your perfect adventure, presented on a beautifully animated, interactive timeline with real-world imagery!

## ✨ Key Features

* 🧠 **AI-Powered Itineraries:** Uses the **Google Gemini API** to generate smart, localized travel plans tailored strictly to your inputs.
* 📍 **Smart Destination Autocomplete:** Integrates with the free **OpenStreetMap API** to provide real-time city suggestions (with priority sorting for local regions).
* 🎨 **Interactive Curvy Timeline:** A beautiful, alternating left-to-right timeline layout featuring scroll-triggered fade animations and unique color themes for every day of the trip.
* 🖼️ **Zero-Cost Image Fetching:** Bypasses expensive Google Maps billing by using a clever combination of the **Wikipedia API** (for real landmark photos) and **Unsplash** (for stunning, high-quality fallbacks).
* 🗺️ **Google Maps Integration:** Every generated location image and title is a clickable link that instantly opens a targeted Google Maps search for seamless navigation.
* 🔒 **Secure Authentication:** Protected by **Firebase Authentication** (Google OAuth), ensuring only logged-in users can generate trips.

## 🚶‍♂️ How It Works

1. **Sign In:** Securely log in using your Google account via Firebase.
2. **Set Preferences:** Enter your destination, number of days, budget, travel companions, and dietary restrictions.
3. **Generate:** The app sends a highly structured prompt to Google Gemini.
4. **Explore:** Scroll through your custom, beautifully animated timeline itinerary!

## 💻 Tech Stack

**Frontend Architecture**
* **Core Framework:** React.js
* **Build Tool:** Vite
* **Styling:** Custom CSS3 (utilizing `@keyframes` and `IntersectionObserver`)

**Backend & AI Services**
* **Artificial Intelligence:** Google Gemini 3.5 Flash API (`@google/generative-ai`)
* **User Authentication:** Firebase Auth (Google Sign-In Provider)

**External APIs & Data**
* **Location Search:** OpenStreetMap (Nominatim) API
* **Dynamic Imagery:** Wikipedia API + Unsplash Source API

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
* Node.js (v16 or higher)
* A [Google Gemini API Key](https://aistudio.google.com/)
* A [Firebase Project](https://console.firebase.google.com/) with Google Sign-In enabled

### Installation

1. **Clone the repository:**
```bash
   git clone [https://github.com/yourusername/ai-trip-planner.git](https://github.com/yourusername/ai-trip-planner.git)
   cd ai-trip-planner
```

2. **Install dependencies:**
```bash
   npm install
```

3. **Set up Environment Variables:**
Create a .env file in the root directory. (Note: Ensure .env is added to your .gitignore file to protect your keys!)
```bash
   # Google Gemini AI Key
   VITE_GEMINI_API_KEY="your_gemini_api_key_here"
   
   # Firebase Configuration
   VITE_FIREBASE_API_KEY="your_firebase_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
   VITE_FIREBASE_APP_ID="your_app_id"
```

4. **Start the Development Server:**
```bash
   npm run dev
```

## 🗺️ Roadmap
* [ ] Add Firebase Firestore to save generated trips to a user profile.

* [ ] Implement a "Share Trip" feature to send itineraries to friends.

* [ ] Add PDF export functionality.

* [ ] Provide alternative routing integration (Uber/Lyft estimates).

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
