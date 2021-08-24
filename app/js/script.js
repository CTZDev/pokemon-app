//Codigo para la traspilación de funciones asincronas
import "core-js/stable";
import "regenerator-runtime/runtime";
//Generación de codigo propio
import getDataPokemon from "./modules/pokemon_card.js";
import getTypePokemon from "./modules/combo_selected.js";

document.addEventListener("DOMContentLoaded", (e) => {
  getDataPokemon();
  getTypePokemon();
});
