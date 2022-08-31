const d = document;
let offset = 1;
let limit = 5;

/* DATA CAPTURE FOR THE COMBOBOX TYPE POKEMON */
let isActiveTypePokemon = true;
let typePokemonFound = 0;
let valueIDInitial = 1;
const nextMaxPokemon = 6;
const QUANTITY_OF_POKEMONS = 898;

/*DATA CAPTURE FOR THE TYPE POKEMON */
let arrayAuxOfTypePokemons = [];
let arrayOfTypePokemons = [];
let countBtnClicked = 0;
let activeBtnPrev = true;

const getDataPokemon = async (typePokemon = null) => {
  try {
    const $fragment = d.createDocumentFragment();
    const $cards = d.querySelector(".pokemon-cards");
    const $loading = d.getElementById("loading-pokemon");
    $loading.style.display = "flex";

    if (typePokemon == null || typePokemon === "Mostrar todos") {
      isActiveTypePokemon = true; // Comprobación para el prev y next
      for (let i = offset; i <= offset + limit; i++) {
        let urlDataPokemon = `https://pokeapi.co/api/v2/pokemon/${i}/`;
        let urlSpeciesPokemon = `https://pokeapi.co/api/v2/pokemon-species/${i}/`;
        const responses = await Promise.all([fetch(urlDataPokemon), fetch(urlSpeciesPokemon)]);

        const [responseDataPokemon, responseSpeciesPokemon] = responses;
        if (!responseDataPokemon.ok || !responseSpeciesPokemon.ok)
          throw { status: responses[0].status || responses[1].status, statusText: responses[0].statusText || responses[1].statusText };

        const dataPokemon = await responseDataPokemon.json(); //First request
        const speciesPokemon = await responseSpeciesPokemon.json(); //Second request
        drawCardPokemon(dataPokemon, speciesPokemon, i, $fragment);
      }
    } else {
      isActiveTypePokemon = false; // Comprobación para el prev y next

      while (valueIDInitial <= QUANTITY_OF_POKEMONS && nextMaxPokemon > typePokemonFound) {
        let urlDataPokemon = `https://pokeapi.co/api/v2/pokemon/${valueIDInitial}/`;
        let urlSpeciesPokemon = `https://pokeapi.co/api/v2/pokemon-species/${valueIDInitial}/`;
        const responses = await Promise.all([fetch(urlDataPokemon), fetch(urlSpeciesPokemon)]);

        const [responseDataPokemon, responseSpeciesPokemon] = responses;
        if (!responseDataPokemon.ok || !responseSpeciesPokemon.ok)
          throw { status: responses[0].status || responses[1].status, statusText: responses[0].statusText || responses[1].statusText };

        const dataPokemon = await responseDataPokemon.json(); //First request
        const speciesPokemon = await responseSpeciesPokemon.json(); //Second request

        const types = dataPokemon?.types;
        types.map((type) => {
          const {
            type: { name },
          } = type;

          //Seleccionar solo al tipo de pokemon
          if (typePokemon.toLowerCase() === name) {
            typePokemonFound++;
            drawCardPokemon(dataPokemon, speciesPokemon, valueIDInitial, $fragment);
          }
        });

        if (typePokemonFound === 1 && activeBtnPrev) {
          arrayAuxOfTypePokemons.push(valueIDInitial);
          arrayOfTypePokemons = Array.from([...new Set(arrayAuxOfTypePokemons)]);
          activeBtnPrev = false;
        }

        valueIDInitial++;
      }
    }

    $cards.append($fragment);
    $loading.style.display = "none";
  } catch (error) {
    let message = error.statusText || "Ocurrio un error inesperado";
    console.log(error);
    alert(`Error ${error.status} : ${message}`);
  }
};

