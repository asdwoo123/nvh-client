const ModbusRTU = require('modbus-serial')
const client = new ModbusRTU()
client.connectRTUBuffered('COM8', {baudRate: 115200}, next)

function next() {
    client.setID(1)
}
