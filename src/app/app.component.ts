import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  Observable,
  Subject,
  Subscription,
  switchMap,
  throwError,
} from 'rxjs';
import { MockDataService } from './mock-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  searchTermByCharacters = new Subject<string>();
  charactersResults$!: Observable<any>;
  planetAndCharactersResults$!: Observable<any>;
  isLoading: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.initLoadingState();
    this.initCharacterEvents();
  }

  changeCharactersInput(element: any): void {
    // 1.1. Add functionality to changeCharactersInput method. Changes searchTermByCharacters Subject value on input change.
    const inputValue: string = element.target.value;
    // YOUR CODE STARTS HERE
    this.searchTermByCharacters.next(inputValue);
    // YOUR CODE ENDS HERE
  }

  initCharacterEvents(): void {
    // 1.2. Add API call on each user input. Use mockDataService.getCharacters - to make get request.

    // 2. Since we don't want to spam our service add filter by input value and do not call API until a user enters at least 3 chars.

    // 3. Add debounce to prevent API calls until user stop typing.

    this.charactersResults$ = this.searchTermByCharacters.pipe(
      // YOUR CODE STARTS HERE
      debounceTime(300),
      distinctUntilChanged(),
      filter(inputValue => inputValue.length >= 3),
      switchMap(inputValue => this.mockDataService.getCharacters(inputValue))
    );
    // YOUR CODE ENDS HERE
  }

  loadCharactersAndPlanet(): void {
    // 4. On clicking the button 'Load Characters And Planets', it is necessary to process two requests and combine the results of both requests into one result array. As a result, a list with the names of the characters and the names of the planets is displayed on the screen.
    // Your code should looks like this: this.planetAndCharactersResults$ = /* Your code */
    // YOUR CODE STARTS HERE
    const characters$ = this.mockDataService.getCharacters();
    const planets$ = this.mockDataService.getPlatents();

    this.planetAndCharactersResults$ = forkJoin([characters$, planets$]).pipe(
      map(([characters, planets]) => [...characters, ...planets]),
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(error);
      })
    );
    // YOUR CODE ENDS HERE
  }

  initLoadingState(): void {
    /* 5.1. Let's add loader logic to our page. For each request, we have an observable that contains the state of the request. When we send a request the value is true, when the request is completed, the value becomes false. You can get value data with mockDataService.getCharactersLoader() and mockDataService.getPlanetLoader().

    - Combine the value of each of the streams.
    - Subscribe to changes
    - Check the received value using the areAllValuesTrue function and pass them to the isLoading variable. */
    // YOUR CODE STARTS HERE
    const subscription = combineLatest(
      this.mockDataService.getCharactersLoader(),
      this.mockDataService.getPlanetLoader()
    ).subscribe(([charactersLoader, planetsLoader]) => {
      this.isLoading = this.areAllValuesTrue([charactersLoader, planetsLoader]);
    });

    this.subscriptions.push(subscription);
    // YOUR CODE ENDS HERE
  }

  ngOnDestroy(): void {
    // 5.2 Unsubscribe from all subscriptions
    // YOUR CODE STARTS HERE
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // YOUR CODE ENDS HERE
  }

  areAllValuesTrue(elements: boolean[]): boolean {
    return elements.every(el => el);
  }
}
