import getDataPokemon from "./modules/pokemon_card.js";
import selectedMenu from "./modules/combo_selected";

document.addEventListener("DOMContentLoaded", (e) => {
  selectedMenu();
  getDataPokemon();
});
