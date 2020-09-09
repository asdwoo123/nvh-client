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

export const plcConfig = () => {
    return {
        host: ['192', '168', '3', '39'],
        port: 3000,
        io: {sol: [32, 66]},
        inputPort: ['X0000', 80],
        outputPort: ['Y117', 33],
        test: ['M134', 17],
        lhdLeft: ['X0001', 1],
        lhdRight: ['X0003', 1],
        rhdLeft: ['X0002', 1],
        rhdRight: ['X0004', 1],
        mode: ['M336', 8],
        manual: ['M0002', 1],
        mainAir: ['M300', 1],
        switchAndStop: ['M168', 62],
        cylinderError: ['M358', 1],
        cycleTime: ['D1010', 1],
        total: ['D100', 1],
        primaryWork: ['D77', 4],
        switchOneOn: ['M1000', 1],
        cylinderErrorCheck: ['M900', 17],
        sideJigError: ['M1500', 1],
        incompleteWork: ['M1600', 1],
        nokAndOk: ['D2000', 2],
        toolSensor: ['D3200', 1]
    }
}
