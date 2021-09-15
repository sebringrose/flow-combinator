import React, { memo } from 'https://cdn.skypack.dev/react';
import { Handle } from 'https://cdn.skypack.dev/react-flow-renderer';
import htm from 'https://cdn.skypack.dev/htm';
const html = htm.bind(React.createElement);

const DataNode = memo(({ data, isConnectable }) => html`<${React.Fragment}>
    <div class="react-flow__node__inner">
        <h5>Data</h5>
        <p>${data.label}</p>
    </div>
    <${Handle}
        type="source"
        position="bottom"
        isConnectable=${isConnectable}
    />
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

const ComponentNode = memo(({ data, isConnectable }) => html`<${React.Fragment}>
    <${Handle}
        type="target"
        position="top"
        isConnectable=${isConnectable}
    />
    <div class="react-flow__node__inner">
        <h5>Component</h5>
        <p>${data.name}</p>
    </div>
    <${Handle}
        type="source"
        position="bottom"
        isConnectable=${isConnectable}
    />
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

export default {
    comment: CommentNode,
    component: ComponentNode,
    data: DataNode,
    return: ReturnNode,
    trigger: TriggerNode,
};
