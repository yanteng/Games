import VueRouter from 'vue-router'
import Tetris from "./views/tetris/index.vue"
import Home from './views/home'
import Snake from './views/snake'

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/tetris',
      component: Tetris,
    },
    {
      path: '/snake',
      component: Snake,
    }
  ]
})
