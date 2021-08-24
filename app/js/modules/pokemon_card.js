const d = document;

const getDataPokemon = async () => {
  try {
    let url = "https://pokeapi.co/api/v2/pokemon-form/1/";
    const response = await fetch(url);
    if (!response.ok) throw { status: response.status, statusText: response.statusText };
    const data = await response.json();
  } catch (error) {
    console.log(error);
  }
};

export default getDataPokemon;
