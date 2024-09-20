// server/api/quotes.js
export default defineEventHandler(async () => {
  try {
    // ZenQuotes API'den veri al
    const response = await $fetch("https://zenquotes.io/api/random");
    return response;
  } catch (error) {
    console.error("API error:", error);
    return { error: "Failed to fetch quotes" };
  }
});
