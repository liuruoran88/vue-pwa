<template>
    <div class="news-wrapper">
        <div class="top-banner"></div>
        <div class="news-list">
            <div v-for="news in newsList" class="news-item">
                <a href="#/detail">
                    <h3>{{news.title}}</h3>
                    <div class="posts" v-if="news.imageurls.length">
                        <span v-for="imgUrl in news.imageurls">
                            <img :src="imgUrl.url" alt="">
                        </span>
                    </div>
                    <div class="some-icons">
                        <span class="update-time">刚刚</span>
                        <span class="icons">热点</span>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Hello',
    data () {
        return {
            newsList: []
        }
    },
    // methods: {
    //     processData(data) {
    //         return data
    //     }
    // },
    async created () {
        let me = this
        await axios('/api/news', {
            params: {}
        }).then(function (data) {
            if (data && data.data && data.data.data && data.data.data.news) {
                me.newsList = data.data.data.news
                // me.newsList = me.processData(data.data.data.news)
            }
        })
    }
}
</script>

<style scoped lang="styl">
  @require './Hello.styl'
</style>



