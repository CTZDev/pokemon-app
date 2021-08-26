const d = document;
let offset = 1;
let limit = 8;

const getDataPokemon = async () => {
  try {
    const $fragment = d.createDocumentFragment();
    const $cards = d.querySelector(".pokemon-cards");
    const $spinner = d.getElementById("spinner");
    $spinner.style.display = "grid";

    for (let i = offset; i <= offset + limit; i++) {
      let urlDataPokemon = `https://pokeapi.co/api/v2/pokemon/${i}/`;
      let urlSpeciesPokemon = `https://pokeapi.co/api/v2/pokemon-species/${i}/`;
      const allPromisePokemon = Promise.all([fetch(urlDataPokemon), fetch(urlSpeciesPokemon)]);

      const responses = await allPromisePokemon;
      const [responseDataPokemon, responseSpeciesPokemon] = responses;
      if (!responseDataPokemon.ok || !responseSpeciesPokemon.ok) throw { status: response.status, statusText: response.statusText };

      //First request
      const dataPokemon = await responseDataPokemon.json();
      //Second request
      const speciesPokemon = await responseSpeciesPokemon.json();
      drawCardPokemon(dataPokemon, speciesPokemon, i, $fragment);
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
    $li.textContent = name;
    $fragmentTypes.append($li);
  });

  $clone.querySelector(".pokemon-body-types").append($fragmentTypes);
  drawCardReverse($clone);
  fragment.append($clone);
};

const formattedId = (id) => "#" + `00${id}`.slice(-3);

const removeChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const drawCardReverse = (clone) => {
  //Create Elements dynamics -
  const $flipCard = d.createElement("div");
  const $cardContainer = d.createElement("div");
  const $cards = d.querySelector(".pokemon-cards");
  $flipCard.classList.add("flip-card");
  $cardContainer.classList.add("card-container");
  $flipCard.append($cardContainer);

  const $cardBack = d.createElement("div");
  $cardBack.classList.add("pokemon-block-back");
  $cardBack.textContent = "Colocar contenido para la carta";
  $cardContainer.append($cardBack);
  $cardContainer.append(clone);
  $cards.append($flipCard);
};

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
    const $cardContainer = e.target.closest(".card-container");
    d.querySelectorAll(".card-container").forEach((card) => card.classList.remove("is-active"));
    $cardContainer.classList.add("is-active");
  }
});

export default getDataPokemon;
