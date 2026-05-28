export const scrollToCourseTopOnMobile = () => {
  if (typeof window === "undefined") return;
  if (!window.matchMedia("(max-width: 767px)").matches) return;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const activeWeekContent = document.querySelector(".week-content");

      if (activeWeekContent instanceof HTMLElement) {
        activeWeekContent.scrollTo({ top: 0, behavior: "smooth" });
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
};
