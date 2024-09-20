<template>
  <v-app id="inspire">
    <!-- App Bar with increased height -->
    <v-app-bar flat color="#5AD795" dark height="150px">
      <!-- Adjusting v-toolbar__content height -->
      <div class="v-toolbar__content" style="height: 180px">
        <v-container
          class="mx-auto d-flex justify-center justify-space-between"
        >
          <!-- Brand Name Button with SVG -->
          <v-btn
            text
            class="text-h6 font-weight-bold archivo-font"
            @click="navigateToTembi"
            style="font-size: 28px"
          >
            <!-- Add the Tembi logo SVG inline -->
            <TembiLogo />
          </v-btn>

          <!-- Spacer -->
          <v-spacer></v-spacer>

          <!-- New Button -->
          <v-btn text small @click="refetch" aria-label="New Quote">
            Get New Quote
          </v-btn>

          <!-- Favorites Button -->
          <v-btn text small @click="toggleFavorites"> Favorites </v-btn>
        </v-container>
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <!-- Move the v-sheet further down using margin-top -->
            <v-sheet
              min-height="100vh"
              rounded="lg"
              elevation="0"
              class="d-flex flex-column justify-center align-center pa-3"
              style="margin-top: 50px"
            >
              <!-- First Quote Card -->
              <v-card
                outlined
                class="pa-4 text-center w-100"
                style="
                  max-width: none;
                  min-height: 150px;
                  height: auto;
                  overflow: visible;
                "
              >
                <v-card-title
                  class="text-h5 font-weight-bold"
                  style="white-space: normal; word-wrap: break-word"
                >
                  <v-progress-circular
                    v-if="isFetching"
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                  <span v-else>{{
                    (data && data[0]?.q) || "Fetching inspirational quote..."
                  }}</span>
                </v-card-title>
                <v-card-subtitle
                  class="text-h6 font-italic text-right"
                  style="white-space: normal; word-wrap: break-word"
                >
                  - {{ (data && data[0]?.a) || "Unknown" }}
                </v-card-subtitle>

                <v-card-actions class="justify-center mt-4">
                  <v-btn color="primary" text small @click="refetch"
                    >New Quote</v-btn
                  >
                  <v-btn color="secondary" text small @click="saveToFavorites"
                    >Save to Favorites</v-btn
                  >
                </v-card-actions>
              </v-card>

              <!-- Favorites Section (conditionally shown) -->
              <v-card
                v-if="viewingFavorites"
                outlined
                class="pa-3 text-center w-100 mt-4"
                style="
                  max-width: none;
                  min-height: 150px;
                  height: auto;
                  overflow: visible;
                "
              >
                <v-card-title class="text-h5 font-weight-bold">
                  Favorite Quotes
                </v-card-title>

                <v-list v-if="favorites.length > 0">
                  <v-list-item
                    v-for="(quote, index) in favorites"
                    :key="index"
                    class="d-flex align-center"
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        style="white-space: normal; word-wrap: break-word"
                      >
                        {{ quote.q }}
                      </v-list-item-title>
                      <v-list-item-subtitle
                        style="white-space: normal; word-wrap: break-word"
                      >
                        - {{ quote.a }}
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <!-- Even Smaller Delete Button -->
                    <v-list-item-action>
                      <v-btn
                        icon
                        class="small-delete-btn"
                        @click="removeFavorite(index)"
                      >
                        <v-icon x-small>mdi-close</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
                <v-card-subtitle v-else class="text-center"
                  >No favorites saved yet.</v-card-subtitle
                >

                <!-- Close and Clear Buttons -->
                <v-card-actions class="justify-center mt-4">
                  <v-btn color="red" text small @click="clearFavorites"
                    >Clear All</v-btn
                  >
                  <v-btn color="primary" text small @click="closeFavorites"
                    >Close</v-btn
                  >
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
// Import the SVG file as a component
import TembiLogo from "/statistic/images/tembi-logo.svg";

import { onMounted, ref } from "vue";

// Fetch quotes using Nuxt's useFetch composable
const {
  data,
  pending: isFetching,
  refresh: refetch,
} = await useFetch("/api/quotes");

const brandName = "Tembi";
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

// Remove specific favorite quote
const removeFavorite = (index) => {
  favorites.value.splice(index, 1);
  if (process.client) {
    localStorage.setItem("favorites", JSON.stringify(favorites.value));
  }
};

// Navigate to Tembi website
const navigateToTembi = () => {
  window.location.href = "https://www.tembi.io/";
};
</script>

<style scoped>
/* Include the Archivo Black font */
/* Include the Archivo Black font for specific elements */
@import url("https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap");

/* Include the Rotunda font for the whole app */
@import url("https://fonts.googleapis.com/css2?family=Rotunda:wght@400&display=swap");

/* Apply Rotunda font to the entire application */
* {
  font-family: "Rotunda", sans-serif;
  font-weight: 400 !important; /* Set font weight to 400 */
  color: rgb(0, 0, 0); /* Set font color to black */
  font-size: 16px; /* Set font size to 16px */
  line-height: 24px; /* Set line height to 24px */
}

/* Specific font settings for Archivo Black */
.archivo-font {
  font-family: "Archivo Black", sans-serif;
}

/* Ensure specific targeting for the font size */
.v-btn.archivo-font {
  font-size: 28px !important; /* Make sure the font size is applied */
}

/* Additional styles for layout */
.cursor-pointer {
  cursor: pointer;
}

.v-card {
  background-color: #ffffff;
}

.v-list-item-title {
  font-size: 14px;
}

.v-btn {
  min-width: 100px;
  font-size: 14px;
}

.v-app-bar {
  font-size: 16px;
  min-height: 100px; /* Increase the height of the app bar */
}

.v-icon {
  font-size: 18px;
}

.my-4 {
  margin: 16px 0; /* Adds space between the two cards */
}

/* Even smaller delete button */
.small-delete-btn {
  padding: 0;
  min-width: 24px; /* Make the button smaller */
}

.v-btn .v-icon {
  font-size: 12px; /* Make the delete icon smaller */
}
</style>
