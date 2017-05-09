import Vue from 'vue'
import Router from 'vue-router'

// const Hello = resolve => {
//   require.ensure(['@/components/Hello'], () => {
//     resolve(require('@/components/Hello'))
//   })
// }
const Hello = resolve => require(['@/components/Hello'], resolve)
const Detail = resolve => require(['@/components/Detail'], resolve)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      name: 'home',
      component: Hello
    },
    {
      path: '/',
      name: 'home1',
      component: Hello
    },
    {
      path: '/hello',
      name: 'home2',
      component: Hello
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail
    }
  ]
})
