import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PokemonService } from './services/pokemon.service';
import { Pokemon, PokemonType, PokemonTypeData } from './interfaces/pokemon.types.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: []
})
export class PokemonComponent implements OnDestroy {

    pokemonTypes: PokemonType[] = [];
    pokemonSubscription: Subscription = new Subscription();
    pokemonForm: FormGroup;

    constructor(
        private _fb: FormBuilder,
        private _pokemonService: PokemonService
    ) {
        this.pokemonForm = this._fb.group({
            pokemon: [null]
        });
        this.initForm();
    }
    
    ngOnDestroy(): void {
        this.pokemonSubscription.unsubscribe();
    }

    initForm(): void {
        this.pokemonForm.get('pokemon')?.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe((value: string) => {
            if (value) {
                this.loadPokemonData(value.trim());
            }
        });
    }

    loadPokemonData(nombrePokemon: string): void {
        this.pokemonSubscription = this._pokemonService.getPokemonData(nombrePokemon).subscribe((response: PokemonTypeData) => {
            if (response) {
                this.pokemonTypes.push({
                    type: response.name,
                    pokemons: response.pokemon.map((pokemon: Pokemon) => pokemon.pokemon.name)
                });
            }
        }, err => {
            this.pokemonTypes = [];
            console.log(err);
        });
    }
}
