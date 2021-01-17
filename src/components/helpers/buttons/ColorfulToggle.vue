<template>
  <div ref='bg' class='toggle-bg full-width'>
    <div class="toggle">
      <input
        ref="toggle"
        v-model='checked'
        type="checkbox"
        id="toggle"
      />
      <label for="toggle"></label>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, ModelSync, Ref, Watch } from 'vue-property-decorator'

@Component
export default class ColorfulToggle extends Vue {
  @ModelSync('value', 'input', { type: Boolean })
  public checked!: string;

  @Ref('toggle')
  public readonly toggle!: HTMLInputElement

  @Ref('bg')
  public readonly bg!: HTMLDivElement

  mounted() {
    if (this.checked && !this.bg.classList.contains('on')) {
      this.bg.classList.add('on')
    } else {
      this.bg.classList.remove('on')
    }
  }

  @Watch('checked')
  onChange() {
    this.bg.classList.toggle('on')
  }
}
</script>

<style lang='scss' scoped>
*, :after, :before {
  box-sizing: border-box;
}

.toggle-bg {
  text-align: center;
  background-color: #ff9295;
  transition: background-color 0.2s cubic-bezier(0, -1.85, .27, 1.75);
}

.toggle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);

  &:before {
    content: 'OFF';
    position: absolute;
    left: -56px;
    top: 30px;
    font-size: 18px;
    color: #fff;
  }

  &:after {
    content: 'ON';
    position: absolute;
    right: -46px;
    top: 30px;
    font-size: 18px;
    color: rgba(253, 15, 21, 0.31);
  }

  label {
    position: relative;
    display: inline-block;
    width: 80px;
    height: 80px;
    background-color: #FD1015;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: inset 0 0 2px 1px rgba(0, 0, 0, 0.1), 0 9px 15px 0 #ef4247;
    -webkit-tap-highlight-color: transparent;

    &:before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition:width 0.2s cubic-bezier(0, -1.85, .27, 1.75);
      height: 42px;
      width: 42px;
      background-color: #fd0f14;
      border-radius: 46px;
      box-shadow: inset 0 0 0 8px #fff;
    }
  }

  input {
    display: none;

    &:checked + label {
      background-color: #57de72;
      box-shadow:  inset 0 0 2px 1px rgba(0, 0, 0, 0.1), 0 9px 15px 0 rgba(3, 132, 28, 0.5411764705882353);

      &:before {
        width: 10px;
        background-color: #fff;
      }
    }
  }
}

.on{
  background-color: #6fc57c;

  .toggle {
    &:before{
      color: rgba(62, 160, 81, 0.89);
    }

    &:after{
      color: #fff;
    }
  }
}
</style>
