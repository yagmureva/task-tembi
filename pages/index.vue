<template>
  <v-app id="inspire">
    <!-- App Bar -->
    <v-app-bar flat color="primary" dark>
      <v-container class="mx-auto d-flex align-center justify-space-between">
        <!-- Brand Name Button -->
        <v-btn text class="text-h5 font-weight-bold" @click="goToHome">
          {{ brandName }}
        </v-btn>

        <!-- Toolbar Buttons -->
        <v-spacer></v-spacer>

        <!-- Quote List Button -->
        <v-btn text @click="showQuotes"> Quote List </v-btn>

        <!-- Refresh Button -->
        <v-btn icon @click="refetch" aria-label="Refresh Quotes">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>

        <!-- Favorites Button -->
        <v-btn text @click="toggleFavorites"> Favorites </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <v-sheet
              min-height="100vh"
              rounded="lg"
              elevation="2"
              class="d-flex flex-column justify-center align-center pa-5"
            >
              <!-- First Quote Card -->
              <v-card
                outlined
                class="pa-5 text-center w-100"
                style="max-width: none"
              >
                <v-card-title class="text-h4 font-weight-bold">
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
                <v-card-subtitle class="text-h6 font-italic text-right">
                  - {{ (data && data[0]?.a) || "Unknown" }}
                </v-card-subtitle>

                <v-card-actions class="justify-center mt-4">
                  <v-btn color="primary" @click="refetch" depressed>
                    New Quote
                  </v-btn>
                  <v-btn color="secondary" @click="saveToFavorites" depressed>
                    Save to Favorites
                  </v-btn>
                </v-card-actions>
              </v-card>

              <!-- Favorites Section (conditionally shown) -->
              <v-card
                v-if="viewingFavorites"
                outlined
                class="pa-5 text-center w-100 mt-4"
                style="max-width: none"
              >
                <v-card-title class="text-h4 font-weight-bold">
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
                <v-card-subtitle v-else class="text-center">
                  No favorites saved yet.
                </v-card-subtitle>

                <!-- Close and Clear Buttons -->
                <v-card-actions class="justify-center mt-4">
                  <v-btn color="red" @click="clearFavorites" depressed>
                    Clear Favorites
                  </v-btn>
                  <v-btn color="primary" @click="closeFavorites" depressed>
                    Close
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

const brandName = "TEMBI";
const favorites = ref([]);
const viewingFavorites = ref(false); // State to track whether the favorites section is shown

// Automatically refetch a new quote every 60 seconds
onMounted(() => {
  const intervalId = setInterval(refetch, 60000);

  if (process.client) {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.value = storedFavorites;
  }

  return () => clearInterval(intervalId);
});

// Show or hide Favorites section
const toggleFavorites = () => {
  viewingFavorites.value = !viewingFavorites.value;
};

// Close the Favorites section
const closeFavorites = () => {
  viewingFavorites.value = false;
};

// Show Quotes and hide Favorites
const showQuotes = () => {
  viewingFavorites.value = false;
};

// Save current quote to localStorage
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

// Navigate to home (if needed)
const goToHome = () => {
  viewingFavorites.value = false;
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.v-card {
  background-color: #ffffff;
}

.v-list-item-title {
  font-size: 16px;
}

.v-btn {
  min-width: 150px;
}

.my-4 {
  margin: 16px 0; /* Adds space between the two cards */
}
</style>
