import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap, pluck } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PokemonData, Type } from '../interfaces/pokemon.interface';
import { PokemonTypeData } from '../interfaces/pokemon.types.interface';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private _http: HttpClient) { }

  getPokemonApiUrl(useLastVersion: boolean): string {
    return useLastVersion ? environment.baseUrlV2 : environment.baseUrlV1;
  }

  fullUrl(pokemonName: string): string {
    return `${this.getPokemonApiUrl(true)}/${pokemonName}`;
  }

  getPokemonData(pokemonName: string): Observable<PokemonTypeData> {
    return this._http.get<PokemonData>(this.fullUrl(pokemonName)).pipe(
      catchError<PokemonData, Observable<never>>(() => throwError(
        'Error occured trying to retrieve Pokemon Data. Check the name typed.')
      ),
      pluck<PokemonData, Type[]>('types'),
      mergeMap<Type[], Observable<PokemonTypeData>>((result: Type[]) => {
        return concat(...result.map((item: Type) => {
          return this.getPokemonNamesByPokemonTypes(item.type.url);
        }))
      })
    );
  }

  getPokemonNamesByPokemonTypes(url: string): Observable<PokemonTypeData> {
    return this._http.get<PokemonTypeData>(url).pipe(
      catchError<PokemonTypeData, Observable<never>>(() => of())
    );
  }
}
