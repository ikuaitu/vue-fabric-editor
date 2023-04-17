<template>
  <span>
    <svg
      t="1650443094178"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="1549"
      :width="size"
      :height="size"
      :fill="color"
    >
      <!--  -->
      <template v-if="name === 'default'">
        <path
          d="M252.76928 299.904l146.2784 0 0 472.42752-146.2784 0 0-472.42752Z"
          p-id="1550"
        ></path>
        <path
          d="M477.48096 85.34528l70.87104 0 0 885.80608-70.87104 0 0-885.80608Z"
          p-id="1551"
        ></path>
        <path
          d="M629.80096 284.8l31.0016 0 0 502.88128-31.0016 0L629.80096 284.8zM776.42752 284.8l31.0016 0 0 502.88128-31.0016 0L776.42752 284.8zM657.09056 315.8016l0-31.0016 123.04896 0 0 31.0016L657.09056 315.8016zM657.27488 787.64544l0-31.0016 123.04896 0 0 31.0016L657.27488 787.64544z"
          p-id="1552"
        ></path>
      </template>
      <!-- up -->
      <template v-if="name === 'up'">
        <path
          d="M876.2 434.3L536.7 94.9c-6.6-6.6-15.5-10.3-24.7-10.3-9.3 0-18.2 3.7-24.7 10.3L147.8 434.3c-13.7 13.7-13.7 35.8 0 49.5 13.7 13.7 35.8 13.7 49.5 0L477 204.1v700.2c0 19.3 15.7 35 35 35s35-15.7 35-35V204.1l279.7 279.7c6.8 6.8 15.8 10.3 24.7 10.3s17.9-3.4 24.7-10.3c13.7-13.7 13.7-35.8 0.1-49.5z"
          p-id="1800"
        ></path>
      </template>
    </svg>
  </span>
</template>

<script>
export default {
  name: 'svgIcon',
  props: {
    name: {
      type: String,
      default: 'default',
    },
    color: {
      type: String,
      default: '#ea9518',
    },
    size: {
      type: Number,
      default: 14,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="less"></style>
