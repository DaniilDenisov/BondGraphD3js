// Function to calculate shortened line positions and perpendicular lines
export function calculateEdgeCoordinates(source, target, linePosition = 'middle', nodeRadius) {
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