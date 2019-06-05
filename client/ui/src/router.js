import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import CmsDocument from 'components/CmsDocument'
import Administration from 'components/Administration'
import Course from 'components/learn/Course'
import CourseList from 'components/learn/CourseList'
import Progress from 'components/learn/Progress'
import DeclickMap from 'components/learn/DeclickMap'

import config from 'assets/config/declick'

import AdministrationCourseList from 'components/administration/CourseList'
import CourseEditor from 'components/administration/CourseEditor'
import UserList from 'components/user/UserList'
import UserProfile from 'components/user/UserProfile'
import UserEditor from 'components/user/UserEditor'

import HomePage from 'components/HomePage'

import MapDraw from 'components/map-generator/MapDrawer'
import page404 from 'components/page404'

var routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: {
      id: 4,
      title: 'Accueil'
    }
  },
  {
    path: '/users/:id',
    component: UserProfile,
    meta: {
      title: 'Utilisateurs',
      keepAlive: false
    },
    props: true
  },
  {
    path: '/users/:id/edit',
    component: UserEditor,
    meta: {
      title: 'Modification de profil utilisateur',
      keepAlive: false
    },
    props: true
  },
  {
    name: 'execute',
    path: '/execute/:projectId',
    meta: {
      useFullscreen: true
    }
  },
  {
    path: '/explore',
    component: CmsDocument,
    meta: {
      id: 5,
      title: 'Découvrir'
    }
  },
  {
    path: '/progress',
    component: Progress,
    meta: { title: 'Progresser' },
    children: [
      {
        path: '',
        component: CourseList,
        meta: { title: 'Liste des parcours' }
      },
      {
        path: 'course/:id',
        component: Course,
        children: [
          {
            path: '',
            name: 'map',
            component: DeclickMap,
            meta: { title: 'Parcours' },
            children: [
              {
                name: 'step',
                path: 'run/:assessmentId',
                meta: {
                  title: 'Étape',
                  useFullscreen: true
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/create',
    name: 'create',
    meta: {
      title: 'Créer',
      useFullscreen: true
    }
  },
  {
    path: '/draw',
    name: 'draw',
    component: MapDraw,
    meta: {
      useFullscreen: true,
      title: 'Créé tes niveaux'
    }
  },
  {
    path: '*',
    name: 'error',
    component: page404
  }
];

export default new VueRouter({
  mode: 'history',
  routes,
  base: config.basePath
})
