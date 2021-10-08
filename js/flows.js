import {
    getOutgoers,
    getIncomers
} from 'https://cdn.skypack.dev/react-flow-renderer';
import FlowManager from 'https://cdn.skypack.dev/flowed';

// take elements state from react-flow, read to create resolvers and FlowManager tasks JSON
export const onConnectUpdateFlows = (selectedElement, elements, flows, setFlows) => {
    const components = [];
    const recursivelyPushComponents = (element, sorter=0) => {
        const el = element;
        const incomers = getIncomers(el, elements);
        const outgoers = getOutgoers(el, elements);

        // check and push target el
        if (
            (el.type === "component" || el.type === "data") && 
            components.findIndex(cmpnt => cmpnt.el.id === el.id) < 0
        ) components.push({ el, sorter });

        // get neighbours and call fcn for them, 
        // increment or decrement sorter for ordering of components
        incomers.forEach(incomer => {
            if (
                (incomer.type === "component" || el.type === "data") && 
                components.findIndex(cmpnt => cmpnt.el.id === incomer.id) < 0
            ) recursivelyPushComponents(incomer, sorter-1);
        });

        outgoers.forEach(outgoer => {
            if (
                (outgoer.type === "component" || el.type === "data") && 
                components.findIndex(cmpnt => cmpnt.el.id === outgoer.id) < 0
            ) recursivelyPushComponents(outgoer, sorter+1);
        });
    }
    recursivelyPushComponents(selectedElement);
    components.sort((a,b) => a.sorter > b.sorter);

    // create tasks obj, element IDs array & resolvers obj for flow
    const elWithFlowID = components.find(cmpnt => cmpnt.el.data.flowID);
    const flowID = elWithFlowID && elWithFlowID.el.data && elWithFlowID.el.data.flowID
        ? elWithFlowID.el.data.flowID
        : `flow-${flows.length}`;

    const componentIDs = [];
    const tasks = {};
    components.forEach((cmpnt, i) => {
        componentIDs.push(cmpnt.el.id);
        cmpnt.el.data.flowID = flowID;
        // this will need to use previous component & inbound elements to figure out what the "requires" array will contain
        // and which input is each require, also input nodes will have to have have there data written in params?
        tasks[cmpnt.el.id] = {
            // 
            requires: cmpnt.el.data.requires.map(require => `${cmpnt.el.id}_${require}`),
            // resolver contains function data in string form. Will need to be decoded before flow execution
            resolver: {
                ...cmpnt.el.data.resolver,
                results: {
                    out: `${cmpnt.el.id}_${cmpnt.el.data.resolver.results.out}` 
                },
            },
            provides: cmpnt.el.data.provides.map(provides => `${cmpnt.el.id}_${provides}`),
        };
    });

    // here we need to create classes for each resolver (or use the data class if data) and append classes to tasks obj

    // push result into flows array state var/update if flow already exists
    setFlows(flows => {
        const index = flows.findIndex(flow => flow.id === flowID);
        const flowData = { id: flowID, componentIDs, tasks };
        if (index > -1) {
            flows[index] = flowData;
        } else flows.push(flowData);
        return [...flows];
    });
};

export const onRemoveUpdateFlows = (elsRemoved, newEls, setFlows) => {
    setFlows(flows => {
        let newFlows = flows.filter(flow => newEls.some(el => el.data && el.data.flowID === flow.id));
        newFlows.forEach(flow => flow.componentIDs = flow.componentIDs.filter(elID => {
            return newEls.some(el => el.id === elID) && !elsRemoved.some(el => el.target === elID);
        }));
        return newFlows;
    });
};

// var f = new Function(function.inputs, function.body);