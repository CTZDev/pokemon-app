const d = document;
const $fragment = d.createDocumentFragment();

const getTypePokemon = async (e) => {
  try {
    let url = "https://pokeapi.co/api/v2/type";
    const response = await fetch(url);
    if (!response.ok) throw { status: response.status, statusText: response.statusText };
    const data = await response.json();
    const typesOfPokemon = await data.results;
    showTypePokemon(typesOfPokemon);
    console.log(data.results);
  } catch (error) {
    console.log(error);
  }
};

const showTypePokemon = (typesOfPokemon) => {
  const $containerTypeOfPokemon = d.querySelector("ul[data-custom-types]");
  typesOfPokemon.map(({ name }, i) => {
    const $li = d.createElement("li");
    if (i === 0) $li.classList.add("custom-option", "selected");
    $li.textContent = changeTextCapitalized(name);
    $li.classList.add("custom-option");
    $li.dataset.value = name;
    $fragment.append($li);
  });
  $containerTypeOfPokemon.append($fragment);
  selectedMenu(typesOfPokemon[0]);
};

const selectedMenu = (firstTypePokemon) => {
  const wrapper = ".select-wrapper";
  const $selectTypePokemon = d.querySelector(".select-trigger > span");
  $selectTypePokemon.textContent = changeTextCapitalized(firstTypePokemon?.name);

  d.addEventListener("click", (e) => {
    if (e.target.matches(`${wrapper} *`)) {
      const $selected = e.target.closest(".select");
      $selected.classList.toggle("open");
    }

    if (e.target.matches(".custom-option")) {
      const $option = e.target;
      const $listOptions = $option.parentElement.children;
      const $parentOption = $option.closest(".select");
      const $customSelectText = $parentOption.querySelector(".select-trigger > span");

      [...$listOptions].map((option) => option.classList.remove("selected"));
      $option.classList.add("selected");
      $customSelectText.textContent = $option.textContent;
      console.log($option);
    }

    if (!e.target.matches(`${wrapper} *`)) {
      const $select = d.querySelector(".select");
      if ($select.classList.contains("open")) {
        $select.classList.remove("open");
      }
    }
  });
};

const changeTextCapitalized = (text) => {
  const capitalizeText = text.charAt(0).toUpperCase();
  const restText = text.slice(1);
  return capitalizeText.concat(restText);
};

export default getTypePokemon;
