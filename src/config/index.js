import AutoView from "@/views/AutoView";

export const routes = () => [
    {
        path: '/',
        name: 'automation',
        component: AutoView,
        exact: true
    },
    {
        path: '/auto',
        name: 'automation',
        component: AutoView,
    },
    {
        path: '/manual',
        name: 'manual',
        component: () => import('@/views/ManualView')
    },
    {
        path: '/io',
        name: 'io',
        component: () => import('@/views/IOView')
    },
    {
        path: '/history',
        name: 'history',
        component: () => import('@/views/HistoryView')
    },
    {
        path: '/config',
        name: 'configure',
        component: () => import('@/views/ConfigView')
    }
]

