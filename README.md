# Waterloo & City Line Live Tracking Map

A Traksy-style real-time signal diagram for the Waterloo & City line built with Node.js, WebSockets, and HTML5 Canvas.

## Features

- **Live TrackerNet Integration:** Fetches signal-level prediction data directly from TfL's legacy TrackerNet XML API.
- **Non-Passenger Train Tracking:** Displays active empty stock runs, depot transfers, and sidings movements alongside standard passenger trains.
- **Signal Diagram Overlay:** Plots physical train locations dynamically over a high-resolution track circuit schematic (`W&C.jpg`).
- **Real-Time Streaming:** Pushes live position updates to all connected browser clients via WebSockets every 10 seconds.

## Project Structure

```text
wac-live-map/
├── public/
│   ├── assets/
│   │   └── W&C.jpg           # Track circuit diagram image
│   ├── index.html            # Main web page
│   ├── app.js                # Canvas rendering & WebSocket client
│   └── style.css             # UI styling
├── src/
│   ├── server.js             # Express & WebSocket server
│   ├── trackernet.js         # TfL API fetcher & XML parser
│   └── trackMapper.js        # Maps train state to (X,Y) coordinates
├── package.json
└── README.md