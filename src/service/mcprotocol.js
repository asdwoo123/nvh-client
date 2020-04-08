const mc = require('mcprotocol')
const conn = new mc
let isConnect = false

var variables = { TEST1: 'D0,5', 	// 5 words starting at D0
    TEST2: 'M6990,28', 			// 28 bits at M6990
    TEST3: 'CN199,2',			// ILLEGAL as CN199 is 16-bit, CN200 is 32-bit, must request separately
    TEST4: 'R2000,2',			// 2 words at R2000
    TEST5: 'X034',				// Simple input
    TEST6: 'D6000.1,20',			// 20 bits starting at D6000.1
    TEST7: 'D6001.2',				// Single bit at D6001
    TEST8: 'S4,2',				// 2 bits at S4
    TEST9: 'RFLOAT5000,40'		// 40 floating point numbers at R5000
};

conn.initiateConnection({port: 3000, host: '192.168.3.39', ascii: false}, connected);

function connected(err) {
    if (typeof(err) !== "undefined") {
        conn.initiateConnection({port: 3000, host: '192.168.3.39', ascii: false}, connected);
    }
    conn.setTranslationCB(function(tag) {return variables[tag];}); 	// This sets the "translation" to allow us to work with object names defined in our app not in the module
    conn.addItems(['TEST1', 'TEST4']);
    conn.readAllItems(valuesReady);
}

function valuesReady(anythingBad, values) {
    if (anythingBad) return
}

function valuesWritten(anythingBad) {
    if (anythingBad) return
}

export const writePLC() {
    conn.writeItems('TEST4', [ true ], valuesWritten);
}

export const writesPLC() {
    conn.writeItems(['TEST4'], [ true ], valuesWritten);
}
