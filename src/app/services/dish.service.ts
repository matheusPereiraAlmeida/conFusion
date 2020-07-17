import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ProcessHTTPMsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient, private processHTTPMsgService: ProcessHTTPMsgService) { }

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(environment.BASE_URL + 'dishes')
    .pipe(catchError(this.processHTTPMsgService.handleError));
    // return of(DISHES).pipe(delay(2000));
    /*return Promise.resolve(DISHES);
    return new Promise(resolve=> {
      // Simulate server latency with 2 second delay
        setTimeout(() => resolve(DISHES), 2000);
    });
    */
  }

  getDish(id: string): Observable<Dish> {
    return this.http.get<Dish>(environment.BASE_URL + 'dishes/' + id)
    .pipe(catchError(this.processHTTPMsgService.handleError));

    //return of(DISHES.filter((dish) => (dish.id === id))[0]).pipe(delay(2000));
    /*return Promise.resolve(DISHES.filter((dish) => (dish.id === id))[0]);
    return new Promise(resolve=> {
      // Simulate server latency with 2 second delay
        setTimeout(() => resolve(DISHES.filter((dish) => (dish.id === id))[0]), 2000);
    });
    */
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http.get<Dish[]>(environment.BASE_URL + 'dishes?featured=true').pipe(map(dishes => dishes[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError));

    //return of(DISHES.filter((dish) => dish.featured)[0]).pipe(delay(2000));
    /*return Promise.resolve(DISHES.filter((dish) => dish.featured)[0]);
    return  new Promise(resolve=> {
      // Simulate server latency with 2 second delay
        setTimeout(() => resolve(DISHES.filter((dish) => dish.featured)[0]), 2000);
    });
    */
  }

  getDishIds(): Observable<string[] | any> {
    return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id)))
    .pipe(catchError(error => error));

    //return of(DISHES.map(dish => dish.id ));
  }
  putDish(dish: Dish): Observable<Dish> {
    return this.http.put<Dish>(environment.BASE_URL  + 'dishes/' + dish.id, dish);
  }
}
