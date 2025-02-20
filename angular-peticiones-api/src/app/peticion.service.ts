import { Injectable } from '@angular/core';
import { Porquemon } from './porquemon';
@Injectable({
  providedIn: 'root',
})
export class peticionService {
  url = 'https://pokeapi.co/api/v2/pokemon';

  // Método para obtener los detalles adicionales de un Pokémon
  async getPokemonDetails(url: string): Promise<any> {
    const response = await fetch(url);
    return await response.json();
  }

  // Método para buscar un Pokémon por nombre o id
  async searchPokemon(searchTerm: string): Promise<Porquemon | null> {
    const searchUrl = `${this.url}/${searchTerm.toLowerCase()}`; // Construir URL para buscar por nombre o id
    try {
      const response = await fetch(searchUrl);
      if (response.ok) {
        const data = await response.json();

        // // Obtener los detalles adicionales del Pokémon (Descripción)
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${data.id}`;
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();

        // Buscar el "genus" (tipo corto del Pokémon, como "The Duck Pokémon")
        const genus =
          speciesData.genera.find((entry: any) => entry.language.name === 'es')
            ?.genus || 'Tipo no disponible';

        const description =
          speciesData.flavor_text_entries.find(
            (entry: any) => entry.language.name === 'es'
          )?.flavor_text || 'Descripción no disponible';

        // Crear el objeto Pokémon con los datos obtenidos
        const pokemonInstance: Porquemon = {
          name: data.name,
          id: data.id,
          image: data.sprites.front_default,
          type: data.types[0].type.name,
          weight: data.weight,
          height: data.height,
          genus: genus,
          description: description,
        };

        // Devolver la instancia del Pokémon
        return pokemonInstance;
      } else {
        // Si no se encuentra el Pokémon, devolver null
        return null;
      }
    } catch (error) {
      console.error('Error al buscar el Pokémon:', error);
      return null;
    }
  }
  // private async searchDetails(){
  //     // Obtener los detalles adicionales del Pokémon (Descripción)
  //     const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${data.id}`;
  //     const speciesResponse = await fetch(speciesUrl);
  //     const speciesData = await speciesResponse.json();

  //     // Buscar el "genus" (tipo corto del Pokémon, como "The Duck Pokémon")
  //     const genus =
  //       speciesData.genera.find((entry: any) => entry.language.name === 'es')
  //         ?.genus || 'Tipo no disponible';

  //     const description =
  //       speciesData.flavor_text_entries.find(
  //         (entry: any) => entry.language.name === 'es'
  //       )?.flavor_text || 'Descripción no disponible';
  // }
}
