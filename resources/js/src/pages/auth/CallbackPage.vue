
  
  
  <script lang="ts" setup>
  
  import { onMounted } from 'vue'
  import { useRoute } from 'vue-router'
import { App } from '../../app/app';
import { setUserData } from '../../helper/auth';
  
  const route = useRoute()
  
  function redirectToLaravel() {
    const code = route.query?.code as string
    const state = route.query?.state as string
  
    setUserData({
      authorizationCode: code,
      state: state
    })
  
    window.location.href = App.baseUrl + `/callback?code=${code}&state=${state}`
  }
  
  onMounted(() => {
    redirectToLaravel()
  })
  </script>
  <template>
    <div>callback</div>
  </template>