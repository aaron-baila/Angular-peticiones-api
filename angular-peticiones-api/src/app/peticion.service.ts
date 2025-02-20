import { Injectable } from '@angular/core';
import { Porquemon } from './porquemon';

@Injectable({
  providedIn: 'root',
})
export class PeticionService {
  url = 'https://pokeapi.co/api/v2/pokemon';

  /**
   * Busca un Pokémon por nombre o ID y obtiene su información y descripción.
   * 
   * @param searchTerm Término de búsqueda (nombre o ID del Pokémon).
   * @returns Una promesa que resuelve en un objeto `Porquemon` o `null` si no se encuentra.
   */
  async searchPokemon(searchTerm: string): Promise<Porquemon | null> {
    const searchUrl = `${this.url}/${searchTerm.toLowerCase()}`;
    try {
      const response = await fetch(searchUrl);
      if (response.ok) {
        const data = await response.json();

        const speciesData = await this.getPokemonSpeciesData(data.id);

        const genus = this.getPokemonGenus(speciesData);
        const description = this.getPokemonDescription(speciesData);

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

        return pokemonInstance;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al buscar el Pokémon:', error);
      return null;
    }
  }

  /**
   * Obtiene los datos de la especie del Pokémon.
   * 
   * @param pokemonId ID del Pokémon cuyo detalle de especie se desea obtener.
   * @returns Los datos de la especie del Pokémon.
   */
  private async getPokemonSpeciesData(pokemonId: number): Promise<any> {
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    const speciesResponse = await fetch(speciesUrl);
    return await speciesResponse.json();
  }

  /**
   * Extrae el "genus" (tipo corto del Pokémon) de los datos de la especie.
   * 
   * @param speciesData Datos de la especie del Pokémon.
   * @returns El "genus" del Pokémon.
   */
  private getPokemonGenus(speciesData: any): string {
    return speciesData.genera.find((entry: any) => entry.language.name === 'es')?.genus || 'Tipo no disponible';
  }

  /**
   * Extrae la descripción del Pokémon de los datos de la especie.
   * 
   * @param speciesData Datos de la especie del Pokémon.
   * @returns La descripción del Pokémon.
   */
  private getPokemonDescription(speciesData: any): string {
    return speciesData.flavor_text_entries.find(
      (entry: any) => entry.language.name === 'es'
    )?.flavor_text || 'Descripción no disponible';
  }
}
