export type RainfallData = {
  dates: string[]
  dailyRainfall: number[]
  totalMm: number
  periodDays: number
}

export async function fetchRainfallData(
  lat: number,
  lon: number,
  periodDays: number = 30
): Promise<RainfallData> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&timezone=Africa%2FNairobi&past_days=${periodDays}&forecast_days=0`,
      { cache: "no-store" }
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()
    const dailyRainfall: number[] = ((data?.daily?.precipitation_sum as (number | null)[] | undefined) ?? [])
      .map((value) => value ?? 0)

    const totalMm = Number(
      dailyRainfall.reduce((sum, value) => sum + value, 0).toFixed(1)
    )

    return {
      dates: data?.daily?.time ?? [],
      dailyRainfall,
      totalMm,
      periodDays,
    }
  } catch (error) {
    console.error("Open-Meteo Fetch Error:", error)
    return {
      dates: [],
      dailyRainfall: [],
      totalMm: 0,
      periodDays,
    }
  }
}
