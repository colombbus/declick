<template lang="pug">
.vertical-bar
  .item-container
    span.item
      |A
    span.item
      |B
    span.item
      |C
    span.item
      |D
    span.item
      |E
</template>

<script>
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'

export default {}
</script>
<style lang="scss">
.vertical-bar {
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--main-dark-variant-color);
    z-index: -1;
  }
  position: relative;
  width: 1%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .item-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    .item {
      &:hover {
        background-color: #480a2a88;
        padding: 10px;
        margin: 0;
        font-size: 1.5em;
      }
      display: flex;
      align-items: center;
      justify-content: center;
      width: 15px;
      height: 15px;
      margin: 10px 0;
      border-radius: 100%;
      background-color: #350da35d;
      color: white;
      font-size: 1em;
    }
  }
}
</style>
