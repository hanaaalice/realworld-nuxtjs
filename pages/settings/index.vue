<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="updateMyProfile">
            <fieldset>
                <fieldset class="form-group">
                  <input class="form-control" type="text" placeholder="URL of profile picture" v-model="updateForm.image">
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="text" placeholder="Your Name" v-model="updateForm.username">
                </fieldset>
                <fieldset class="form-group">
                  <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you" v-model="updateForm.bio"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="text" placeholder="Email" v-model="updateForm.email">
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="password" placeholder="Password" v-model="updateForm.password">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { update } from '@/api/user' 
import { mapState } from  'vuex'

// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'authenticated',
  name: 'SettingsIndex',
  data() {
    return {
      updateForm: {
        image: '',
        username: '',
        password: '',
        email: '',
        bio: ''
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    this.updateForm = Object.assign(this.updateForm, this.user)
    console.log(this.user ,this.updateForm)
  },
  methods: {
    // 更新用户信息
    async updateMyProfile() {
      const { data } = await update(this.updateForm)
      console.log('更新用户信息 ====================', data)
      // TODO: 保存用户的登录状态
      this.$store.commit('setUser', data.user)
      Cookie.set('user', data.user)
    }
  }
}
</script>

<style>

</style>