const drawCardPokemon = (data, species, id, fragment) => {
  const {
    abilities,
    name,
    sprites: {
      versions: {
        "generation-v": {
          "black-white": {
            animated: { front_default },
          },
        },
      },
      other: { dream_world },
    },
    types,
    height,
    weight,
    stats,
  } = data;

  const { color, flavor_text_entries } = species;

  const $template = d.getElementById("template-pokemon-card").content;
  const $fragmentTypes = d.createDocumentFragment();
  const $fragmentTypesFlip = d.createDocumentFragment();
  let $cloneCard = $template.cloneNode(true);

  let colorPokemon = color?.name;
  if (colorPokemon === "white") colorPokemon = "black";
  const $cardStyle = $cloneCard.querySelector(".pokemon-card").style;
  const $cardReverseStyle = $cloneCard.querySelector(".flip-card").style;
  const $buttonBackground = $cloneCard.querySelector(".pokemon-footer > .btn");

  $cloneCard.querySelector(".pokemon-header-title").textContent = formattedId(id);
  $cloneCard.querySelector(".pokemon-body-name > p").textContent = name;
  $cloneCard.querySelector(".pokemon-header-img > img").setAttribute("src", dream_world["front_default"]);
  $cloneCard.querySelector(".pokemon-header-img > img").setAttribute("alt", name);
  $cloneCard.querySelector(".pokemon-card").dataset.id = formattedId(id);

  //Assign color of the pokemon
  $cardStyle.setProperty("--background", colorPokemon);
  $cardReverseStyle.setProperty("--background", colorPokemon);
  $buttonBackground.style.backgroundColor = colorPokemon;

  const $fragmentAbilities = d.createDocumentFragment();

  $cloneCard.querySelector(".flip-card-hero-header > h2").textContent = name;
  $cloneCard.querySelector(".flip-card-hero-header > h3").textContent = formattedId(id);
  $cloneCard.querySelector(".flip-card-hero-img > img").setAttribute("src", front_default);
  $cloneCard.querySelector(".flip-card-hero-img > img").setAttribute("alt", name);
  $cloneCard.querySelector(".flip-card-slider-aboutme-text").textContent = flavor_text_entries[0]["flavor_text"].replaceAll("", "");
  $cloneCard.querySelector(".flip-card-slider-aboutme-measure-height > p").textContent = `${height} dm`;
  $cloneCard.querySelector(".flip-card-slider-aboutme-measure-weight > p").textContent = `${weight} hg`;

  abilities.map((ability) => {
    const {
      ability: { name },
    } = ability;

    const $li = d.createElement("li");
    $li.textContent = name;
    $fragmentAbilities.append($li);
  });

  types.map((type) => {
    const {
      type: { name },
    } = type;

    const $li = d.createElement("li");
    $li.classList.add("pokemon-body-type");
    $li.textContent = name;
    $fragmentTypes.append($li);
  });

  types.map((type) => {
    const {
      type: { name },
    } = type;

    const $li = d.createElement("li");
    $li.textContent = name;
    $fragmentTypesFlip.append($li);
  });

  $cloneCard.querySelector(".pokemon-body-types").append($fragmentTypes);
  $cloneCard.querySelector(".flip-card-hero-types").append($fragmentTypesFlip);
  $cloneCard.querySelector(".flip-card-slider-aboutme-gender-list").append($fragmentAbilities);

  const $templateStat = d.getElementById("template-card-slider-stat").content;
  const $fragmentStat = d.createDocumentFragment();

  let acumTotal = 0;
  stats.map((stat) => {
    const {
      base_stat,
      stat: { name },
    } = stat;

    acumTotal += parseInt(base_stat);
    let $clone = $templateStat.cloneNode(true);
    $clone.querySelector("h4").textContent = base_stat;
    $clone.querySelector("span").textContent = name.includes("special") ? name.replace("special", "sp") : name;
    $fragmentStat.append($clone);
  });

  $cloneCard.querySelector(".flip-card-slider-stats").append($fragmentStat);
  $cloneCard.querySelectorAll(".flip-card-slider-stat .bar").forEach((bar) => {
    const $base_stat = parseInt(bar.closest("div").previousElementSibling.querySelector("h4").textContent);
    const WIDTH_STAT = 152;
    let resultBase = (acumTotal / 6) * 2;
    let widthFinal = WIDTH_STAT - resultBase;
    bar.style.width = `${widthFinal + $base_stat}px`;
  });
  fragment.append($cloneCard);
};

const removeChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const formattedId = (id) => "#" + `00${id}`.slice(-3);

d.addEventListener("click", (e) => {
  if (e.target.matches("#prev")) {
    if (offset !== 1 && isActiveTypePokemon) {
      offset -= 6;
      removeChildNodes(d.querySelector(".pokemon-cards"));
      getDataPokemon();
    } else {
      typePokemonFound = 0;
      let $typePokemon = d.getElementById("form-pokemon").querySelector(".custom-options .custom-option.selected > span").textContent;

      if (arrayOfTypePokemons.length > 0 && countBtnClicked > 0) {
        countBtnClicked--;
        valueIDInitial = arrayOfTypePokemons[countBtnClicked];
        removeChildNodes(d.querySelector(".pokemon-cards"));
        getDataPokemon($typePokemon);
      }
    }
  }

  if (e.target.matches("#next")) {
    if (offset <= QUANTITY_OF_POKEMONS && isActiveTypePokemon) {
      offset += 6;
      removeChildNodes(d.querySelector(".pokemon-cards"));
      getDataPokemon();
    } else {
      typePokemonFound = 0;
      countBtnClicked++;
      activeBtnPrev = true;
      let $typePokemon = d.getElementById("form-pokemon").querySelector(".custom-options .custom-option.selected > span").textContent;
      removeChildNodes(d.querySelector(".pokemon-cards"));
      getDataPokemon($typePokemon);
    }
  }
  //Aplies for the hearts front and reverse Card
  if (e.target.matches(".pokemon-card .flip-card-header-favorite-heart")) {
    e.target.classList.toggle("is-active");
    const $heartReverse = e.target.closest(".pokemon-card").nextElementSibling.querySelector(".flip-card-header-favorite-heart");
    $heartReverse.classList.toggle("is-active");
  }
  //Aplies for the hearts front and reverse Card
  if (e.target.matches(".flip-card .flip-card-header-favorite-heart")) {
    e.target.classList.toggle("is-active");
    const $heartFront = e.target.closest(".flip-card").previousElementSibling.querySelector(".flip-card-header-favorite-heart");
    $heartFront.classList.toggle("is-active");
  }

  //Seleccionar combo y capturar texto
  if (e.target.matches("custom-options") || e.target.matches(".custom-options *")) {
    const $typePokemon = e.target.querySelector(".custom-option > span").textContent;
    valueIDInitial = 1;
    typePokemonFound = 0;
    countBtnClicked = 0;
    arrayAuxOfTypePokemons.length = 0;
    arrayOfTypePokemons.length = 0;
    activeBtnPrev = true;
    removeChildNodes(d.querySelector(".pokemon-cards"));
    getDataPokemon($typePokemon);
  }
});

export default getDataPokemon;
