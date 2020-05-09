import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import CmsDocument from '@/components/CmsDocument'
// import Administration from '@/components/Administration'
import Course from '@/components/learn/Course'
import CourseList from '@/components/learn/CourseList'
import BlockEditor from '@/components/block/BlockEditor'

import Progress from '@/components/learn/Progress'
import DeclickMap from '@/components/learn/DeclickMap'

import config from '@/config'

// import AdministrationCourseList from '@/components/administration/CourseList'
// import CourseEditor from '@/components/administration/CourseEditor'
// import UserList from "@/components/user/UserList";
import UserProfile from '@/components/user/UserProfile'
import UserEditor from '@/components/user/UserEditor'

// import courseRunfrom from '@/components/learn/CourseRun_new'

import HomePage from '@/components/HomePage.vue'
import ResourcesPage from '@/components/ResourcesPage.vue'
import Ide from '@/components/ide/Ide.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: {
      id: 4,
      title: 'Accueil',
    },
  },
  {
    path: '/ide',
    name: 'ide',
    component: Ide,
    meta: {
      useFullscreen: true,
    },
  },
  {
    path: '/users/:id',
    component: UserProfile,
    meta: {
      title: 'Utilisateurs',
      keepAlive: false,
    },
    props: true,
  },
  {
    path: '/users/:id/edit',
    component: UserEditor,
    meta: {
      title: 'Modification de profil utilisateur',
      keepAlive: false,
    },
    props: true,
  },
  {
    name: 'execute',
    path: '/execute/:projectId',
    meta: {
      useFullscreen: true,
    },
  },
  {
    path: '/explore',
    component: CmsDocument,
    meta: {
      id: 5,
      title: 'Découvrir',
    },
  },
  {
    path: '/progress',
    component: Progress,
    meta: {
      title: 'Progresser',
    },
    children: [
      {
        path: '',
        component: CourseList,
        meta: {
          title: 'Liste des parcours',
        },
      },
      {
        path: 'course/:id',
        component: Course,
        children: [
          {
            path: '',
            name: 'map',
            component: DeclickMap,
            meta: {
              title: 'Parcours',
            },
            // children: [
            //   {
            //     component: courseRunfrom,
            //     name: "step",
            //     path: "run/:assessmentId",
            //     meta: {
            //       title: "Étape",
            //       useFullscreen: true
            //     }
            //   }
            // ]
          },
        ],
      },
    ],
  },
  {
    path: '/create',
    name: 'create',
    meta: {
      title: 'Créer',
      useFullscreen: true,
    },
  },
  // {
  //   path: '/block',
  //   name: 'block',
  //   component: BlockEditor,
  // },
  {
    path: '/resources',
    component: ResourcesPage,
    meta: {
      title: 'Ressources',
    },
  },
  // {
  //   path: "/administration",
  //   component: Administration,
  //   meta: {
  //     title: "Administration"
  //   },
  //   children: [
  //     {
  //       path: "users",
  //       component: UserList,
  //       meta: {
  //         title: "Liste des utilisateurs"
  //       }
  //     },
  //     {
  //       path: "courses",
  //       component: AdministrationCourseList,
  //       meta: {
  //         title: "Liste des parcours"
  //       }
  //     },
  //     {
  //       path: "courses/:id",
  //       component: CourseEditor,
  //       meta: {
  //         title: "Modification de parcours"
  //       }
  //     }
  //   ]
  // }
]

export default new VueRouter({
  mode: 'history',
  routes,
  base: config.basePath,
})
