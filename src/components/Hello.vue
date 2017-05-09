<template>
    <div class="news-wrapper">
        <div class="top-banner"></div>
        <div class="news-list">
            <div v-for="news in newsList" class="news-item">
                <a href="#detail">{{news.title}}</a>
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
    async created () {
        let me = this
        await axios('/api/news', {
            params: {}
        }).then(function (data) {
            if (data && data.data && data.data.data && data.data.data.news) {

                me.newsList = data.data.data.news
            }
        })
    }
}
</script>

<style scoped lang="styl">
  @require './Hello.styl'
</style>



