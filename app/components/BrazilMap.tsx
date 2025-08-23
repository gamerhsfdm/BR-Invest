"use client";

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Feature, Geometry } from "geojson";

const geoUrl =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

interface InvestmentByState {
  state: string;
  public: number;
  private: number;
}

interface BrazilMapProps {
  data: InvestmentByState[];
}

// Tipagem para cada geography do mapa
interface GeographyProperties {
  name: string;
}

type GeographyFeature = Feature<Geometry, GeographyProperties>;

const normalizeName = (str: string) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const BrazilMap: React.FC<BrazilMapProps> = ({ data }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Organiza os dados por estado (chave normalizada)
  const dataByState: Record<string, { investimento: string }> = {};
  data.forEach((item) => {
    if (!item.state || item.public === undefined || item.private === undefined)
      return;
    const normalizedState = normalizeName(item.state);
    const totalInvestment = item.public + item.private;
    dataByState[normalizedState] = {
      investimento: `R$${totalInvestment.toLocaleString()} milhões`,
    };
  });

  const stateColors: Record<string, string> = {
    "sao paulo": "#1f4ed8",
    "minas gerais": "#1f4ed8",
    "rio de janeiro": "#1f4ed8",
    bahia: "#1f4ed8",
    "espirito santo": "#1f4ed8",
    "rio grande do sul": "#ea580c",
    parana: "#ea580c",
    "santa catarina": "#ea580c",
    goias: "#ea580c",
    "distrito federal": "#ea580c",
    pernambuco: "#ea580c",
  };

  // Define o style tipado para o Geography
  const geographyStyle: {
    default: React.CSSProperties;
    hover: React.CSSProperties;
    pressed: React.CSSProperties;
  } = {
    default: { outline: "none", cursor: "pointer" },
    hover: { fill: "#0ea5e9", outline: "none" },
    pressed: { fill: "#0ea5e9", outline: "none" },
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center col-span-1 lg:col-span-2">
      <h3 className="text-gray-700 font-semibold mb-3 text-lg text-center">
        Investimentos por Estado
      </h3>

      <div className="flex flex-wrap gap-6 mb-6 text-sm text-muted-foreground justify-center">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "#1f4ed8" }} />
          Sudeste
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "#ea580c" }} />
          Sul / Centro-Oeste
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "#16a34a" }} />
          Outros
        </div>
      </div>

      <div className="w-full flex justify-center">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-52, -15], scale: 650 }}
          className="w-full h-[500px]"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Type assertion para incluir rsmKey do react-simple-maps
                const geoTyped = geo as GeographyFeature & { rsmKey: string };
                const name = geoTyped.properties.name;
                const normalizedName = normalizeName(name);
                const fill = stateColors[normalizedName] || "#16a34a";

                return (
                  <Geography
                    key={geoTyped.rsmKey}
                    geography={geoTyped}
                    fill={fill}
                    stroke="#fff"
                    strokeWidth={0.5}
                    onClick={() => setSelectedState(normalizedName)}
                    style={geographyStyle}
                    aria-label={`Estado: ${name}`}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {selectedState && (
        <div className="mt-6 bg-gray-50 rounded-xl p-4 shadow w-full text-sm text-gray-800 border">
          <h4 className="font-semibold text-base mb-2 capitalize">{selectedState}</h4>
          {dataByState[selectedState] ? (
            <p>
              <strong>Investimento:</strong> {dataByState[selectedState].investimento}
            </p>
          ) : (
            <p>Sem dados disponíveis para este estado.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BrazilMap;
