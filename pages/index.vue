<template>
  <v-app id="inspire">
    <!-- App Bar -->
    <v-app-bar flat color="primary" dark>
      <v-container class="mx-auto d-flex align-center justify-center">
        <v-btn text class="text-h5 font-weight-bold" @click="goToHome">{{
          brandName
        }}</v-btn>
        <v-spacer></v-spacer>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <!-- Sidebar with List of Actions -->
          <v-col cols="12" md="2">
            <v-sheet rounded="lg" elevation="3" class="pa-3">
              <v-list>
                <v-list-item
                  v-for="(link, index) in sidebarLinks"
                  :key="index"
                  @click="navigate(link)"
                  class="cursor-pointer"
                >
                  <v-list-item-title>{{ link.title }}</v-list-item-title>
                </v-list-item>

                <v-divider class="my-3"></v-divider>

                <!-- Refresh Button -->
                <v-btn
                  color="primary"
                  @click="refetch"
                  class="ma-2"
                  icon
                  aria-label="Refresh Quotes"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-list>
            </v-sheet>
          </v-col>

          <!-- Main Quotes Section -->
          <v-col cols="12" md="8">
            <v-sheet
              min-height="70vh"
              rounded="lg"
              elevation="3"
              class="d-flex flex-column justify-center align-center pa-5"
            >
              <v-card outlined class="pa-5" max-width="600">
                <v-card-title class="text-h4 font-weight-bold text-center">
                  <v-progress-circular
                    v-if="isFetching"
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                  <span v-else>
                    {{
                      (data && data[0]?.q) || "Fetching inspirational quote..."
                    }}
                  </span>
                </v-card-title>
                <v-card-subtitle class="text-h6 text-right">
                  - {{ (data && data[0]?.a) || "Unknown" }}
                </v-card-subtitle>

                <!-- New Quote and Save to Favorites Button -->
                <v-card-actions class="justify-center mt-4">
                  <v-btn color="primary" @click="refetch" depressed
                    >New Quote</v-btn
                  >
                  <v-btn color="secondary" @click="saveToFavorites" depressed>
                    Save to Favorites
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-sheet>
          </v-col>

          <!-- Favorites Section -->
          <v-col cols="12" md="8" v-if="viewingFavorites">
            <v-sheet
              min-height="70vh"
              rounded="lg"
              elevation="3"
              class="d-flex flex-column justify-center align-center pa-5"
            >
              <v-card outlined class="pa-5" max-width="600">
                <v-card-title class="text-h4 font-weight-bold text-center">
                  Favorite Quotes
                </v-card-title>

                <v-list v-if="favorites.length > 0">
                  <v-list-item v-for="(quote, index) in favorites" :key="index">
                    <v-list-item-content>
                      <v-list-item-title>{{ quote.q }}</v-list-item-title>
                      <v-list-item-subtitle
                        >- {{ quote.a }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-card-subtitle v-else class="text-center"
                  >No favorites saved yet.</v-card-subtitle
                >

                <!-- Clear Favorites Button -->
                <v-card-actions class="justify-center mt-4">
                  <v-btn color="red" @click="clearFavorites" depressed>
                    Clear Favorites
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, ref } from "vue";

// Fetch quotes using Nuxt's useFetch composable
const {
  data,
  pending: isFetching,
  refresh: refetch,
} = await useFetch("/api/quotes");

// Define brand name and sidebar links
const brandName = "TEMBI";
const sidebarLinks = [{ title: "Quote List" }, { title: "Favorites" }];

// State for viewing favorites and saved favorite quotes
const viewingFavorites = ref(false);
const favorites = ref([]);

// Automatically refetch a new quote every 60 seconds
onMounted(() => {
  const intervalId = setInterval(refetch, 60000); // Refetch every 60 seconds

  if (process.client) {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.value = storedFavorites;
  }

  return () => clearInterval(intervalId); // Clear interval when component is destroyed
});

// Save the current quote to localStorage as a favorite
const saveToFavorites = () => {
  const quote = { q: data.value[0]?.q, a: data.value[0]?.a };

  if (favorites.value.some((fav) => fav.q === quote.q && fav.a === quote.a)) {
    alert("This quote is already in your favorites.");
    return;
  }

  favorites.value.push(quote);
  if (process.client) {
    localStorage.setItem("favorites", JSON.stringify(favorites.value));
    alert("Quote saved to favorites!");
  }
};

// Clear all favorites
const clearFavorites = () => {
  favorites.value = [];
  if (process.client) {
    localStorage.removeItem("favorites");
    alert("All favorites cleared.");
  }
};

// Navigation to handle switching between quote list and favorites
const navigate = (link) => {
  viewingFavorites.value = link.title === "Favorites";
};

// Navigate to the home (brand logo click)
const goToHome = () => {
  viewingFavorites.value = false;
};
</script>

<style scoped>
/* Add additional styling if needed */
.cursor-pointer {
  cursor: pointer;
}
</style>
