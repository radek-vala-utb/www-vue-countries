<script setup>
defineProps({
  country: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['show-detail', 'toggle-favorite'])
</script>

<template>
  <article class="country-card">
    <img class="country-flag" :src="country.flag" :alt="country.flagAlt" />

    <div class="card-content">
      <div class="card-header">
        <div>
          <h3>{{ country.name }}</h3>
          <p>{{ country.region }}</p>
        </div>

        <button
          type="button"
          class="favorite-button"
          :class="{ active: isFavorite }"
          :aria-pressed="isFavorite"
          @click.stop="$emit('toggle-favorite')"
        >
          {{ isFavorite ? '★' : '☆' }}
        </button>
      </div>

      <dl class="card-meta">
        <div>
          <dt>Hlavní město</dt>
          <dd>{{ country.capital }}</dd>
        </div>
        <div>
          <dt>Obyvatel</dt>
          <dd>{{ new Intl.NumberFormat('cs-CZ').format(country.population) }}</dd>
        </div>
      </dl>

      <button type="button" class="detail-button" @click="$emit('show-detail')">
        Zobrazit detail
      </button>
    </div>
  </article>
</template>
