<template>
  <q-layout view="lHh Lpr lFf" v-touch-swipe.mouse.right="() => this.leftDrawerOpen = true">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <div class="col"></div>
        <div class="col-auto">
          <template v-if="this.$route.params.date">
            {{ new Date(this.$route.params.date).toDateString() }}
          </template>
          <template v-else>
            {{ date.toDateString() }}
          </template>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="sidebar-content"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Navigation menu
        </q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link"/>
        <q-slide-item v-for="link in counterLinksSync" :key="link.title" left-color="red" @left="onCounterDelete(link.hash)">
          <EssentialLink v-bind="link" />
          <template v-slot:left>
            Delete
            <q-icon name="delete" />
          </template>
        </q-slide-item>
        <q-item>
          <q-item-section>
            <create-counter @success="counterCreated" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-center text-grey">
            Swipe right to delete
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/helpers/EssentialLink.vue'
import { Component, Vue } from 'vue-property-decorator'
import { Hash } from 'src/store/persistent/state'
import { Counter } from 'src/store/persistent/counters-models'
import CreateCounter from 'components/modals/CreateCounter.vue'
import {counterCreatedEvent, counterDeletedEvent} from 'src/core/events/counter'

@Component({
  components: { CreateCounter, EssentialLink }
})
export default class MainLayout extends Vue {
  public leftDrawerOpen = false;
  public essentialLinks = [
    {
      title: 'History',
      caption: 'Check by day',
      icon: 'calendar_today',
      link: '/history'
    },
    {
      title: 'Settings',
      caption: 'Change application preferences',
      icon: 'settings',
      link: '/settings'
    },
  ];
  public counterLinks: Array<{ hash: string }> = [];
  public counters: Record<Hash, Counter> = {};
  public date = new Date();
  public timer = 0;

  mounted() {
    this.loadUserCounters()
    this.timer = window.setInterval(() => this.date = new Date(), 1000)
  }

  public async counterCreated(counter: Counter) {
    await counterCreatedEvent(this.$store, counter).then(() => this.loadUserCounters())
  }

  public async onCounterDelete(hash: Hash) {
    await counterDeletedEvent(this.$store, hash).then(() => this.loadUserCounters())
  }

  public loadUserCounters() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    this.counters = this.$store.getters['persistent/userCounters']
  }

  public get counterLinksSync() {
    this.counterLinks = []

    for (let hash in this.counters) {
      this.counterLinks.push(this.createCounterLink(this.counters[hash], hash, this.date))
    }

    return this.counterLinks
  }

  public createCounterLink(counter: Counter, hash: Hash, date: Date) {
    return {
      title: counter.name,
      caption: counter.description,
      icon: counter.icon,
      link: `/counter/${hash}/${date.toDateString()}`,
      hash
    }
  }

  public beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="sass">
.body--dark
  div.sidebar-content
    background: #1e1e1e !important
</style>
