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
        <essential-link v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        <confirm-slider-left
          question='Are you sure you want to delete this counter?'
          v-for="link in counterLinks"
          :key="link.title"
          left-color="red"
          @success='() => onCounterDeleted(link.hash)'
        >
          <essential-link
            v-touch-hold:600.mouse="() => onCounterLinkHold(link.hash)"
            v-bind="link"
          />
          <template v-slot:left>
            Delete
            <q-icon name="delete" />
          </template>
        </confirm-slider-left>
        <q-item>
          <q-item-section>
            <create-counter @success="counterCreated" :key='counterLinks.length' />
          </q-item-section>
        </q-item>
        <q-item class='tip'>
          <q-item-section class="text-center text-grey">
            Swipe right to delete
          </q-item-section>
        </q-item>
        <q-item class='tip'>
          <q-item-section class="text-center text-grey">
            Hold to edit
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class='overflow-hidden-x items-stretch'>
      <router-view class='full-width' :key="$route.fullPath" />
    </q-page-container>

    <edit-counter
      v-if='counter !== null'
      :counter='counter'
      @success='onCounterEdited'
      @cancel='() => counter = null'
    />
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/helpers/EssentialLink.vue'
import CreateCounter from 'components/modals/counter/CreateCounter.vue'
import EditCounter from 'components/modals/counter/EditCounter.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Counter, Score } from 'src/core/entities/counter'
import ConfirmSliderLeft from 'components/helpers/sliders/ConfirmSliderLeft.vue'
import links from './links'
import { EventService } from 'src/core/services/EventService'
import {
  CounterCreatedEvent,
  CounterDeletedEvent,
  CounterUpdatedEvent,
  HistorySaveEvent
} from 'src/core/services/events'
import { CounterService } from 'src/core/services/CounterService'

@Component({
  components: { ConfirmSliderLeft, EditCounter, CreateCounter, EssentialLink }
})
export default class MainLayout extends Vue {
  public leftDrawerOpen = false
  public essentialLinks = links
  public counterLinks: Array<{ hash: string }> = []
  public counters: Array<Counter<Score>> = []
  public counter: Counter<Score>|null = null
  public hash = ''
  public date = new Date()
  public timer = 0

  async mounted() {
    await this.loadUserCounters()

    this.timer = window.setInterval(() => {
      this.date = new Date()
      void this.loadUserCounters()
    }, 500)
  }

  async counterCreated(counter: Counter<Score>) {
    await this.$container
      .resolve(EventService)
      .dispatch(new CounterCreatedEvent(counter))
      .then(() => this.loadUserCounters())
  }

  async onCounterDeleted(hash: string) {
    const counter = this.counters.find((counter) => counter.id === hash)

    if (!counter) {
      console.error('No counter to delete found')

      return
    }

    await this.$container
      .resolve(EventService)
      .dispatch(new CounterDeletedEvent(counter))
      .then(() => this.loadUserCounters())
  }

  async onCounterEdited(counter: Counter<Score>) {
    await this.$container
      .resolve(EventService)
      .dispatchAll(new CounterUpdatedEvent(counter), new HistorySaveEvent(counter, new Date()))
      .then(() => this.loadUserCounters())
      .then(() => this.counter = null)
      .then(() => this.$router.push('/').catch(() => console.log('Already on /history')))
  }

  async onCounterLinkHold(hash: string) {
    this.hash = hash
    this.counter = await this.$orm.repository.counter.find(hash)
  }

  async loadUserCounters() {
    this.counters = await this.$orm.repository.counter.findAll()
  }

  @Watch('counters', {deep: true, immediate: true})
  async syncCounterLinks(counters: Array<Counter<Score>>) {
    const links = []

    for (const counter of counters) {
      if (counter.enabled) {
        links.push(await this.createCounterLink(counter, this.date))
      }
    }

    this.counterLinks = links.filter((val) => val !== undefined)
  }

  async createCounterLink(counter: Counter<Score>, date: Date) {
    const history = await this.$orm.repository.history.findByDateAndCounter(date, counter)
    const succeed = this.$container.resolve(CounterService).isSucceed(history ? history.getCounter() : counter)

    return {
      title: counter.name,
      caption: counter.description,
      icon: counter.icon,
      link: `/counter/${date.toISOString()}/${counter.id}`,
      class: {
        'bg-green-transparent': succeed,
        'bg-red-transparent': !succeed,
      },
      hash: counter.id
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

.tip
  min-height: auto
</style>
