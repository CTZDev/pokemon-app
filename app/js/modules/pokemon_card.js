const d = document;
let offset = 1;
let limit = 8;

const getDataPokemon = async () => {
  try {
    const $fragment = d.createDocumentFragment();
    const $fragmentCardReverse = d.createDocumentFragment();
    const $cards = d.querySelector(".pokemon-cards");
    const $spinner = d.getElementById("spinner");
    $spinner.style.display = "grid";

    for (let i = offset; i <= offset + limit; i++) {
      let urlDataPokemon = `https://pokeapi.co/api/v2/pokemon/${i}/`;
      let urlSpeciesPokemon = `https://pokeapi.co/api/v2/pokemon-species/${i}/`;

      const responses = await Promise.all([fetch(urlDataPokemon), fetch(urlSpeciesPokemon)]);

      const [responseDataPokemon, responseSpeciesPokemon] = responses;
      if (!responseDataPokemon.ok || !responseSpeciesPokemon.ok) throw { status: response.status, statusText: response.statusText };
      //First request
      const dataPokemon = await responseDataPokemon.json();
      //Second request
      const speciesPokemon = await responseSpeciesPokemon.json();
      drawCardPokemon(dataPokemon, speciesPokemon, i, $fragment);
      drawCardReverse(dataPokemon, speciesPokemon, i, $fragmentCardReverse);
    }

    $cards.append($fragment);
    $spinner.style.display = "none";
  } catch (error) {
    let message = error.statusText || "Ocurrio un error inesperado";
    console.log(error);
    alert(`Error ${error.status} : ${message}`);
  }
};

const drawCardPokemon = (data, species, id, fragment) => {
  const {
    name,
    sprites: {
      other: {
        dream_world: { front_default },
      },
    },
    types,
  } = data;

  const $template = d.getElementById("template-pokemon-card").content;
  const $fragmentTypes = d.createDocumentFragment();
  let $clone = $template.cloneNode(true);

  let colorPokemon = species?.color?.name;
  if (colorPokemon === "white") colorPokemon = "black";
  const $cardStyle = $clone.querySelector(".pokemon-card").style;
  const $buttonBackground = $clone.querySelector(".pokemon-footer > .btn");

  $clone.querySelector(".pokemon-header-title").textContent = formattedId(id);
  $clone.querySelector(".pokemon-body-name > p").textContent = name;
  $clone.querySelector(".pokemon-header-img > img").setAttribute("src", front_default);
  $clone.querySelector(".pokemon-header-img > img").setAttribute("alt", name);
  $clone.querySelector(".pokemon-card").dataset.id = formattedId(id);

  //Assign color of the pokemon
  $cardStyle.setProperty("--background", colorPokemon);
  $buttonBackground.style.backgroundColor = colorPokemon;

  types.map((type) => {
    const {
      type: { name },
    } = type;
    const $li = d.createElement("li");
    $li.classList.add("pokemon-body-type");
    $li.textContent = name;
    $fragmentTypes.append($li);
  });

  $clone.querySelector(".pokemon-body-types").append($fragmentTypes);
  // drawCardReverse($clone);
  fragment.append($clone);
};

const removeChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const drawCardReverse = (data, species, id, fragment) => {
  const {
    abilities,
    name,
    sprites: { front_default },
    types,
    height,
    weight,
    stats,
  } = data;

  const { flavor_text_entries } = species;

  const $template = d.getElementById("template-pokemon-cardReverse").content;
  const $fragmentTypes = d.createDocumentFragment();
  const $fragmentAbilities = d.createDocumentFragment();
  let $clone = $template.cloneNode(true);

  $clone.querySelector(".flip-card-hero-header > h2").textContent = name;
  $clone.querySelector(".flip-card-hero-header > h3").textContent = formattedId(id);
  $clone.querySelector(".flip-card-hero-img > img").setAttribute("src", front_default);
  $clone.querySelector(".flip-card-hero-img > img").setAttribute("alt", name);
  $clone.querySelector(".flip-card-slider-aboutme-text").textContent = flavor_text_entries[7]["flavor_text"];
  $clone.querySelector(".flip-card-slider-aboutme-measure-height > p").textContent = `${height} dm`;
  $clone.querySelector(".flip-card-slider-aboutme-measure-weight > p").textContent = `${weight} hg`;

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
    $li.textContent = name;
    $fragmentTypes.append($li);
  });

  $clone.querySelector(".flip-card-hero-type").append($fragmentTypes);
  $clone.querySelector(".flip-card-slider-aboutme-gender-list").append($fragmentAbilities);

  const $templateStat = d.getElementById("template-card-slider-stat").content;
  const $fragmentStat = d.createDocumentFragment();

  stats.map((stat) => {
    const {
      base_stat,
      stat: { name },
    } = stat;
    let $clone = $templateStat.cloneNode(true);
    $clone.querySelector("h4").textContent = base_stat;
    $clone.querySelector("span").textContent = name;
    $fragmentStat.append($clone);
  });

  $clone.querySelector(".flip-card-slider-stats").append($fragmentStat);
  console.log($clone);
};

const formattedId = (id) => "#" + `00${id}`.slice(-3);

d.addEventListener("click", (e) => {
  if (e.target.matches("#prev")) {
    if (offset !== 1) {
      offset -= 9;
      removeChildNodes(d.querySelector(".pokemon-cards"));
      getDataPokemon();
    }
  }

  if (e.target.matches("#next")) {
    if (offset <= 898) {
      offset += 9;
      removeChildNodes(d.querySelector(".pokemon-cards"));
      getDataPokemon();
    }
  }

  if (e.target.matches(".btn-info")) {
    const $cardContainer = e.target.closest(".flip-card-container");
    d.querySelectorAll(".flip-card-container").forEach((card) => card.classList.remove("is-active"));
    $cardContainer.classList.add("is-active");
  }
});

export default getDataPokemon;
