export async function fetchRainfallData(lat: number, lon: number): Promise<number> {
  // Using Open-Meteo API for historical or current weather data
  // Free access, no API key required for non-commercial MVP
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&timezone=auto&past_days=1`
    )
    if (!response.ok) throw new Error("Failed to fetch weather data")
    
    const data = await response.json()
    // Return precipitation sum of yesterday or today
    const rainfall = data?.daily?.precipitation_sum?.[0] || 0
    return rainfall
  } catch (error) {
    console.error("Open-Meteo Fetch Error:", error)
    return 0
  }
}
