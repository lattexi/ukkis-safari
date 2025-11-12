function createMarkerElement(id: number): HTMLDivElement {
  // random color based on id
  const colors = [
    "#ff5722",
    "#4caf50",
    "#2196f3",
    "#ff9800",
    "#9c27b0",
    "#00bcd4",
    "#8bc34a",
    "#e91e63",
  ];
  const color = colors[id % colors.length];

  const markerElement = document.createElement("div");
  markerElement.style.width = "24px";
  markerElement.style.height = "24px";
  markerElement.style.backgroundColor = color;
  markerElement.style.borderRadius = "50%";
  markerElement.style.border = "3px solid white";
  markerElement.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
  return markerElement;
}

function createUserMarkerElement(color = "#1e90ff") {
  const markerElement = document.createElement("div");
  markerElement.style.width = "30px";
  markerElement.style.height = "30px";
  markerElement.style.backgroundColor = color;
  markerElement.style.borderRadius = "50%";
  markerElement.style.border = "3px solid white";
  markerElement.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
  return markerElement;
}

export { createMarkerElement, createUserMarkerElement };
