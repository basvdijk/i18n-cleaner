<template>
  <p>{{ t('generic.ok') }}</p>
  <p>{{ t('generic.yes') }}</p>
  <p>{{ t('test.label') }} {{ t('test.value') }}</p>

  <ListItem :label="t('user.name')" />

  <Card
    :welcome-text="
      t('welcome-text', {
        user: `${user.name}`,
      })
    "
  >
  </Card>

  <!-- Should not trigger a match -->
  <div>options.option1</div>
</template>

<script setup lang="ts">
const canGoBack = computed(() => route.path.split('/').length > 3);

alert(t('logout-warning'));
</script>

<style lang="scss" scoped></style>
