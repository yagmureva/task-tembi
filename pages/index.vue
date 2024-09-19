<template>
  <v-app id="inspire">
    <!-- App Bar -->
    <v-app-bar flat>
      <v-container class="mx-auto d-flex align-center justify-center">
        <!-- Logo or Brand Name -->
        <v-btn text class="text-h5 font-weight-bold">{{ brandName }}</v-btn>
        <v-spacer></v-spacer>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <!-- Sidebar with List of Actions -->
          <v-col cols="2">
            <v-sheet rounded="lg" elevation="3">
              <v-list rounded="lg">
                <v-list-item
                  v-for="(link, index) in sidebarLinks"
                  :key="index"
                  :title="link.title"
                  link
                ></v-list-item>

                <v-divider class="my-2"></v-divider>

                <!-- Refresh Button -->
                <v-list-item
                  color="grey-lighten-4"
                  title="Refresh Quotes"
                  @click="refetch"
                  link
                >
                  <v-icon left>mdi-refresh</v-icon>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <!-- Main Quotes Section -->
          <v-col>
            <v-sheet
              min-height="70vh"
              rounded="lg"
              elevation="3"
              class="d-flex flex-column justify-center align-center"
            >
              <v-card outlined class="pa-5" max-width="600">
                <v-card-title class="text-h4 font-weight-bold text-center">
                  <v-progress-circular
                    v-if="isFetching"
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                  <span v-else>{{
                    (data && data[0]?.q) || "Fetching inspirational quote..."
                  }}</span>
                </v-card-title>
                <v-card-subtitle class="text-h6 text-right">
                  - {{ (data && data[0]?.a) || "Unknown" }}
                </v-card-subtitle>

                <!-- New Quote Button -->
                <v-card-actions class="justify-center mt-4">
                  <v-btn color="primary" @click="refetch">New Quote</v-btn>
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
// Nuxt 3'ün useFetch composable'ını kullanarak veri çekiyoruz.
// Bu fetch işlemi sadece sunucu tarafında gerçekleşir.
const {
  data,
  pending: isFetching,
  refresh: refetch,
} = await useFetch("/api/quotes");

// Markalar ve kenar çubuğu linklerini tanımlıyoruz.
const brandName = "TEMBI";
const sidebarLinks = [{ title: "Quote List" }, { title: "Favorites" }];
</script>
