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

interface GeographyProperties {
  name: string;
}

type GeographyFeature = Feature<Geometry, GeographyProperties>;

const normalizeName = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const BrazilMap: React.FC<BrazilMapProps> = ({ data }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

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
    "sao paulo": "#8ecae6",
    "minas gerais": "#8ecae6",
    "rio de janeiro": "#8ecae6",
    bahia: "#8ecae6",
    "espirito santo": "#8ecae6",
    "rio grande do sul": "#ffb703",
    parana: "#ffb703",
    "santa catarina": "#ffb703",
    goias: "#ffb703",
    "distrito federal": "#ffb703",
    pernambuco: "#ffb703",
    alagoas: "#219ebc",
    sergipe: "#219ebc",
    "rio grande do norte": "#219ebc",
    paraiba: "#219ebc",
    ceara: "#219ebc",
    piaui: "#219ebc",
    maranhao: "#219ebc",
    tocantins: "#219ebc",
    para: "#219ebc",
    amapa: "#219ebc",
    roraima: "#219ebc",
    amazonas: "#219ebc",
    acre: "#219ebc",
    rondonia: "#219ebc",
    "mato grosso": "#219ebc",
    "mato grosso do sul": "#219ebc",
  };

  const defaultFill = "#fb8500";
  const defaultStroke = "#fff";
  const hoverFill = "#023047";
  const pressedFill = "#023047";

  const geographyStyle = {
    default: {
      outline: "none",
      cursor: "pointer",
      stroke: defaultStroke,
      strokeWidth: 0.5,
    },
    hover: {
      fill: hoverFill,
      outline: "none",
    },
    pressed: {
      fill: pressedFill,
      outline: "none",
    },
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center col-span-1 lg:col-span-2">
      <h3 className="text-gray-700 font-semibold mb-3 text-lg text-center">
        Investimentos por Estado
      </h3>

      <div className="flex flex-wrap gap-6 mb-6 text-sm text-muted-foreground justify-center">
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: "#8ecae6" }}
          />
          Sudeste
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: "#ffb703" }}
          />
          Sul / Centro-Oeste
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: "#219ebc" }}
          />
          Norte / Nordeste
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: "#fb8500" }}
          />
          Sem dados
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
                const geoTyped = geo as GeographyFeature & { rsmKey: string };
                const name = geoTyped.properties.name;
                const normalizedName = normalizeName(name);
                const fill = stateColors[normalizedName] || defaultFill;

                return (
                  <Geography
                    key={geoTyped.rsmKey}
                    geography={geoTyped}
                    fill={fill}
                    stroke={defaultStroke}
                    strokeWidth={0.5}
                    onClick={() => setSelectedState(normalizedName)}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    style={geographyStyle as any}
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
          <h4 className="font-semibold text-base mb-2 capitalize">
            {selectedState}
          </h4>
          {dataByState[selectedState] ? (
            <p>
              <strong>Investimento:</strong>{" "}
              {dataByState[selectedState].investimento}
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
