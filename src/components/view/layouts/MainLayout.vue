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
          {{ $t('menu.title') }}
        </q-item-label>
        <essential-link v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        <confirm-slider-left
          :question='$t("modals.counter.delete.title")'
          v-for="(link, index) in counterLinks"
          :key="index"
          left-color="red"
          @success='() => onCounterDeleted(link.counter.id)'
        >
          <essential-link
            v-touch-hold:600.mouse="() => onCounterLinkHold(link.counter.id)"
            v-bind="link"
          >
            <q-item-label slot='pre' class='calendar'>
              <q-badge
                v-for='(timeout, index) in link.counter.timeouts'
                :key='index'
                :color='index % 2 ? "info" : "primary"'
              >
                {{ getTimeoutListShort(timeout) }}
              </q-badge>
            </q-item-label>
          </essential-link>
          <template v-slot:left>
            {{ $t('general.delete') }}
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
            {{ $t('menu.swipe-right') }}
          </q-item-section>
        </q-item>
        <q-item class='tip'>
          <q-item-section class="text-center text-grey">
            {{ $t('menu.hold') }}
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
import { Component, Vue } from 'vue-property-decorator'
import { Counter, Score, TimeoutList } from 'src/core/entities/counter'
import ConfirmSliderLeft from 'components/helpers/sliders/ConfirmSliderLeft.vue'
import { EventService } from 'src/core/services/EventService'
import {
  CounterCreatedEvent,
  CounterDeletedEvent,
  CounterUpdatedEvent,
  HistorySaveEvent
} from 'src/core/services/events'
import { CounterService } from 'src/core/services/CounterService'
import { InMemory } from 'src/utility/database/proxy/InMemory'

@Component({
  components: { ConfirmSliderLeft, EditCounter, CreateCounter, EssentialLink }
})
export default class MainLayout extends Vue {
  public leftDrawerOpen = false
  public counterLinks: Array<{ counter: Counter<Score> }> = []
  public counters: Array<Counter<Score>> = []
  public counter: Counter<Score>|null = null
  public hash = ''
  public date = new Date()
  public timer = 0

  get essentialLinks() {
    return [
      {
        title: this.$t('menu.history.title'),
        caption: this.$t('menu.history.caption'),
        icon: 'calendar_today',
        link: '/history'
      },
      {
        title: this.$t('menu.settings.title'),
        caption: this.$t('menu.settings.caption'),
        icon: 'settings',
        link: '/settings'
      },
      {
        title: this.$t('menu.statistics.title'),
        caption: this.$t('menu.statistics.caption'),
        icon: 'analytics',
        link: '/statistics'
      },
    ]
  }

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
    this.counters = await this.$orm.repository.counter.setProxy(new InMemory()).findAll()

    const links = []

    for (const counter of this.counters) {
      if (counter.enabled) {
        links.push(await this.createCounterLink(counter, this.date))
      }
    }

    this.counterLinks = links.filter((val) => val !== undefined)
  }

  async createCounterLink(counter: Counter<Score>, date: Date) {
    const history = await this.$orm.repository.history
      .setProxy(new InMemory(counter.id + date.toISOString()))
      .findByDateAndCounter(date, counter)
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
      counter
    }
  }

  getTimeoutListShort(timeout: TimeoutList): string {
    switch (timeout) {
      case TimeoutList.Monday:    return this.$t('general.calendar.short.monday').toString()
      case TimeoutList.Tuesday:   return this.$t('general.calendar.short.tuesday').toString()
      case TimeoutList.Wednesday: return this.$t('general.calendar.short.wednesday').toString()
      case TimeoutList.Thursday:  return this.$t('general.calendar.short.thursday').toString()
      case TimeoutList.Friday:    return this.$t('general.calendar.short.friday').toString()
      case TimeoutList.Saturday:  return this.$t('general.calendar.short.saturday').toString()
      case TimeoutList.Sunday:    return this.$t('general.calendar.short.sunday').toString()
      case TimeoutList.Monthly:   return this.$t('general.calendar.monthly').toString()
      case TimeoutList.Yearly:    return this.$t('general.calendar.yearly').toString()
    }
  }

  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="sass">
.body--dark
  div.sidebar-content
    background: #1e1e1e !important

.calendar
    .q-badge
      padding: 2px
      margin-right: 2px

.tip
  min-height: auto
</style>
