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
                        <span class="update-time">{{news.show}}</span>
                        <span class="icons">{{news.site}}</span>
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
    methods: {
        // 做一些数据处理，并赋值
        processData(data) {
            data.map(item => {
                let time = new Date(Number(item.ts) || Date.now())
                item.show = time.getFullYear() + '-' + time.getMonth() + '-'
                    + time.getDay() + ' ' + time.getHours() + ':'
                    + time.getMinutes()
            })
            this.newsList = data
        }
    },
    async created () {
        let me = this
        await axios('/api/news', {
            params: {}
        }).then(function (data) {
            if (data && data.data && data.data.data && data.data.data.news) {
                // 处理数据
                me.processData(data.data.data.news)
            }
        })
    }
}
</script>

<style scoped lang="styl">
  @require './Hello.styl'
</style>



