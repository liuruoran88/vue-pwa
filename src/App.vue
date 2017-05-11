<template>
    <div id="app">
        <div id="header">
            <div class="top-bar"></div>
            <div class="top-nav">
                <ul>
                    <router-link tag="li" to="/" exact><a>热点1</a></router-link>
                    <router-link tag="li" to="/detail" exact><a>热点2</a></router-link>
                </ul>
            </div>
        </div>

        <div class="app-content">
            <transition name="display" node="out-in">
                <router-view class="content-view"></router-view>
            </transition>
        </div>

        <div id="footer"></div>

        <div id="loading"><img src="" alt=""></div>
    </div>
</template>

<script>
const Hello = resolve => require(['@/components/Hello'], resolve)
const Detail = resolve => require(['@/components/Detail'], resolve)

export default {
    name: 'app',
    data() {
        return {}
    },
    components: {
        'Hello': Hello,
        'Detail': Detail
    },
    ready() {
    }
}
</script>


<style lang="stylus">
    @require './main.styl'
</style>
