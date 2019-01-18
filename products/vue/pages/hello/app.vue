<template>
  <div>
    <h1>Vue</h1>
    <h1>hello {{user.userName}}</h1>
    <h2>{{user.userId}}</h2>
  </div>
</template>

<script>
import request from '../../lib/request';
import { testModule } from '../../service';
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      user: {}
    };
  },
  mounted() {
    request(testModule.getUser, {}).then((data) => {
      console.log(data)
      if (data.data) {
        this.user = data.data;
      }
    });
    console.log('mounted');
  }
}
</script>

<style>
</style>
