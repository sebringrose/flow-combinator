import React, { memo } from 'https://cdn.skypack.dev/react';
import { Handle } from 'https://cdn.skypack.dev/react-flow-renderer';
import htm from 'https://cdn.skypack.dev/htm';
const html = htm.bind(React.createElement);

const DataNode = memo(({ id, data, isConnectable }) => html`<${React.Fragment}>
    <div class="react-flow__node__inner">
        <h5>Data</h5>
        <p>${data.label}</p>
    </div>
    ${Object.keys(data.contents).map((dataKey, i) => html`<${Handle}
        id=${`${id}_${dataKey}`}
        type="source"
        isConnectable=${isConnectable}
        position="bottom"
        style=${{ left: `${(100/(Object.keys(data.contents).length+1)) * (i+1)}%` }}
    >
        ${dataKey}
    </${Handle}>`)}
</${React.Fragment}>`);

const TriggerNode = memo(({ data, isConnectable }) => html`<${React.Fragment}>
    <div class="react-flow__node__inner">
        <h5>Trigger</h5>
        <p>${data.listener}</p>
    </div>
    <${Handle}
        type="source"
        position="bottom"
        isConnectable=${isConnectable}
    />
</${React.Fragment}>`);

const ComponentNode = memo(({ id, data, isConnectable }) => html`<${React.Fragment}>
    ${data.resolver.arguments.map((arg, i) =>  html`<${Handle}
        id=${`${id}_${arg}`}
        type="target"
        isConnectable=${isConnectable}
        style=${{ left: `${(100/(data.resolver.arguments.length+1)) * (i+1)}%` }}
    >
        ${arg}
    </${Handle}>`)}
    <div class="react-flow__node__inner">
        <h6>${data.flowID}</h6>
        <h5>Component</h5>
        <p>${data.name}</p>
    </div>
    ${data.provides.map((providedVar, i) => html`<${Handle}
        type="source"
        position="bottom"
        isConnectable=${isConnectable}
        style=${{ left: `${(100/(data.provides.length+1)) * (i+1)}%` }}
    >
        ${providedVar}
    </${Handle}>`)}
</${React.Fragment}>`);

const ReturnNode = memo(({ data, isConnectable }) => html`<${React.Fragment}>
    <${Handle}
        type="target"
        position="top"
        isConnectable=${isConnectable}
    />
    <div class="react-flow__node__inner">
        <h5>Return</h5>
    </div>
</${React.Fragment}>`);

const CommentNode = memo(({ data }) => html`<div class="react-flow__node__inner">
    // ${data.text}
</div>`);

export const nodeTypes = {
    comment: CommentNode,
    component: ComponentNode,
    data: DataNode,
    return: ReturnNode,
    trigger: TriggerNode,
};

export const nodeTemplates = {
    comment: {
        data: {}
    },
    component: {
        data: {
            name: "Does Something...",
            resolver: { 
                name: "generic", 
                params: {}, 
                arguments: ["a1"], 
                function: "return a;"
            },
            provides: ["a2"]
        }
    },
    data: {
        data: {}
    },
    return: {
        data: {}
    },
    trigger: {
        data: {}
    },
};
