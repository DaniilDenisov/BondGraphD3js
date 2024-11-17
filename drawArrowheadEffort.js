// drawArrowhead.js

export function drawArrowheadEffort(svg) {
    svg.append("defs").append("marker")
        .attr("id", "arrowhead-effort")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 15)
        .attr("markerHeight", 15)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M15,0 L0,0 L0,3 L10,0")
        .attr("class", "arrowhead");
}
