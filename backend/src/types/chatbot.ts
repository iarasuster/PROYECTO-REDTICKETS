
export type Archetype = "discover" | "compare" | "inform" | "handoff" | "redirect";


export type VisualBlock =
  | {
      type: "image";
      src: string;
      alt?: string;
      caption?: string;
    }
  | {
      type: "image-gallery";
      images: {
        src: string;
        name?: string;
        role?: string;
      }[];
    }
  | {
      type: "card-list";
      items: {
        title: string;
        description?: string;
        image?: string;
        action?: string;
      }[];
    }
  | {
      type: "video";
      src: string;
      title?: string;
    };


export type ActionBlock = {
  type: "navigate" | "message";
  label: string;
  value: string; // URL slug or message text
  variant?: "primary" | "secondary";
};


export type MessageLayers = {
  visual?: VisualBlock[];
  acknowledge?: { text: string };
  context?: { text: string };
  insight?: { text: string };
  nextSteps?: ActionBlock[];
};


export type AIMessage = {
  archetype: Archetype;
  layers: MessageLayers;
};


export type ContentData = {
  secciones: {
    slug: string;
    titulo: string;
    descripcion: string;
    imagenes?: string[];
  }[];
  servicios: {
    titulo: string;
    descripcion: string;
    caracteristicas?: string[];
  }[];
  equipo: {
    nombre: string;
    area: string;
    imagen?: string;
  }[];
  eventos?: {
    titulo: string;
    fecha: string;
    descripcion: string;
    imagen?: string;
  }[];
};
