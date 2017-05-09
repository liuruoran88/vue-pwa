<template>
    <div id="app">
        <div id="header">
            <div class="top-bar"></div>
            <div class="top-nav">
                <ul>
                    <li @click="toggle(index ,tab.view)" v-for="(tab,index) in tabs" :class="{active:active===index}">
                          <a :href="'#/'+tab.view">{{tab.type}}</a>
                    </li>
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
        return {
            active: 0,
            currentView: 'hello',
            tabs: [
                {
                    type: 'tab1',
                    view: 'hello'
                },
                {
                    type: 'tab2',
                    view: 'detail'
                },
                {
                    type: 'tab3',
                    view: 'hello'
                },
                {
                    type: 'tab4',
                    view: 'detail'
                }
            ]
        };
    },
    methods: {
        toggle(i, v){
            this.active = i
            // this.currentView = v
        },
        tabHref() {
            this.tabs.map(item => {
                item.href = '#/' + item.view;
            })
        }
    },
    components: {
        'Hello': Hello,
        'Detail': Detail
    },
    ready() {
      // this.tabHref();
    }
}
</script>


<style lang="stylus">
  @require './main.styl'
</style>
