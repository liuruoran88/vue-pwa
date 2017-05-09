import Vue from 'vue'
import Router from 'vue-router'
import Hello from '../components/Hello.vue'
import Detail from '../components/Detail.vue'

// const Hello = resolve => {
//     require.ensure(['@/components/Hello'], () => {
//         resolve(require('@/components/Hello'))
//     })
// }
// const Hello = resolve => require(['@/components/Hello'], resolve)
// const Detail = resolve => require(['@/components/Detail'], resolve)

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/(hello)?',
            name: 'Home',
            component: Hello
        },
        {
            path: '/detail',
            name: 'Detail',
            component: Detail
        }
    ]
})
