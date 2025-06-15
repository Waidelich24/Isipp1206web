const carreraNombres: Record<string, string> = {
  sistemas: "Analista en Sistemas",
  redes: "Redes y Comunicación",
  contabilidad: "Contabilidad",
  higiene: "Seguridad e Higiene"
};

export const getCarreraName = (id: string): string => {
  const names: Record<string, string> = {
    sistemas: "Analista en Sistemas",
    redes: "Redes y Comunicación",
    contabilidad: "Contabilidad",
    higiene: "Seguridad e Higiene",
  };
  return names[id] || id;
};
