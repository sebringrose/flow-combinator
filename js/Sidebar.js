import React from 'https://cdn.skypack.dev/react';
import htm from 'https://cdn.skypack.dev/htm';
import { nodeTypes, nodeTemplates } from './nodeTypes.js'
const html = htm.bind(React.createElement);

const Sidebar = ({ elements, selectedElement, onElementRemove }) => {
    const onDragStart = (event, type) => {
        const nodeObj = { ...nodeTemplates[type], type };
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ ...nodeObj, type }));
        event.dataTransfer.effectAllowed = 'move';
    };

    return html`<aside>
        ${selectedElement
            ?  html`<ul>
                    ${Object.keys(selectedElement).map(key => html`<li>
                        <strong>${key}:</strong> ${JSON.stringify(selectedElement[key])}
                    </li>`)}
                    <li>
                        <button id="run-flow" onClick=${() => console.log(selectedElement, elements)}>
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