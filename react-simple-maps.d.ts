declare module "react-simple-maps" {
  import { ComponentType, SVGProps, ReactNode } from "react";
  import { Feature, Geometry, GeoJsonProperties } from "geojson";

  // Representa cada Geography do mapa
  export interface GeographyProps {
    geography: Feature<Geometry, GeoJsonProperties>;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    onClick?: () => void;
  }

  export interface GeographiesProps {
    geography: string | object; // URL ou objeto GeoJSON
    children: (arg: {
      geographies: (Feature<Geometry, GeoJsonProperties> & { rsmKey: string })[];
    }) => ReactNode;
  }

  export const ComposableMap: ComponentType<
    SVGProps<SVGSVGElement> & {
      projection?: string;
      projectionConfig?: {
        scale?: number;
        center?: [number, number];
      };
    }
  >;

  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<SVGProps<SVGPathElement> & GeographyProps>;
}
