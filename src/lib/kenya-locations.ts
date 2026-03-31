export type KenyaCountyConfig = {
  center: {
    lat: number
    lng: number
  }
  constituencies: string[]
}

export const KENYA_LOCATIONS: Record<string, KenyaCountyConfig> = {
  "Baringo": {
    center: { lat: 0.4905, lng: 35.743 },
    constituencies: ["Tiaty", "Baringo North", "Baringo Central", "Baringo South", "Mogotio", "Eldama Ravine"],
  },
  "Bomet": {
    center: { lat: -0.7813, lng: 35.3416 },
    constituencies: ["Sotik", "Chepalungu", "Bomet East", "Bomet Central", "Konoin"],
  },
  "Bungoma": {
    center: { lat: 0.5635, lng: 34.5606 },
    constituencies: ["Mt. Elgon", "Sirisia", "Kabuchai", "Bumula", "Kanduyi", "Webuye East", "Webuye West", "Kimilili", "Tongaren"],
  },
  "Busia": {
    center: { lat: 0.4608, lng: 34.1115 },
    constituencies: ["Teso North", "Teso South", "Nambale", "Matayos", "Butula", "Funyula", "Budalangi"],
  },
  "Elgeyo-Marakwet": {
    center: { lat: 0.7439, lng: 35.4781 },
    constituencies: ["Marakwet East", "Marakwet West", "Keiyo North", "Keiyo South"],
  },
  "Embu": {
    center: { lat: -0.5396, lng: 37.4574 },
    constituencies: ["Manyatta", "Runyenjes", "Mbeere South", "Mbeere North"],
  },
  "Garissa": {
    center: { lat: -0.4569, lng: 39.6583 },
    constituencies: ["Garissa Township", "Balambala", "Lagdera", "Dadaab", "Fafi", "Ijara"],
  },
  "Homa Bay": {
    center: { lat: -0.5273, lng: 34.4571 },
    constituencies: ["Kasipul", "Kabondo Kasipul", "Karachuonyo", "Rangwe", "Homa Bay Town", "Ndhiwa", "Suba North", "Suba South"],
  },
  "Isiolo": {
    center: { lat: 0.3546, lng: 37.5822 },
    constituencies: ["Isiolo North", "Isiolo South"],
  },
  "Kajiado": {
    center: { lat: -1.8523, lng: 36.7768 },
    constituencies: ["Kajiado North", "Kajiado Central", "Kajiado East", "Kajiado West", "Kajiado South"],
  },
  "Kakamega": {
    center: { lat: 0.2827, lng: 34.7519 },
    constituencies: ["Lugari", "Likuyani", "Malava", "Lurambi", "Navakholo", "Mumias West", "Mumias East", "Matungu", "Butere", "Khwisero", "Shinyalu", "Ikolomani"],
  },
  "Kericho": {
    center: { lat: -0.367, lng: 35.2831 },
    constituencies: ["Kipkelion East", "Kipkelion West", "Ainamoi", "Bureti", "Belgut", "Sigowet/Soin"],
  },
  "Kiambu": {
    center: { lat: -1.1714, lng: 36.8356 },
    constituencies: ["Gatundu South", "Gatundu North", "Juja", "Thika Town", "Ruiru", "Githunguri", "Kiambu", "Kiambaa", "Kabete", "Kikuyu", "Limuru", "Lari"],
  },
  "Kilifi": {
    center: { lat: -3.6301, lng: 39.8499 },
    constituencies: ["Kilifi North", "Kilifi South", "Kaloleni", "Rabai", "Ganze", "Malindi", "Magarini"],
  },
  "Kirinyaga": {
    center: { lat: -0.6591, lng: 37.3827 },
    constituencies: ["Mwea", "Gichugu", "Ndia", "Kirinyaga Central"],
  },
  "Kisii": {
    center: { lat: -0.6773, lng: 34.7796 },
    constituencies: ["Bonchari", "South Mugirango", "Bomachoge Borabu", "Bobasi", "Bomachoge Chache", "Nyaribari Masaba", "Nyaribari Chache", "Kitutu Chache North", "Kitutu Chache South"],
  },
  "Kisumu": {
    center: { lat: -0.1022, lng: 34.7617 },
    constituencies: ["Kisumu East", "Kisumu West", "Kisumu Central", "Seme", "Nyando", "Muhoroni", "Nyakach"],
  },
  "Kitui": {
    center: { lat: -1.3741, lng: 38.0106 },
    constituencies: ["Mwingi North", "Mwingi West", "Mwingi Central", "Kitui West", "Kitui Rural", "Kitui Central", "Kitui East", "Kitui South"],
  },
  "Kwale": {
    center: { lat: -4.1833, lng: 39.4667 },
    constituencies: ["Msambweni", "Lunga Lunga", "Matuga", "Kinango"],
  },
  "Laikipia": {
    center: { lat: 0.0167, lng: 37.0667 },
    constituencies: ["Laikipia West", "Laikipia East", "Laikipia North"],
  },
  "Lamu": {
    center: { lat: -2.2717, lng: 40.902 },
    constituencies: ["Lamu East", "Lamu West"],
  },
  "Machakos": {
    center: { lat: -1.5177, lng: 37.2634 },
    constituencies: ["Masinga", "Yatta", "Kangundo", "Matungulu", "Kathiani", "Mavoko", "Machakos Town", "Mwala"],
  },
  "Makueni": {
    center: { lat: -1.803, lng: 37.624 },
    constituencies: ["Mbooni", "Kilome", "Kaiti", "Makueni", "Kibwezi West", "Kibwezi East"],
  },
  "Mandera": {
    center: { lat: 3.9366, lng: 41.867 },
    constituencies: ["Mandera West", "Banissa", "Mandera North", "Mandera South", "Mandera East", "Lafey"],
  },
  "Marsabit": {
    center: { lat: 2.3347, lng: 37.9909 },
    constituencies: ["Moyale", "North Horr", "Saku", "Laisamis"],
  },
  "Meru": {
    center: { lat: 0.0463, lng: 37.6559 },
    constituencies: ["Igembe South", "Igembe Central", "Igembe North", "Tigania West", "Tigania East", "North Imenti", "Buuri", "Central Imenti", "South Imenti"],
  },
  "Migori": {
    center: { lat: -1.0634, lng: 34.4731 },
    constituencies: ["Rongo", "Awendo", "Suna East", "Suna West", "Uriri", "Nyatike", "Kuria West", "Kuria East"],
  },
  "Mombasa": {
    center: { lat: -4.0435, lng: 39.6682 },
    constituencies: ["Changamwe", "Jomvu", "Kisauni", "Nyali", "Likoni", "Mvita"],
  },
  "Murang'a": {
    center: { lat: -0.721, lng: 37.152 },
    constituencies: ["Kangema", "Mathioya", "Kiharu", "Kigumo", "Maragwa", "Kandara", "Gatanga"],
  },
  "Nairobi": {
    center: { lat: -1.2864, lng: 36.8172 },
    constituencies: ["Westlands", "Dagoretti North", "Dagoretti South", "Lang'ata", "Kibra", "Roysambu", "Kasarani", "Ruaraka", "Embakasi South", "Embakasi North", "Embakasi Central", "Embakasi East", "Embakasi West", "Makadara", "Kamukunji", "Starehe", "Mathare"],
  },
  "Nakuru": {
    center: { lat: -0.3031, lng: 36.08 },
    constituencies: ["Molo", "Njoro", "Naivasha", "Gilgil", "Kuresoi South", "Kuresoi North", "Subukia", "Rongai", "Bahati", "Nakuru Town West", "Nakuru Town East"],
  },
  "Nandi": {
    center: { lat: 0.1034, lng: 35.184 },
    constituencies: ["Tinderet", "Aldai", "Nandi Hills", "Chesumei", "Emgwen", "Mosop"],
  },
  "Narok": {
    center: { lat: -1.0833, lng: 35.8667 },
    constituencies: ["Kilgoris", "Emurua Dikirr", "Narok North", "Narok East", "Narok South", "Narok West"],
  },
  "Nyamira": {
    center: { lat: -0.5633, lng: 34.9358 },
    constituencies: ["Kitutu Masaba", "West Mugirango", "North Mugirango", "Borabu"],
  },
  "Nyandarua": {
    center: { lat: -0.1801, lng: 36.379 },
    constituencies: ["Kinangop", "Kipipiri", "Ol Kalou", "Ol Jorok", "Ndaragwa"],
  },
  "Nyeri": {
    center: { lat: -0.4167, lng: 36.95 },
    constituencies: ["Tetu", "Kieni", "Mathira", "Othaya", "Mukurweini", "Nyeri Town"],
  },
  "Samburu": {
    center: { lat: 0.6721, lng: 37.3116 },
    constituencies: ["Samburu West", "Samburu North", "Samburu East"],
  },
  "Siaya": {
    center: { lat: 0.0615, lng: 34.2881 },
    constituencies: ["Ugenya", "Ugunja", "Alego Usonga", "Gem", "Bondo", "Rarieda"],
  },
  "Taita-Taveta": {
    center: { lat: -3.3965, lng: 38.5561 },
    constituencies: ["Taveta", "Wundanyi", "Mwatate", "Voi"],
  },
  "Tana River": {
    center: { lat: -1.5037, lng: 40.0334 },
    constituencies: ["Garsen", "Galole", "Bura"],
  },
  "Tharaka-Nithi": {
    center: { lat: -0.296, lng: 37.7238 },
    constituencies: ["Maara", "Chuka/Igambang'ombe", "Tharaka"],
  },
  "Trans Nzoia": {
    center: { lat: 1.0167, lng: 35.0 },
    constituencies: ["Kwanza", "Endebess", "Saboti", "Kiminini", "Cherangany"],
  },
  "Turkana": {
    center: { lat: 3.1167, lng: 35.6 },
    constituencies: ["Turkana North", "Turkana West", "Turkana Central", "Loima", "Turkana South", "Turkana East"],
  },
  "Uasin Gishu": {
    center: { lat: 0.5143, lng: 35.2698 },
    constituencies: ["Soy", "Turbo", "Moiben", "Ainabkoi", "Kapsaret", "Kesses"],
  },
  "Vihiga": {
    center: { lat: 0.076, lng: 34.722 },
    constituencies: ["Vihiga", "Sabatia", "Hamisi", "Luanda", "Emuhaya"],
  },
  "Wajir": {
    center: { lat: 1.7471, lng: 40.0573 },
    constituencies: ["Wajir North", "Wajir East", "Tarbaj", "Wajir West", "Eldas", "Wajir South"],
  },
  "West Pokot": {
    center: { lat: 1.2389, lng: 35.1119 },
    constituencies: ["Kapenguria", "Sigor", "Kacheliba", "Pokot South"],
  },
}

