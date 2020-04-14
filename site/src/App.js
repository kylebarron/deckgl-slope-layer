/// app.js
import React from "react";
import DeckGL from "@deck.gl/react";
import { TileLayer } from "@deck.gl/geo-layers";
import { StaticMap, Source, Layer } from "react-map-gl";
import SlopeLayer from "./slope-layer/slope-layer";

// Viewport settings
const viewState = {
  longitude: -112.1861,
  latitude: 36.1284,
  zoom: 12.1,
  pitch: 0,
  bearing: 0
};

// DeckGL react component
export default class App extends React.Component {
  render() {
    const layers = [
      new TileLayer({
        // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
        // data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
        data:
          "https://s3.amazonaws.com/elevation-tiles-prod/normal/{z}/{x}/{y}.png",

        minZoom: 0,
        maxZoom: 15,

        renderSubLayers: props => {
          const {
            bbox: { west, south, east, north }
          } = props.tile;

          return new SlopeLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north]
          });
        }
      })
    ];

    return (
      <DeckGL initialViewState={viewState} layers={layers} controller>
        <StaticMap mapStyle="https://cdn.jsdelivr.net/gh/nst-guide/osm-liberty-topo@gh-pages/style.json" mapOptions={{ hash: true }}>
          <Source
            id="hillshade"
            minzoom={0}
            maxzoom={15}
            type="raster"
            tileSize={256}
            tiles={[
              "https://qzhdshrb52.execute-api.us-east-1.amazonaws.com/hillshade/{z}/{x}/{y}.png"
            ]}
          >
            <Layer
              id="hillshade-layer"
              type="raster"
              beforeId="building"
              paint={{
                "raster-opacity": 1
              }}
            />
          </Source>
        </StaticMap>
      </DeckGL>
    );
  }
}
