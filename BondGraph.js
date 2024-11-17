import { drawArrowheadEffort } from './drawArrowheadEffort.js';
import { drawArrowheadFlow } from './drawArrowheadFlow.js';

d3.json("BondGraph.json").then(data => {
// Bond graph data: nodes (elements) and edges (bonds)

const { nodes, edges } = data;

// Create SVG container
const svg = d3.select("svg");

// Define half-arrowhead for effort (right-angle arrow)
drawArrowheadEffort(svg);

// Define half-arrowhead for flow
drawArrowheadFlow(svg);

const nodeRadius = 35; 

// Function to calculate shortened line positions and perpendicular lines
function calculateEdgeCoordinates(source, target, linePosition = 'middle') {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const shortenDistance = nodeRadius + 5; 

    const ratio = shortenDistance / distance;
    const sourceX = source.x + dx * ratio;
    const sourceY = source.y + dy * ratio;
    const targetX = target.x - dx * ratio;
    const targetY = target.y - dy * ratio;

    const perpendicularDx = -dy;
    const perpendicularDy = dx;
    const perpendicularLength = 10;

    let normalX, normalY;
    if (linePosition === 'head') {
        normalX = targetX;
        normalY = targetY;
    } else if (linePosition === 'tail') {
        normalX = sourceX;
        normalY = sourceY;
    } else {
        normalX = (sourceX + targetX) / 2;
        normalY = (sourceY + targetY) / 2;
    }

    const perpX1 = normalX + perpendicularDx / distance * perpendicularLength;
    const perpY1 = normalY + perpendicularDy / distance * perpendicularLength;
    const perpX2 = normalX - perpendicularDx / distance * perpendicularLength;
    const perpY2 = normalY - perpendicularDy / distance * perpendicularLength;

    return {
        sourceX, sourceY, targetX, targetY, perpX1, perpY1, perpX2, perpY2
    };
}


// Draw Edjes between nodes
const link = svg.selectAll(".link")
    .data(edges)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("marker-end", d => d.causality === "e->f" ? "url(#arrowhead-effort)" : "url(#arrowhead-flow)");

// Add causality lines (perpendicular to the arrows)
const causalityLines = svg.selectAll(".causality-line")
    .data(edges)
    .enter().append("line")
    .attr("class", "causality-line")
    .attr("stroke", "gray")
    .attr("stroke-width", 1);

// Add causality labels
const edgeLabel = svg.selectAll(".causality-label")
    .data(edges)
    .enter().append("text")
    .attr("class", "causality-label")
    .attr("text-anchor", "middle")
    .text(d => d.causality === "e->f" ? "effort" : "flow");

// Add nodes
const node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

node.append("circle")
    .attr("r", nodeRadius)
    .attr("fill", d => d.id.includes("0-junction") ? "pink" : d.id.includes("1-junction") ? "#90EE90" : "skyblue");

node.append("text")
    .attr("dy", -5)
    .attr("class", "label")
    .text(d => d.id.split(" ")[0]);

node.append("text")
    .attr("dy", 15)
    .attr("class", "label")
    .text(d => d.id.split(" ")[1]);

// Function to update the positions of the edges, causality lines, and labels
function updateLinks() {
    link
        .attr("x1", d => {
            const { sourceX } = calculateEdgeCoordinates(
                nodes.find(n => n.id === d.source),
                nodes.find(n => n.id === d.target)
            );
            return sourceX;
        })
        .attr("y1", d => {
            const { sourceY } = calculateEdgeCoordinates(
                nodes.find(n => n.id === d.source),
                nodes.find(n => n.id === d.target)
            );
            return sourceY;
        })
        .attr("x2", d => {
            const { targetX } = calculateEdgeCoordinates(
                nodes.find(n => n.id === d.source),
                nodes.find(n => n.id === d.target)
            );
            return targetX;
        })
        .attr("y2", d => {
            const { targetY } = calculateEdgeCoordinates(
                nodes.find(n => n.id === d.source),
                nodes.find(n => n.id === d.target)
            );
            return targetY;
        });

    causalityLines
        .attr("x1", d => calculateEdgeCoordinates(
            nodes.find(n => n.id === d.source),
            nodes.find(n => n.id === d.target),
            d.linePosition
        ).perpX1)
        .attr("y1", d => calculateEdgeCoordinates(
            nodes.find(n => n.id === d.source),
            nodes.find(n => n.id === d.target),
            d.linePosition
        ).perpY1)
        .attr("x2", d => calculateEdgeCoordinates(
            nodes.find(n => n.id === d.source),
            nodes.find(n => n.id === d.target),
            d.linePosition
        ).perpX2)
        .attr("y2", d => calculateEdgeCoordinates(
            nodes.find(n => n.id === d.source),
            nodes.find(n => n.id === d.target),
            d.linePosition
        ).perpY2);

    edgeLabel
        .attr("x", d => (nodes.find(n => n.id === d.source).x + nodes.find(n => n.id === d.target).x) / 2)
        .attr("y", d => (nodes.find(n => n.id === d.source).y + nodes.find(n => n.id === d.target).y) / 2);
}

// Dragging behavior functions
function dragstarted(event, d) {
    d3.select(this).raise().attr("stroke", "black");
}

function dragged(event, d) {
    d.x = event.x;
    d.y = event.y;
    d3.select(this).attr("transform", `translate(${d.x},${d.y})`);
    updateLinks();
}

function dragended(event, d) {
    d3.select(this).attr("stroke", null);
}

// Initial update of the links
updateLinks();
});
