import {
    getOutgoers,
    getIncomers
} from 'https://cdn.skypack.dev/react-flow-renderer';
import FlowManager from 'https://cdn.skypack.dev/flowed';

// take elements state from react-flow, read to create resolvers and FlowManager tasks JSON
export const createFlow = (selectedElement, elements) => {
    const components = [];
    const tasks = {};
    
    const recursivelyPushComponents = (element, sorter=0) => {
        const el = element;

        // get neighbours and call fcn for them, 
        // increment or decrement sorter for ordering of components
        const incomers = getIncomers(el, elements);
        incomers.forEach(incomer => {
            if (incomer.type === "data") {
                el.inputDataNodes = [];
                el.inputDataNodes.push(incomer);
            }
            if (
                incomer.type === "component" && 
                components.findIndex(cmpnt => cmpnt.id === incomer.id) < 0
            ) recursivelyPushComponents(incomer, --sorter);
        });

        const outgoers = getOutgoers(el, elements);
        outgoers.forEach(outgoer => {
            if (
                outgoer.type === "component" && 
                components.findIndex(cmpnt => cmpnt.id === outgoer.id) < 0
            )  recursivelyPushComponents(outgoer, ++sorter);
        });

        // check and push target el
        if (
            el.type === "component" && 
            components.findIndex(cmpnt => cmpnt.id === el.id) < 0
        ) {
            console.log("pushing target el");
            components.push({ el, sorter });
        }
    }
    recursivelyPushComponents(selectedElement);
    components.sort((a,b) => a.sorter > b.sorter);

    // YAYYY this works!
    console.log(components);
}

// var f = new Function(function.inputs, function.body);