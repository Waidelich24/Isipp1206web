"use client"

export const useSmoothScroll = () => {
  const scrollToSection = (id: string, offset = 80) => {
    if (!id) return;
    
    const cleanId = id.replace(/^#/, '');
    if (!cleanId) return;

    const element = document.getElementById(cleanId);
    if (element) {
      const headerHeight = document.querySelector('header')?.offsetHeight || offset;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight;

      // Usa scrollTo con behavior smooth
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Actualiza la URL sin recargar
      window.history.pushState({}, '', `#${cleanId}`);
    }
  };

  return { scrollToSection };
};