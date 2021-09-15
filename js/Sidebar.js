import React from 'https://cdn.skypack.dev/react';
import { createFlow } from './flowed.js';
import htm from 'https://cdn.skypack.dev/htm';
const html = htm.bind(React.createElement);

const Sidebar = ({ nodeTypes, elements, selectedElement, onElementRemove }) => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return html`<aside>
        ${selectedElement
            ?  html`<ul>
                    ${Object.keys(selectedElement).map(key => html`<li>
                        <strong>${key}:</strong> ${JSON.stringify(selectedElement[key])}
                    </li>`)}
                    <li>
                        <button id="run-flow" onClick=${() => createFlow(selectedElement, elements)}>
                            Run flow
                        </button>
                    </li>
                    <li>
                    <button id="delete" onClick=${() => onElementRemove([selectedElement])}>
                        Delete
                    </button>
                </li>
                </ul>`
            :  html`<div class="description">You can drag these nodes into the graph to create new nodes.</div>
                ${Object.keys(nodeTypes).map(key => html`<div 
                    class="dndnode ${key}" 
                    onDragStart=${(event) => onDragStart(event, key)} 
                    draggable
                >
                    ${key[0].toUpperCase() + key.substring(1)}
                </div>`)}`
        }
    </aside>`;
};

export default Sidebar;