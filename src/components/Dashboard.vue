<template>
  <div>
    <h2>Dashboard</h2>
    <p>Yay you made it <b>{{name}}</b>!</p>
  </div>
</template>
<script>
  import auth from '../auth'
  export default {
    data () {
      return {
        name: auth.getName()
      }
    }
  }
</script>
