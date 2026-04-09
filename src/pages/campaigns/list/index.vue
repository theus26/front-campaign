<template>
  <div class="campaigns-container">
    <h1>Campanhas</h1>
    <div class="campaigns-list">
      <div v-if="campaigns.length === 0" class="empty-state">
        <p>Nenhuma campanha encontrada</p>
      </div>
      <div v-for="campaign in campaigns" :key="campaign.id" class="campaign-card">
        <h2>{{ campaign.name }}</h2>
        <p>{{ campaign.description }}</p>
        <span class="status" :class="campaign.status">{{ campaign.status }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CampaignsList',
  data() {
    return {
      campaigns: [
        {
          id: 1,
          name: 'Campanha Summer',
          description: 'Promoção de verão',
          status: 'active'
        },
        {
          id: 2,
          name: 'Campanha Black Friday',
          description: 'Desconto especial',
          status: 'inactive'
        }
      ]
    }
  }
}
</script>

<style scoped>
.campaigns-container {
  padding: 20px;
}

.campaigns-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.campaign-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.active {
  background-color: #4caf50;
  color: white;
}

.status.inactive {
  background-color: #f44336;
  color: white;
}
</style>