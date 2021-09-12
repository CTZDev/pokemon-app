const d = document;

const sliderGlobalInfo = () => {
  let activeSlider = 0;

  d.addEventListener("click", (e) => {
    if (e.target.matches(".btn-info")) {
      const $pokemonCard = e.target.closest(".pokemon-card");
      const $flipCard = $pokemonCard.nextElementSibling;
      sliderCard(
        {
          pokemonCard: $pokemonCard,
          flipCard: $flipCard,
        },
        "-100%"
      );
    }

    if (e.target.matches("button[data-button-backward]")) {
      const $thisFlipCard = e.target.closest(".flip-card");
      const $pokemonCard = $thisFlipCard.previousElementSibling;
      sliderCard(
        {
          flipCard: $thisFlipCard,
          pokemonCard: $pokemonCard,
        },
        "0"
      );
    }

    if (e.target.matches("li>button[data-flipCard-about]")) {
      const $containerSlider = e.target.closest(".flip-card-features").nextElementSibling;
      const $slider = $containerSlider.querySelector(".flip-card-slider");
      sliderCard({ $slider }, "0");
      //PINTAR EL BORDE DEL EMENTO Y ARREGLAR TMBN EL DISEÑO DE CSRD
    }
    if (e.target.matches("li>button[data-flipCard-stats]")) {
      const $containerSlider = e.target.closest(".flip-card-features").nextElementSibling;
      const $slider = $containerSlider.querySelector(".flip-card-slider");
      sliderCard({ $slider }, "-100%");
    }
  });
};

const sliderCard = (card, percentajeTranslate = "") => {
  [...Object.values(card)].forEach((el) => {
    el.style.transform = `translateX(${percentajeTranslate})`;
  });
};

export default sliderGlobalInfo;
