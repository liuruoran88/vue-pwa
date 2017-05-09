<template>
    <div class="news-detail">
        <h3>{{detail.title}}</h3>
        <div class="content">
            <div v-for="content in contents" class="news-item">
                <p>{{ content.data }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Detail',
    data () {
        return {
            detail: {},
            contents: []
        }
    },
    async created () {
        let me = this;
        await axios('/api/detail', {
            params: {}
        }).then(function (data) {
            console.log(data)
            if (data && data.data && data.data.data && data.data.data.news) {
                me.detail = data.data.data.news[0]
                me.contents = me.detail && me.detail.content
            }
        })
    }
}
</script>

<style scoped lang="styl">
    @require './Detail.styl'
</style>
