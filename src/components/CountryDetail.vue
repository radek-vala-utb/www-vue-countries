<script setup>
const props = defineProps({
  country: {
    type: Object,
    default: null,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close', 'toggle-favorite'])

const formatList = (items) => {
  if (!items?.length) {
    return 'Neuvedeno'
  }

  return items.join(', ')
}
</script>

<template>
  <teleport to="body">
    <div v-if="props.country" class="detail-backdrop" @click.self="$emit('close')">
      <section class="detail-modal">
        <button type="button" class="close-button" @click="$emit('close')">×</button>

        <img class="detail-flag" :src="props.country.flag" :alt="props.country.flagAlt" />

        <div class="detail-content">
          <div class="detail-header">
            <div>
              <p class="eyebrow">Detail státu</p>
              <h2>{{ props.country.name }}</h2>
            </div>

            <button
              type="button"
              class="favorite-button detail-favorite"
              :class="{ active: isFavorite }"
              :aria-pressed="isFavorite"
              @click="$emit('toggle-favorite')"
            >
              {{ isFavorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených' }}
            </button>
          </div>

          <dl class="detail-grid">
            <div>
              <dt>Hlavní město</dt>
              <dd>{{ props.country.capital }}</dd>
            </div>
            <div>
              <dt>Region</dt>
              <dd>{{ props.country.region }}</dd>
            </div>
            <div>
              <dt>Počet obyvatel</dt>
              <dd>{{ new Intl.NumberFormat('cs-CZ').format(props.country.population) }}</dd>
            </div>
            <div>
              <dt>Měna</dt>
              <dd>{{ formatList(props.country.currencies) }}</dd>
            </div>
            <div>
              <dt>Jazyk</dt>
              <dd>{{ formatList(props.country.languages) }}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  </teleport>
</template>
