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
        path: '/config',
        name: 'configure',
        component: () => import('@/views/ConfigView')
    }
]

export const plcConfig = () => {
    return {
        host: ['192', '168', '3', '39'],
        port: 3000,
        io: {sol: [32, 67]},
        inputPort: ['X0000', 80],
        outputPort: ['Y117'/*'Y0050'*/, 33],
        test: ['M134', 17],
        lhdSwitch: ['M0168', 22],
        rhdSwitch: ['M0210', 20],
        lhdLeft: ['X0001', 1],
        lhdRight: ['X0003', 1],
        rhdLeft: ['X0002', 1],
        rhdRight: ['X0004', 1],
        mode: ['M336', 8],
        manual: ['M0002', 1],
        mainAir: ['M300', 1],
        stop: ['M201', 1]
    }
}
