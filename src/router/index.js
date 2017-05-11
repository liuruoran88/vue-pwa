import Vue from 'vue'
import Router from 'vue-router'
import Hello from '../components/Hello.vue'
import Detail from '../components/Detail.vue'

// 懒加载的两种方式，后期app-shell分离用，但是require不符合ES6的规范，目前没有符合的写法
// const Hello = resolve => {
//     require.ensure(['@/components/Hello'], () => {
//         resolve(require('@/components/Hello'))
//     })
// }
// const Detail = resolve => require(['@/components/Detail'], resolve)

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Hello
        }
        {
            path: '/detail',
            name: 'Detail',
            component: Detail
        }
    ]
})
