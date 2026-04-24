<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import CountryCard from './components/CountryCard.vue'
import CountryDetail from './components/CountryDetail.vue'

const API_URL =
  'https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,currencies,languages,cca3'
const FAVORITES_STORAGE_KEY = 'vuecountries:favorites'

const countries = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')
const selectedRegion = ref('Všechny')
const selectedCountry = ref(null)
const favoriteIds = ref([])

const loadFavorites = () => {
  const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)

  if (!storedFavorites) {
    return
  }

  try {
    favoriteIds.value = JSON.parse(storedFavorites)
  } catch {
    favoriteIds.value = []
  }
}

const fetchCountries = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error('Nepodařilo se načíst seznam států.')
    }

    const data = await response.json()

    countries.value = data
      .map((country) => ({
        id: country.cca3,
        name: country.name?.common ?? 'Neznámý stát',
        flag: country.flags?.svg ?? country.flags?.png ?? '',
        flagAlt: country.flags?.alt ?? `Vlajka státu ${country.name?.common ?? ''}`,
        capital: country.capital?.[0] ?? 'Neuvedeno',
        region: country.region ?? 'Nezařazeno',
        population: country.population ?? 0,
        currencies: Object.values(country.currencies ?? {}).map(
          (currency) => currency.name,
        ),
        languages: Object.values(country.languages ?? {}),
      }))
      .sort((left, right) => left.name.localeCompare(right.name))
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Něco se pokazilo při načítání.'
  } finally {
    isLoading.value = false
  }
}

const regions = computed(() => [
  'Všechny',
  ...new Set(countries.value.map((country) => country.region).filter(Boolean)),
])

const filteredCountries = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  return countries.value.filter((country) => {
    const matchesQuery = country.name.toLowerCase().includes(normalizedQuery)
    const matchesRegion =
      selectedRegion.value === 'Všechny' || country.region === selectedRegion.value

    return matchesQuery && matchesRegion
  })
})

const favoriteCountries = computed(() =>
  countries.value.filter((country) => favoriteIds.value.includes(country.id)),
)

const isFavorite = (countryId) => favoriteIds.value.includes(countryId)

const toggleFavorite = (countryId) => {
  if (isFavorite(countryId)) {
    favoriteIds.value = favoriteIds.value.filter((id) => id !== countryId)
    return
  }

  favoriteIds.value = [...favoriteIds.value, countryId]
}

const openCountryDetail = (country) => {
  selectedCountry.value = country
}

const closeCountryDetail = () => {
  selectedCountry.value = null
}

watch(
  favoriteIds,
  (value) => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

onMounted(() => {
  loadFavorites()
  fetchCountries()
})
</script>

<template>
  <div class="app-shell">
    <header class="hero">
      <div>
        <p class="eyebrow">Vue 3 aplikace</p>
        <h1>VueCountries</h1>
        <p class="hero-copy">
          Procházej státy světa, filtruj je podle regionu a ukládej si své favority.
        </p>
      </div>
      <div class="hero-summary">
        <div>
          <span>Států celkem</span>
          <strong>{{ countries.length }}</strong>
        </div>
        <div>
          <span>Oblíbené</span>
          <strong>{{ favoriteCountries.length }}</strong>
        </div>
      </div>
    </header>

    <main class="content-grid">
      <section class="panel">
        <div class="filters">
          <label>
            <span>Hledat stát</span>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Např. Česko"
            />
          </label>

          <label>
            <span>Region</span>
            <select v-model="selectedRegion">
              <option v-for="region in regions" :key="region" :value="region">
                {{ region }}
              </option>
            </select>
          </label>
        </div>

        <p v-if="isLoading" class="status-message">Načítám seznam států…</p>
        <p v-else-if="errorMessage" class="status-message status-error">
          {{ errorMessage }}
        </p>
        <p v-else-if="filteredCountries.length === 0" class="status-message">
          Žádný stát neodpovídá zvolenému filtru.
        </p>

        <div v-else class="cards-grid">
          <CountryCard
            v-for="country in filteredCountries"
            :key="country.id"
            :country="country"
            :is-favorite="isFavorite(country.id)"
            @toggle-favorite="toggleFavorite(country.id)"
            @show-detail="openCountryDetail(country)"
          />
        </div>
      </section>

      <aside class="panel favorites-panel">
        <div class="panel-heading">
          <h2>Oblíbené státy</h2>
          <span>{{ favoriteCountries.length }}</span>
        </div>

        <p v-if="favoriteCountries.length === 0" class="favorites-empty">
          Zatím tu nic není. Přidej stát pomocí hvězdičky na kartě.
        </p>

        <ul v-else class="favorites-list">
          <li v-for="country in favoriteCountries" :key="country.id">
            <button type="button" class="favorite-link" @click="openCountryDetail(country)">
              <img :src="country.flag" :alt="country.flagAlt" />
              <span>{{ country.name }}</span>
            </button>
          </li>
        </ul>
      </aside>
    </main>

    <CountryDetail
      :country="selectedCountry"
      :is-favorite="selectedCountry ? isFavorite(selectedCountry.id) : false"
      @close="closeCountryDetail"
      @toggle-favorite="selectedCountry && toggleFavorite(selectedCountry.id)"
    />
  </div>
</template>