export const COUNTY_NAMES = Object.keys(KENYA_LOCATIONS)

export function parseRegion(region?: string | null) {
  const [county = "", constituency = ""] = (region ?? "").split(", ").map((value) => value.trim())
  return { county, constituency }
}

function isLegacyMockPolygon(coordinates: { lat: number; lng: number }[]) {
  const legacyMockPolygon = [
    { lat: -0.12, lng: 36.15 },
    { lat: -0.12, lng: 36.16 },
    { lat: -0.13, lng: 36.16 },
    { lat: -0.13, lng: 36.15 },
  ]

  return (
    coordinates.length === legacyMockPolygon.length &&
    coordinates.every(
      (coordinate, index) =>
        coordinate.lat === legacyMockPolygon[index].lat &&
        coordinate.lng === legacyMockPolygon[index].lng
    )
  )
}

function getSeedValue(seed: string) {
  return seed.split("").reduce((total, character, index) => total + character.charCodeAt(0) * (index + 1), 0)
}

export function buildFarmPolygon(county: string, constituency: string, seed: string) {
  const countyConfig = KENYA_LOCATIONS[county]
  if (!countyConfig) return []

  const constituencyIndex = Math.max(countyConfig.constituencies.indexOf(constituency), 0)
  const hash = getSeedValue(seed || `${county}-${constituency}`)
  const angle = ((constituencyIndex + 1) * 37 + hash % 360) * (Math.PI / 180)
  const radialOffset = 0.025 + (constituencyIndex % 5) * 0.008
  const jitter = (hash % 7) * 0.0015
  const centerLat = countyConfig.center.lat + Math.sin(angle) * radialOffset + jitter
  const centerLng = countyConfig.center.lng + Math.cos(angle) * radialOffset + jitter
  const halfHeight = 0.006
  const halfWidth = 0.008

  return [
    { lat: centerLat - halfHeight, lng: centerLng - halfWidth },
    { lat: centerLat - halfHeight, lng: centerLng + halfWidth },
    { lat: centerLat + halfHeight, lng: centerLng + halfWidth },
    { lat: centerLat + halfHeight, lng: centerLng - halfWidth },
  ]
}

export function resolveFarmCoordinates(
  polygonCoordinates: string,
  fallbackRegion?: string | null,
  seed = ""
) {
  try {
    const parsed = JSON.parse(polygonCoordinates) as { lat: number; lng: number }[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Missing coordinates")
    }

    if (fallbackRegion && isLegacyMockPolygon(parsed)) {
      const { county, constituency } = parseRegion(fallbackRegion)
      const rebuiltCoordinates = buildFarmPolygon(county, constituency, seed)
      if (rebuiltCoordinates.length > 0) {
        return rebuiltCoordinates
      }
    }

    return parsed
  } catch (error) {
    if (!fallbackRegion) return []

    const { county, constituency } = parseRegion(fallbackRegion)
    return buildFarmPolygon(county, constituency, seed)
  }
}
