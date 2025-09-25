<template>
  <section class="section-card">
    <header class="section-header" v-if="$slots.header">
      <slot name="header"></slot>
    </header>
    <main class="section-main">
      <slot></slot>
    </main>
  </section>
</template>
<style lang="scss" scoped>
.section-card {
  background: #ffffff;
  border-radius: 4px;
  padding: 32px;
  .section-header {
    margin-bottom: 32px;
    font-weight: 500;
    font-size: 32px;
    line-height: 44px;
  }
}
.section-main {
  min-height: 100px;
}
</style>