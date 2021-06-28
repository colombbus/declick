<template lang="pug">
.responsive-monitor(@mouseover='reversed = !reversed' :class='{reversed}')
  .size
</template>
<script>
export default {
  data() {
    return {
      reversed: false,
    }
  },
}
</script>

<style lang="scss">
@import '~@fortawesome/fontawesome-free/scss/variables';

.responsive-monitor {
  position: fixed;
  right: 1vh;
  bottom: 10%;
  box-sizing: border-box;
  display: flex;
  width: 8vh;
  height: 8vh;
  border: 0.15vh solid #000;
  border-radius: 0.5vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', Courier, monospace;
  font-size: 3vh;
  transition: background-color 0.5s ease, color 0.5s ease;
  &.reversed {
    right: auto;
    left: 1vh;
  }
  &::after {
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
  }
}
// DEFAULT BOOTSTRAP BREAKPOINTS
// --breakpoint-xs: 0;
// --breakpoint-sm: 576px;
// --breakpoint-md: 768px;
// --breakpoint-lg: 992px;
// --breakpoint-xl: 1200px;
.size {
  font-size: 2vh;
  text-shadow: 0 0 0.1vh black;

  &::before,
  &::after {
    position: absolute;
  }

  &::before {
    top: -3vh;
    right: 1vh;
  }
  &::after {
    bottom: -3vh;
    left: 1vh;
  }
}

@media (max-width: 575px) {
  .responsive-monitor {
    color: #ececec;
    background-color: rgba(#0125f3, 0.7);
    &::before {
      content: 'XS';
    }
    &::after {
      content: fa-content($fa-var-mobile-alt);
    }
    .size {
      &::before {
        content: '575';
      }
      &::after {
        content: '0';
      }
    }
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .responsive-monitor {
    color: #cdcdff;
    background-color: rgba(#030d92, 0.5);
    &::before {
      content: 'SM';
    }
    &::after {
      content: fa-content($fa-var-tablet-alt);
    }
    .size {
      &::before {
        content: '767';
      }
      &::after {
        content: '576';
      }
    }
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .responsive-monitor {
    color: #b1c0b1;
    background-color: rgba(#76ff06, 0.5);
    &::before {
      content: 'MD';
    }
    &::after {
      content: fa-content($fa-var-laptop);
    }
    .size {
      &::before {
        content: '991';
      }
      &::after {
        content: '768';
      }
    }
  }
}
@media (min-width: 992px) and (max-width: 1199px) {
  .responsive-monitor {
    color: #9fa39f;
    background-color: rgba(#c506ff, 0.5);
    &::before {
      content: 'LG';
    }
    &::after {
      content: fa-content($fa-var-laptop);
    }
    .size {
      &::before {
        content: '1199';
      }
      &::after {
        content: '992';
      }
    }
  }
}

@media (min-width: 1200px) {
  .responsive-monitor {
    color: #ffc2c2;
    background-color: rgba(#e51010, 0.5);
    &::before {
      content: 'XL';
    }
    &::after {
      content: fa-content($fa-var-desktop);
    }
    .size {
      &::before {
        content: '∞';
      }
      &::after {
        content: '1200';
      }
    }
  }
}
</style>
