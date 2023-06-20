"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
let taskPath = path.join(__dirname, '..', 'index.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
tmr.setInput('version', '2201.6.x');
//Create assertAgent and getVariable mocks
const tl = require('azure-pipelines-task-lib/mock-task');
const tlClone = Object.assign({}, tl);
tlClone.getInput = function (inputName, required) {
    inputName = inputName.toLowerCase();
    if (inputName === 'version') {
        return '11.3.0';
    }
    if (inputName === 'checkLatest') {
        return 'false';
    }
    return tl.getInput(inputName, required);
};
tlClone.getVariable = function (variable) {
    if (variable.toLowerCase() == 'agent.tempdirectory') {
        return 'tmp';
    }
    return null;
};
tlClone.assertAgent = function (variable) {
    return;
};
tmr.registerMock('azure-pipelines-task-lib/mock-task', tlClone);
tmr.run();
