//Codigo para la traspilación de funciones asincronas
import "core-js/stable";
import "regenerator-runtime/runtime";
//Generación de codigo propio
import getDataPokemon from "./modules/pokemon_card.js";
import getTypePokemon from "./modules/combo_selected.js";
import sliderGlobalInfo from "./modules/slider_card.js";

document.addEventListener("DOMContentLoaded", (e) => {
  getDataPokemon();
  getTypePokemon();
});

sliderGlobalInfo();
