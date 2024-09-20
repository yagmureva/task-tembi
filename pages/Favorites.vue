<template>
  <v-app id="inspire">
    <!-- App Bar with same design -->
    <v-app-bar flat color="#5AD795" dark height="150px">
      <div class="v-toolbar__content" style="height: 120px">
        <v-container
          class="mx-auto d-flex justify-center justify-space-between"
        >
          <v-btn
            text
            class="text-h6 font-weight-bold archivo-font"
            @click="navigateToTembi"
            style="font-size: 28px"
          >
            <TembiLogo />
          </v-btn>

          <v-spacer></v-spacer>

          <!-- Back to Main Page -->
          <v-btn text small @click="goToMainPage"> Back to Quotes </v-btn>
        </v-container>
      </div>
    </v-app-bar>

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
              <!-- Display each favorite quote -->
              <v-card
                v-for="(quote, index) in favorites"
                :key="index"
                outlined
                class="pa-4 text-center w-100 mb-4"
                style="max-width: none; min-height: 200px; height: auto"
              >
                <v-card-title
                  class="text-h5 font-weight-bold"
                  style="white-space: normal; word-wrap: break-word"
                >
                  {{ quote.q }}
                </v-card-title>
                <v-card-subtitle
                  class="text-h6 font-italic text-right"
                  style="white-space: normal; word-wrap: break-word"
                >
                  - {{ quote.a }}
                </v-card-subtitle>

                <!-- Add delete button to remove individual quotes -->
                <v-card-actions class="justify-center mt-4">
                  <v-btn color="error" text small @click="removeFavorite(index)"
                    >Remove</v-btn
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
import TembiLogo from "/statistic/images/tembi-logo.svg";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const favorites = ref([]);

// Retrieve favorites from localStorage on component mount
onMounted(() => {
  if (process.client) {
    favorites.value = JSON.parse(localStorage.getItem("favorites")) || [];
  }
});

// Function to remove a quote from favorites
const removeFavorite = (index) => {
  favorites.value.splice(index, 1); // Remove the selected quote from the array

  // Update localStorage with the new favorites list
  if (process.client) {
    localStorage.setItem("favorites", JSON.stringify(favorites.value));
  }

  alert("Quote removed from favorites.");
};

// Navigate to the Tembi website
const navigateToTembi = () => {
  window.location.href = "https://www.tembi.io/";
};

// Navigate back to the main quotes page
const router = useRouter();
const goToMainPage = () => {
  router.push("/");
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Rotunda:wght@400&display=swap");

* {
  font-family: "Rotunda", sans-serif;
  font-weight: 400 !important;
  color: rgb(0, 0, 0);
  font-size: 16px;
  line-height: 24px;
}

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
</style>
