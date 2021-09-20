import {
    getOutgoers,
    getIncomers
} from 'https://cdn.skypack.dev/react-flow-renderer';
import FlowManager from 'https://cdn.skypack.dev/flowed';

// take elements state from react-flow, read to create resolvers and FlowManager tasks JSON
export const onConnectUpdateFlows = (selectedElement, elements, setElements, flows, setFlows) => {
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

    // do things with components to create tasks obj, element IDs array & resolvers obj
    // push resultant flow into flows array state var/update if flow already exists
    // update elements in flow with flow id
    const elementIDs = [];
    const tasks = {};
    const elWithFlowID = components.find(cmpnt => cmpnt.el.data.flowID);
    console.log(elWithFlowID);
    const flowID = elWithFlowID && elWithFlowID.data && elWithFlowID.data.flowID
        ? elWithFlowID.data.flowID
        : `flow-${flows.length}`;

    components.forEach((cmpnt, i) => {
        elementIDs.push(cmpnt.el.id);
        console.log(flowID);
        cmpnt.el.data.flowID = flowID;
        tasks[String.fromCharCode(65+i)] = cmpnt.el;
        
        console.log(cmpnt);

        // add flowID to elements in state for rendering in UI
        setElements(els => 
            els.map(el => {
                if (el.id === cmpnt.el.id) el.data = cmpnt.el.data;
                return el;
            })
        )
    });

    setFlows(flows => {
        const index = flows.findIndex(flow => flow.id === flowID);
        const flowData = { id: flowID, elementIDs, tasks };
        if (index > -1) {
            flows[i] = flowData;
        } else flows.push(flowData);
        console.log(flows);
        return flows;
    })
}

// var f = new Function(function.inputs, function.body);

// need another function that will remove flowID from elements if they are disconnected from a flow