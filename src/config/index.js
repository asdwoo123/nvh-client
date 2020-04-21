

export const plcConfig = () => {
    return {
        host: ['192', '168', '3', '39'],
        port: 3000,
        io: {sol: [32, 66]},
        inputPort: ['X0000', 80],
        outputPort: ['Y0050', 32]
    }
}
