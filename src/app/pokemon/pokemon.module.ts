import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonComponent } from './pokemon.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [PokemonComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [PokemonComponent]
})
export class PokemonModule { }
