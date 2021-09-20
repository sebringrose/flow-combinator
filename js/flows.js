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
            el.type === "component" && 
            components.findIndex(cmpnt => cmpnt.el.id === el.id) < 0
        ) components.push({ el, incomers, outgoers, sorter });

        // get neighbours and call fcn for them, 
        // increment or decrement sorter for ordering of components
        incomers.forEach(incomer => {
            if (
                incomer.type === "component" && 
                components.findIndex(cmpnt => cmpnt.el.id === incomer.id) < 0
            ) recursivelyPushComponents(incomer, sorter-1);
        });

        outgoers.forEach(outgoer => {
            if (
                outgoer.type === "component" && 
                components.findIndex(cmpnt => cmpnt.el.id === outgoer.id) < 0
            ) recursivelyPushComponents(outgoer, sorter+1);
        });
    }
    recursivelyPushComponents(selectedElement);
    components.sort((a,b) => a.sorter > b.sorter);

    // YAYYY this works!
    console.log(components);

    // create tasks obj, element IDs array & resolvers obj for flow
    // push result into flows array state var/update if flow already exists
    const elementIDs = [];
    const tasks = {};
    const elWithFlowID = components.find(cmpnt => cmpnt.el.data.flowID);
    const flowID = elWithFlowID && elWithFlowID.data && elWithFlowID.data.flowID
        ? elWithFlowID.data.flowID
        : `flow-${flows.length}`;

    components.forEach((cmpnt, i) => {
        elementIDs.push(cmpnt.el.id);
        console.log(flowID);
        cmpnt.el.data.flowID = flowID;
        tasks[String.fromCharCode(65+i)] = cmpnt.el;
    });

    setFlows(flows => {
        const index = flows.findIndex(flow => flow.id === flowID);
        const flowData = { id: flowID, elementIDs, tasks };
        if (index > -1) {
            flows[i] = flowData;
        } else flows.push(flowData);
        return [...flows];
    });
}

// var f = new Function(function.inputs, function.body);

// need another function that will remove flowID from elements if they are disconnected from a flow