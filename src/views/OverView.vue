<template>
  <AppBanner>
    <div class="banner-content">
      <div class="content-title">
        <p>The Real-time State of</p>
        <h3>openEuler Community</h3>
      </div>
      <div class="content-grid">
        <IconText :icon="usersInfo.icon" style="grid-row: 1/3"></IconText>
        <IconText :icon="develoersInfo.icon" :title="develoersInfo.title" :amount="develoersInfo.amount"></IconText>
        <IconText :icon="sigsInfo.icon" :title="sigsInfo.title" :amount="sigsInfo.amount"></IconText>
        <IconText :icon="productsInfo.icon" :title="productsInfo.title" :amount="productsInfo.amount"></IconText>
        <IconText :icon="vendorsInfo.icon" :title="vendorsInfo.title" :amount="vendorsInfo.amount"></IconText>
      </div>
    </div>
  </AppBanner>
</template>

<script setup>
import { ref } from 'vue';
import AppBanner from '../components/AppBanner.vue';
import IconText from '../components/IconText.vue';

const usersInfo = ref({ icon: 'temp', title: 'Developers', amount: 404000 });
const develoersInfo = ref({ icon: 'temp', title: 'Developers', amount: 84000 });
const sigsInfo = ref({ icon: 'temp', title: 'SIGs', amount: 95 });
const productsInfo = ref({ icon: 'temp', title: 'Products', amount: 8744 });
const vendorsInfo = ref({ icon: 'temp', title: 'OS Vendors', amount: 11 });
</script>

<style lang="scss" scoped>
.banner-content {
  padding: 30px 0 80px 0px;
  color: #ffffff;

  .content-title {
    margin-bottom: 30px;
    color: #ffffff;
    p {
      font-size: 18px;
    }
    h3 {
      font-size: 30px;
      font-weight: bold;
      margin-top: 10px;
    }
  }

  .content-grid {
    display: grid;
    grid-template-columns: 250px 250px;
    row-gap: 10px;
    column-gap: 10px;
  }
}
</style>
