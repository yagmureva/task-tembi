<template>
  <v-app id="inspire">
    <!-- App Bar with increased height -->
    <v-app-bar flat color="#5AD795" dark height="150px">
      <!-- Adjusting v-toolbar__content height -->
      <div class="v-toolbar__content" style="height: 120px">
        <v-container class="mx-auto d-flex justify-space-between align-center">
          <!-- Brand Name Button with SVG -->
          <v-btn
            text
            class="text-h6 font-weight-bold archivo-font"
            @click="navigateToTembi"
            style="font-size: 28px"
          >
            <TembiLogo />
          </v-btn>

          <!-- Spacer to push buttons to the right -->
          <v-spacer></v-spacer>

          <!-- Aesthetic New Quote Button -->
          <v-btn
            small
            @click="refetch"
            aria-label="New Quote"
            class="custom-btn button-spacing"
            >Get New Quote</v-btn
          >

          <!-- Aesthetic Favorites Button -->
          <v-btn small @click="goToFavorites" class="custom-btn button-spacing"
            >Favorites</v-btn
          >
        </v-container>
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <v-sheet
              min-height="100vh"
              rounded="lg"
              elevation="0"
              class="d-flex flex-column justify-center align-center pa-3"
              style="margin-top: 50px"
            >
              <v-card
                outlined
                class="pa-4 text-center w-100"
                style="max-width: none; min-height: 400px; height: auto"
              >
                <v-card-title
                  class="text-h5 font-weight-bold quote-text"
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
                  class="text-h6 font-italic author-text text-right"
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
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Dialog for showing the pop-up -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Success</v-card-title>
        <v-card-text>
          {{ dialogMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
// Import the SVG file as a component
import TembiLogo from "/statistic/images/tembi-logo.svg";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";

// Fetch quotes using Nuxt's useFetch composable
const {
  data,
  pending: isFetching,
  refresh: refetch,
} = await useFetch("/api/quotes");

const favorites = ref([]);
const dialog = ref(false);
const dialogMessage = ref("");

onMounted(() => {
  const intervalId = setInterval(refetch, 60000);

  if (process.client) {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.value = storedFavorites;
  }

  return () => clearInterval(intervalId);
});

const saveToFavorites = () => {
  const quote = { q: data.value[0]?.q, a: data.value[0]?.a };

  if (favorites.value.some((fav) => fav.q === quote.q && fav.a === quote.a)) {
    dialogMessage.value = "This quote is already in your favorites.";
    dialog.value = true; // Open dialog
    return;
  }

  favorites.value.push(quote);
  if (process.client) {
    localStorage.setItem("favorites", JSON.stringify(favorites.value));
    dialogMessage.value = "Quote saved to favorites!";
    dialog.value = true; // Open dialog
  }
};

const navigateToTembi = () => {
  window.location.href = "https://www.tembi.io/";
};

const router = useRouter();
const goToFavorites = () => {
  router.push("/favorites");
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Rotunda:wght@400&display=swap");

.archivo-font {
  font-family: "Archivo Black", sans-serif;
}

.v-btn.archivo-font {
  font-size: 28px !important;
  transform: translateY(-20px);
}

.v-card-title {
  margin-top: 40px;
}

.v-card-subtitle {
  margin-top: 20px;
}

.quote-text {
  font-size: 72px; /* Make the quote text double the size */
  color: #282727;
}

.author-text {
  font-size: 24px; /* Keeping the author text as is */
}

/* Aesthetic Button Styles */
.custom-btn {
  background-color: #ecdac2 !important;
  color: black !important;
  border-radius: 50px; /* Rounded corners */
  padding: 10px 20px; /* Padding for a nicer look */
  font-weight: bold;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Add shadow */
  transition: all 0.3s ease-in-out; /* Smooth hover transition */
}

.custom-btn:hover {
  background-color: #e3c7a8 !important; /* Slightly darker on hover */
  transform: translateY(-2px); /* Lift on hover */
}

/* Add margin to buttons */
.button-spacing {
  margin-right: 15px; /* Adjust this value for more or less space */
}
</style>
