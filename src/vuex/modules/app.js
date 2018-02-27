import Cookies from 'js-cookie';
import {
  mainRoutes,
  pagesRoutes
} from '../../router/router.js'

const app = {
  state: {
    sidebar: {
      // opened: !+Cookies.get('sidebarStatus')
      opened:true
    },
    addRouters: pagesRoutes,
    userInfo: localStorage.userInfo ? JSON.parse(localStorage.userInfo) : null
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1, {
          expires: 7
        });
      } else {
        Cookies.set('sidebarStatus', 0, {
          expires: 7
        });
      }
      state.sidebar.opened = !state.sidebar.opened;
    }
  },
  actions: {
    ToggleSideBar: ({
      commit
    }) => {
      commit('TOGGLE_SIDEBAR')
    }
  }
};

export default app;
