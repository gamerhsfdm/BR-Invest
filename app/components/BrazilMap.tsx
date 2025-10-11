"use client";

import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Feature, Geometry } from "geojson";

const geoUrl =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";
interface InvestmentByState {
  state: string;
  public: number;
  private: number;
  area: string;
  source: string;
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

interface StateData {
  totalInvestmentFormatted: string;
  area: string;
  source: string;
}
interface RenderMapProps {
    data: InvestmentByState[];
    dataByState: Record<string, StateData>;
    selectedState: string | null;
    setSelectedState: (state: string | null) => void;
    selectedData: StateData | null;
}

const RenderMap: React.FC<RenderMapProps> = ({ 
    data, 
    dataByState, 
    selectedState, 
    setSelectedState, 
    selectedData 
}) => {
    
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
    <div className="w-full bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center col-span-1 lg:col-span-2">
      <h3 className="text-gray-700 font-extrabold mb-4 text-2xl text-center">
        Mapa de Investimentos no Brasil
      </h3>

      <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 justify-center">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full shadow" style={{ backgroundColor: "#8ecae6" }} />
          Sudeste
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full shadow" style={{ backgroundColor: "#ffb703" }} />
          Sul / Centro-Oeste
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full shadow" style={{ backgroundColor: "#219ebc" }} />
          Norte / Nordeste
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full shadow" style={{ backgroundColor: "#fb8500" }} />
          Sem dados
        </div>
      </div>

      <div className="w-full max-w-4xl flex justify-center border border-gray-200 rounded-xl overflow-hidden shadow-inner">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-52, -15], scale: 650 }}
          className="w-full h-[550px] transition duration-300"
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
                    fill={selectedState === normalizedName ? pressedFill : fill} // Destaque para o estado selecionado
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
        <div className="mt-6 bg-blue-50 rounded-xl p-5 shadow-inner w-full max-w-4xl text-sm text-gray-800 border border-blue-200">
          <h4 className="font-bold text-lg mb-3 capitalize text-blue-900">
            {selectedState.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </h4>
          {selectedData ? (
            <div className="space-y-2">
              <p>
                <strong className="text-blue-700">Investimento Total:</strong>{" "}
                {selectedData.totalInvestmentFormatted}
              </p>
              <p>
                <strong className="text-blue-700">Área Principal:</strong> {selectedData.area}
              </p>
              <p>
                <strong className="text-blue-700">Fonte dos Dados:</strong> {selectedData.source}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic">Sem dados detalhados disponíveis para este estado no momento.</p>
          )}
        </div>
      )}
    </div>
  );
};

const BrazilMap: React.FC = () => {
  const [data, setData] = useState<InvestmentByState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const dataByState: Record<string, StateData> = {};
  data.forEach((item) => {
    const normalizedState = normalizeName(item.state);
    const totalInvestment = item.public + item.private;
    
    dataByState[normalizedState] = {
      totalInvestmentFormatted: `R$${totalInvestment.toLocaleString('pt-BR')} milhões`,
      area: item.area || 'Não especificado',
      source: item.source || 'Desconhecida',
    };
  });

  const selectedData = selectedState ? dataByState[selectedState] : null;

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const cachedData = localStorage.getItem('investmentData');
      if (cachedData) {
        const parsedData: InvestmentByState[] = JSON.parse(cachedData);
        setData(parsedData);
        setLoading(false);
        return;
      }
      const response = await fetch('/api/ai/dados-por-estado');
      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }
      const result: InvestmentByState[] = await response.json();

      if (!Array.isArray(result)) {
        throw new Error('Formato de dados inesperado. Esperava um array.');
      }

      setData(result);
      localStorage.setItem('investmentData', JSON.stringify(result));
    } catch (err) {
      console.error("Falha ao carregar dados da API:", err);
      setError('Não foi possível carregar os dados de investimento.');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-xl p-8 text-center text-gray-600 col-span-1 lg:col-span-2 min-h-[600px] flex items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Carregando dados do mapa da IA...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-red-50 rounded-2xl shadow-xl p-8 text-center text-red-700 border border-red-300 col-span-1 lg:col-span-2 min-h-[600px] flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold mb-2">Erro ao carregar dados</h3>
        <p>{error}</p>
        <p className="text-sm text-red-500 mt-4">Certifique-se de que a API `/api/ai/dados-por-estado` está configurada corretamente e retornando um JSON válido.</p>
      </div>
    );
  }
  
  if (data.length === 0) {
      return (
        <div className="w-full bg-yellow-50 rounded-2xl shadow-xl p-8 text-center text-yellow-700 border border-yellow-300 col-span-1 lg:col-span-2 min-h-[600px] flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold mb-2">Dados Vazios</h3>
            <p>A API retornou um array vazio. O mapa não pode ser renderizado.</p>
        </div>
      );
  }
  return (
    <RenderMap 
        data={data} 
        dataByState={dataByState}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedData={selectedData}
    />
  );
};

export default BrazilMap;
