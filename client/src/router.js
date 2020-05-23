import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import CmsDocument from '@/components/CmsDocument'
// import Administration from '@/components/Administration'
import Course from '@/components/learn/Course'
import CourseList from '@/components/learn/CourseList'
import BlockEditor from '@/components/block/BlockEditor'
import CreateView from '@/components/create/CreateView'

import Progress from '@/components/learn/Progress'
import DeclickMap from '@/components/learn/DeclickMap'

import config from '@/config'

// import AdministrationCourseList from '@/components/administration/CourseList'
// import CourseEditor from '@/components/administration/CourseEditor'
// import UserList from "@/components/user/UserList";
// import UserProfile from '@/components/user/UserProfile'
// import UserEditor from '@/components/user/UserEditor'
import UserShow from '@/components/user/UserShow'
import UserEdit from '@/components/user/UserEdit'

import ProjectsShow from '@/components/project/ProjectsShow'
import ProjectShow from '@/components/project/ProjectShow'
import ProjectNew from '@/components/project/ProjectNew'

// import courseRunfrom from '@/components/learn/CourseRun_new'

import HomePage from '@/components/HomePage.vue'
import ResourcesPage from '@/components/ResourcesPage.vue'

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
  // {
  //   path: '/ide',
  //   name: 'ide',
  //   component: Ide,
  //   meta: {
  //     useFullscreen: true,
  //   },
  // },
  {
    path: '/users/:id',
    component: UserShow,
    meta: {
      title: 'Utilisateurs',
      keepAlive: false,
    },
    props: true,
  },
  {
    path: '/users/:id/edit',
    component: UserEdit,
    meta: {
      title: 'Modification de profil utilisateur',
      keepAlive: false,
    },
    props: true,
  },
  {
    name: 'Create View',
    path: '/create',
    component: CreateView,
    meta: {
      useFullscreen: true,
      menuLess: true,
    },
  },
  // {
  //   name: 'Projects list',
  //   path: '/users/:id/projects',
  //   component: ProjectsShow,
  //   meta: {
  //     title: 'Projects list',
  //   },
  // },
  // {
  //   path: '/users/:id/projects/new',
  //   component: ProjectNew,
  //   meta: {
  //     title: 'new project',
  //   },
  // },
  // {
  //   path: '/users/:id/projects/:pid',
  //   component: ProjectShow,
  //   meta: {
  //     title: 'Project show',
  //   },
  // },
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
