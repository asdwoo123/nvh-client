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
    /*{
        path: '/productConfig',
        name: 'productConfig',
        component: () => import('@/views/ProductConfigView')
    },*/
    {
        path: '/config',
        name: 'configure',
        component: () => import('@/views/ConfigView')
    }
]

export const plcConfig = () => {
    return {
        host: ['192', '168', '3', '39'],
        port: 3000,
        io: {sol: [32, 66]},
        inputPort: ['X0000', 80],
        outputPort: ['Y0050', 32],
        alert: ['D0002', 1]
    }
}

export const alertMessage = () => {
    return ['noPLC', 'noProduct', 'noLHD', 'noRHD']
}
