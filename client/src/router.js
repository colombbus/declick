import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import CmsDocument from '@/components/CmsDocument'
// import Administration from '@/components/Administration'
import Course from '@/components/learn/Course'
import CourseList from '@/components/learn/CourseList'

import CreateView from '@/components/create/CreateView'
// import CreateView2 from '@/components/create2/CreateView2'
// import ProjectList from '@/components/create2/ProjectList'
// import ProjectCreator from '@/components/create2/ProjectCreator'
// import ProjectShow from '@/components/create2/ProjectShow'
// import ProjectEdit from '@/components/create2/ProjectEdit'
// import ProjectImport from '@/components/create2/ProjectImport'
import ProjectList from '@/components/create/ProjectList'
import ProjectCreator from '@/components/create/ProjectCreator'
import ProjectDetails from '@/components/create/ProjectDetails'
import ProjectEditor from '@/components/create/ProjectEditor'
import ProjectImport from '@/components/create/ProjectImport'

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
  {
    path: '/users/:id',
    component: UserShow,
    meta: {
      title: 'Utilisateurs',
      keepAlive: false,
    },
    props: true,
    children: [
      {
        path: 'edit',
        name: 'User profile edit',
        component: UserEdit,
        meta: {
          title: 'Modification de profil utilisateur',
          keepAlive: false,
        },
        props: true,
      },
    ],
  },
  {
    name: 'Create View',
    path: '/create',
    component: CreateView,
    meta: {
      useFullscreen: true,
      menuLess: true,
    },
    /*
    /create/new **********************
    /create/projects **********************
    /create/4/edit **********************
    /create/4/import **********************
    /create/4/show **********************
    
    /create
    
    /create/writer
    /create/assembler
    /create/4
    /create/4/writer
    /create/4/assembler
    
     /execute/4
    */
    children: [
      {
        name: 'Projects',
        path: 'projects',
        component: ProjectList,
        meta: {
          useFullscreen: true,
          menuLess: true,
          project: true,
        },
      },
      {
        name: 'ProjectCreator',
        path: 'new',
        component: ProjectCreator,
        meta: {
          useFullscreen: true,
          menuLess: true,
          project: true,
        },
      },
      {
        name: 'ProjectEditor',
        component: ProjectEditor,
        path: ':id/edit',
        meta: {
          useFullscreen: true,
          menuLess: true,
          project: true,
        },
      },
      {
        name: 'ProjectImport',
        path: ':id/import',
        component: ProjectImport,
        meta: {
          useFullscreen: true,
          menuLess: true,
          project: true,
        },
      },
      {
        name: 'ProjectDetails',
        path: ':id/show',
        component: ProjectDetails,
        meta: {
          useFullscreen: true,
          menuLess: true,
          project: true,
        },
      },
      {
        name: 'Assembler',
        path: 'assembler',
        meta: {
          useFullscreen: true,
          menuLess: true,
          editor: 'assembler',
        },
      },
    ],
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
