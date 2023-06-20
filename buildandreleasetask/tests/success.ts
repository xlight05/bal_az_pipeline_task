import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('version', '2201.6.x');

//Create assertAgent and getVariable mocks
const tl = require('azure-pipelines-task-lib/mock-task');
const tlClone = Object.assign({}, tl);
tlClone.getInput = function (inputName: string, required?: boolean) {
    inputName = inputName.toLowerCase();
    if (inputName === 'version') {
        return '11.3.0';
    }
    if (inputName === 'checkLatest') {
        return 'false';
    }
    return tl.getInput(inputName, required);
}
tlClone.getVariable = function(variable: string) {
    if (variable.toLowerCase() == 'agent.tempdirectory') {
        return 'tmp';
    }
    return null;
};
tlClone.assertAgent = function(variable: string) {
    return;
};

tmr.registerMock('azure-pipelines-task-lib/mock-task', tlClone);

tmr.run();