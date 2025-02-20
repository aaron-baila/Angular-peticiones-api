import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Porquemon } from './porquemon';
import { PeticionService } from './peticion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-peticiones-api';
  searchTerm: string = ''; // Término de búsqueda inicial
  pokemon: Porquemon | null = null; // Pokémon encontrado, inicializado como null
  noResults: boolean = false; // Indica si no se encuentran resultados

  nextPokemon() {
    if (this.pokemon == null || this.pokemon.id == 1025) {
      this.searchTerm = '1';
    } else {
      const numeroPokemonActual: number = this.pokemon.id + 1;
      this.searchTerm = numeroPokemonActual.toString();
    }
    this.searchPokemon();
  }

  beforePokemon() {
    if (this.pokemon == null || this.pokemon.id == 1) {
      this.searchTerm = '1025';
    } else {
      const numeroPokemonActual: number = this.pokemon.id - 1;
      this.searchTerm = numeroPokemonActual.toString();
    }
    this.searchPokemon();
  }

  addNumber(num: number) {
    this.searchTerm += num; // Agrega el número al campo de búsqueda
    const idPokemon = Number(this.searchTerm);
    if (idPokemon > 1025) {
      this.searchTerm = '1025';
    }

    this.searchPokemon();
  }

  clearSearch() {
    this.searchTerm = ''; // Borra el campo de búsqueda
    this.searchPokemon();
  }

  constructor(private peticionService: PeticionService) {}

  ngOnInit(): void {
    this.searchPokemon(); // Llamar al método de búsqueda cuando se inicializa el componente
  }

  // Método para realizar la búsqueda en la API
  async searchPokemon() {
    console.log('Buscando Pokémon con el término:', this.searchTerm);
    if (this.searchTerm.trim() !== '') {
      const results = await this.peticionService.searchPokemon(this.searchTerm);

      if (results) {
        this.pokemon = results; // Si hay resultados, asignamos el Pokémon encontrado
        this.noResults = false; // No hay error de resultados
      } else {
        this.pokemon = null; // Si no se encuentra un Pokémon, asignamos null
        this.noResults = true; // Establecemos que no hubo resultados
      }
    } else {
      this.pokemon = null; // Si no hay término de búsqueda, no mostramos ningún Pokémon
      this.noResults = false; // No hay error, solo no hay búsqueda
    }
  }
}
