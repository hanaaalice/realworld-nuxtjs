<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="userProfile.image" class="user-img" />
            <h4>{{userProfile.username}}</h4>
            <p>
              {{userProfile.bio || ''}}
            </p>
            <button v-if="!isMe" class="btn btn-sm btn-outline-secondary action-btn" @click="changeFollowStatus(userProfile.username, userProfile.following)" :disabled="isChangingFollow">
              <i class="ion-plus-round"></i>
              &nbsp;
              {{userProfile.following ? 'Unfollow' : 'Follow'}} {{userProfile.username}}
            </button>
            <nuxt-link v-else :to="{name: 'settings'}">
              <button class="btn btn-sm btn-outline-secondary action-btn">
                <i class="ion-gear-a"></i>
                &nbsp;
                Edit Profile Settings
              </button>
            </nuxt-link>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" @click="showMyArticles = true">
                <a class="nav-link" :class="{ active: showMyArticles }">My Articles</a>
              </li>
              <li class="nav-item" @click="showMyArticles = false">
                <a class="nav-link" :class="{ active: !showMyArticles }">Favorited Articles</a>
              </li>
            </ul>
          </div>

          <div v-show="showMyArticles" class="article-preview" v-for="(article, index) in myArticles" :key="index">
            <div class="article-meta">
              <nuxt-link :to="{name: 'profile', params: { username: article.author.name }}">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link class="author" :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }">
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.updatedAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right" :class="{ active: article.favorited }" :disabled="article.favoriteDisabled" @click="onFavorite(article)">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <div v-show="!showMyArticles" class="article-preview" v-for="(article, index) in favoritedArticles" :key="index">
            <div class="article-meta">
              <nuxt-link :to="{name: 'profile', params: { username: article.author.name }}">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link class="author" :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }">
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.updatedAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right"  :class="{ active: article.favorited }" :disabled="article.favoriteDisabled" @click="onFavorite(article)">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUser, getProfile, follow, unfollow } from '@/api/user'
import { getArticles, addFavorite, deleteFavorite } from '@/api/article'
 
export default {
  middleware: 'authenticated',
  name: 'UserProfile',
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      isMe: false, // 是否是本人
      userProfile: {}, // 用户文件
      isChangingFollow: false, // 是否在修改关注状态
      myArticles: [], // 我的文章
      favoritedArticles: [], // 喜欢的文章
      showMyArticles: true, // 显示我的文章
    }
  },
  watch:{
    $route(to,from){
      const username = decodeURIComponent(to.params.username)
      this.isMe = username === this.user.username
      this.getUserInfo(username)
      this.getUserArticles(username)
    }
  },
  mounted() {
    const username = decodeURIComponent(this.$route.params.username)
    this.isMe = username === this.user.username
    this.getUserInfo(username)
    this.getUserArticles(username)
  },

  methods: {
    async getUserInfo(username) {
      const { data } = await getProfile({ username })
      this.userProfile = data.profile
    },
    async changeFollowStatus(username, following) {
      this.isChangingFollow = true
      if (following) {
        // 取消关注该用户
        await unfollow({ username })
        this.userProfile.following = false
      } else {
        // 关注该用户
        await follow({ username })
        this.userProfile.following = true
      }
      this.isChangingFollow = false
    },
    async getUserArticles(username) {
      const { data: my } = await getArticles({ author: username })
      this.myArticles = my.articles || []
      const { data: favorited } = await getArticles({ favorited: username })
      this.favoritedArticles = favorited.articles || []
    },
    async onFavorite (article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  }
}
</script>

<style>

</style>
