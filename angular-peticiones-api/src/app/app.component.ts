import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeticionService } from './peticion.service';
import { Pokemon } from './pokemon';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'angular-peticiones-api';
  searchTerm = '';
  pokemon: Pokemon | null = null;
  noResults = false;
  private readonly maxPokemonId = 1025;

  constructor(private peticionService: PeticionService) {}

  ngOnInit(): void {
    this.searchPokemon();
  }

  /**
   * Busca un Pokémon por nombre o ID.
   */
  async searchPokemon(): Promise<void> {
    const trimmedTerm = this.searchTerm.trim();
    console.log('Buscando Pokémon con el término:', trimmedTerm);

    if (!trimmedTerm) {
      this.resetSearch();
      return;
    }

    const results = await this.peticionService.searchPokemon(trimmedTerm);
    this.pokemon = results ?? null;
    this.noResults = !results;
  }

  /**
   * Reinicia la búsqueda, limpiando los resultados.
   */
  private resetSearch(): void {
    this.pokemon = null;
    this.noResults = false;
  }

  /**
   * Navega al siguiente Pokémon (aumenta el ID).
   */
  nextPokemon(): void {
    const nextId =
      this.pokemon?.id === this.maxPokemonId ? 1 : (this.pokemon?.id ?? 0) + 1;
    this.updateSearch(nextId);
  }

  /**
   * Navega al Pokémon anterior (disminuye el ID).
   */
  beforePokemon(): void {
    const prevId =
      this.pokemon?.id === 1 || !this.pokemon?.id
        ? this.maxPokemonId
        : (this.pokemon?.id ?? this.maxPokemonId) - 1;
    this.updateSearch(prevId);
  }

  /**
   * Agrega un número al término de búsqueda y realiza la búsqueda.
   */
  addNumber(num: number): void {
    this.searchTerm += num;
    const searchId = Math.min(Number(this.searchTerm), this.maxPokemonId);
    this.updateSearch(searchId);
  }

  /**
   * Borra el campo de búsqueda y realiza la búsqueda.
   */
  clearSearch(): void {
    this.updateSearch('');
  }

  /**
   * Actualiza el término de búsqueda y realiza la búsqueda.
   */
  private updateSearch(value: string | number): void {
    this.searchTerm = value.toString();
    this.searchPokemon();
  }

  changeShinyVersion() {
    this.peticionService.changeShinyVersion();
    this.searchPokemon();
  }
  get isShiny(): boolean{
    return this.peticionService.isShiny;
  }
}
