import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeticionService } from './peticion.service';
import { Pokemon } from './pokemon';

/**
 * Componente principal de la aplicación.
 * Permite buscar Pokémon por nombre o id, y navegar entre ellos.
 */
@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-peticiones-api';
  searchTerm: string = '';
  pokemon: Pokemon | null = null;
  noResults: boolean = false;

  /**
   * Navega al siguiente Pokémon (aumenta el id).
   * Si ya es el último Pokémon (id 1025), vuelve al primero.
   */
  nextPokemon() {
    this.searchTerm =
      this.pokemon == null || this.pokemon.id == 1025
        ? '1'
        : (this.pokemon.id + 1).toString();
    this.searchPokemon();
  }

  /**
   * Navega al Pokémon anterior (disminuye el id).
   * Si ya es el primer Pokémon (id 1), va al último (id 1025).
   */
  beforePokemon() {
    this.searchTerm =
      this.pokemon == null || this.pokemon.id == 1
        ? '1025'
        : (this.pokemon.id - 1).toString();
    this.searchPokemon();
  }

  /**
   * Agrega un número al término de búsqueda y realiza la búsqueda.
   * Si el id supera el límite de 1025, se establece como 1025.
   *
   * @param num Número a agregar al término de búsqueda.
   */
  addNumber(num: number) {
    this.searchTerm += num;
    if (Number(this.searchTerm) > 1025) {
      this.searchTerm = '1025';
    }
    this.searchPokemon();
  }

  /**
   * Borra el campo de búsqueda y realiza la búsqueda.
   */
  clearSearch() {
    this.searchTerm = '';
    this.searchPokemon();
  }

  constructor(private peticionService: PeticionService) {}

  ngOnInit(): void {
    this.searchPokemon();
  }

  /**
   * Realiza la búsqueda de un Pokémon en la API y actualiza los resultados.
   */
  async searchPokemon() {
    console.log('Buscando Pokémon con el término:', this.searchTerm);
    if (this.searchTerm.trim() !== '') {
      const results = await this.peticionService.searchPokemon(this.searchTerm);

      if (results) {
        this.pokemon = results;
        this.noResults = false;
      } else {
        this.pokemon = null;
        this.noResults = true;
      }
    } else {
      this.pokemon = null;
      this.noResults = false;
    }
  }
}
