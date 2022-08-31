const d = document;
const $fragment = d.createDocumentFragment();

const getTypePokemon = async () => {
  try {
    let url = "https://pokeapi.co/api/v2/type?limit=18";
    const response = await fetch(url);
    if (!response.ok) throw { status: response.status, statusText: response.statusText };
    const data = await response.json();
    const typesOfPokemon = await data.results;
    showTypePokemon(typesOfPokemon);
  } catch (error) {
    let message = error.statusText || "Ocurrio un error inesperado";
    alert(`Error ${error.status} : ${message}`);
  }
};

const showTypePokemon = (typesOfPokemon) => {
  const $containerTypeOfPokemon = d.querySelector("ul[data-custom-types]");

  const $li = d.createElement("li");
  const $span = d.createElement("span");
  const $img = d.createElement("img");
  $li.classList.add("custom-option", "selected");
  $span.textContent = "Mostrar todos";
  $img.setAttribute("src", `./images/type-pokemons/Icon_Mostrar todos.png`);
  $img.setAttribute("alt", "Mostrar todos");
  $li.append($img, $span);
  $li.dataset.value = "Mostrar todos";
  $fragment.append($li);

  typesOfPokemon.map(({ name }) => {
    const $li = d.createElement("li");
    const $span = d.createElement("span");
    const $img = d.createElement("img");
    $span.textContent = changeTextCapitalized(name);
    $img.setAttribute("src", `./images/type-pokemons/Icon_${name.toLowerCase()}.png`);
    $img.setAttribute("alt", name);
    $li.append($img, $span);
    $li.classList.add("custom-option");
    $li.dataset.value = name;
    $fragment.append($li);
  });

  $containerTypeOfPokemon.append($fragment);
  selectedMenuPokemon({ name: "Mostrar todos" });
};

const selectedMenuPokemon = (firstTypePokemon) => {
  const wrapper = ".select-wrapper";
  loadingTypePokemon(firstTypePokemon);

  d.addEventListener("click", (e) => {
    if (e.target.matches(`${wrapper} *`)) {
      const $selected = e.target.closest(".select");
      $selected.classList.toggle("open");
    }

    if (e.target.matches(".custom-option")) {
      const $option = e.target;
      const $listOptions = $option.parentElement.children;
      const $parentOption = $option.closest(".select");

      [...$listOptions].map((option) => option.classList.remove("selected"));
      $option.classList.add("selected");
      const $textOption = $option.querySelector("span").textContent;
      loadingTypePokemon(null, $parentOption, $textOption);
    }

    if (!e.target.matches(`${wrapper} *`)) {
      const $select = d.querySelector(".select");
      if ($select.classList.contains("open")) {
        $select.classList.remove("open");
      }
    }
  });
};

const loadingTypePokemon = (firstTypePokemon = null, parentElement = d, textOption = null) => {
  const $selectTypePokemon = parentElement.querySelector(".select-trigger-content > span");
  const $selectTypePokemonIcon = parentElement.querySelector(".select-trigger-content > img");

  const nameTypePokemon = firstTypePokemon?.name || textOption;
  $selectTypePokemon.textContent = changeTextCapitalized(nameTypePokemon);
  $selectTypePokemonIcon.setAttribute("src", `./images/type-pokemons/Icon_${nameTypePokemon.toLowerCase()}.png`);
  $selectTypePokemonIcon.setAttribute("alt", nameTypePokemon);
};

const changeTextCapitalized = (text) => {
  const capitalizeText = text.charAt(0).toUpperCase();
  const restText = text.slice(1);
  return capitalizeText.concat(restText);
};

export default getTypePokemon;
