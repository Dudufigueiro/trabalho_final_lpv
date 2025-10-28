<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-drawer
      v-model="drawer"
      show-if-above
      bordered
      :width="240"
      class="menu-drawer"
      content-class="menu-drawer-content"
    >
      <div class="column full-height">
        <div class="menu-header">
          <div class="brand" v-if="drawer">
            <q-icon name="hexagon" size="26px" color="white" />
            <span class="brand-text">Tracer</span>
          </div>

          <q-btn
            flat dense round color="white"
            :icon="drawer ? 'menu_open' : 'menu'"
            @click="toggleDrawer"
          />
        </div>

        <q-scroll-area class="fit">
          <q-list class="menu-list">
            <q-item
              v-for="item in menuItems"
              :key="item.to"
              clickable
              v-ripple
              :to="item.to"
              active-class="active-item"
              class="menu-item"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" size="22px" class="menu-icon" />
              </q-item-section>

              <q-item-section v-if="drawer" class="item-text">
                {{ item.label }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>
    </q-drawer>

    <div v-show="!drawer" class="menu-mini column items-center">
      <q-btn
        flat dense round color="white"
        icon="menu"
        @click="toggleDrawer"
        class="menu-btn q-mt-md"
      />
      <div class="menu-icons q-mt-md">
        <q-btn
          v-for="item in menuItems"
          :key="item.to"
          flat dense round color="white"
          :icon="item.icon"
          @click="$router.push(item.to)"
          class="q-mb-sm"
        >
          <q-tooltip>{{ item.label }}</q-tooltip>
        </q-btn>
      </div>
    </div>

    <q-page-container :class="{'content-offset': !drawer}">
      <div class="q-pa-md">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(true)
const toggleDrawer = () => { drawer.value = !drawer.value }

const menuItems = [
  { label: 'Início',   icon: 'home',     to: '/app/home' },
  { label: 'Clientes', icon: 'groups',       to: '/clientes' },
  { label: 'Produtos', icon: 'inventory_2',  to: '/produtos' },
  { label: 'Vendas',   icon: 'attach_money', to: '/vendas' },
]
</script>

<style scoped>

.menu-drawer {
  transition: all 0.25s ease;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

:deep(.q-drawer) {
  background-color: #21ba45 !important;
  color: #ffffff !important;
}

:deep(.q-drawer__content) {
  background-color: #21ba45 !important;
  color: #ffffff !important;
}

:deep(.q-drawer--bordered) {
  border-right: none !important;
}

.menu-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-text {
  font-weight: 600;
  font-size: 16px;
  color: #fff;
}

.q-separator {
  margin: 0 16px;
  background-color: rgba(255, 255, 255, 0.35);
}

.q-scroll-area {
  flex-grow: 1;
  margin-top: 12px;
}

.menu-list {
  padding-left: 12px;
}

.menu-item {
  border-radius: 8px;
  margin: 4px 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  transition: background 0.2s;
  color: #fff;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.12);
}

.active-item {
  background: rgba(255, 255, 255, 0.22) !important;
}

.menu-icon { 
  color: #fff; 
}

.item-text { 
  font-weight: 500; color: #fff; 
}

.menu-mini {
  position: fixed;
  top: 0;
  left: 0;
  width: 72px;
  height: 100vh;
  background-color: #21ba45;
  box-shadow: 2px 0 6px rgba(0,0,0,0.2);
  z-index: 10;
  transition: all 0.25s ease;
}

.menu-btn { 
  margin-top: 12px; margin-bottom: 12px; 
}

.menu-icons {
  display: flex; flex-direction: column; align-items: center;
  gap: 14px; padding-top: 8px;
}

.menu-icons .q-btn { 
  width: 40px; height: 40px; color: #fff; 
}

.q-page-container { 
  transition: margin-left 0.3s ease; 
}

.content-offset { 
  margin-left: 72px; 
}

.column.full-height { 
  flex-wrap: nowrap !important; 
}
</style>