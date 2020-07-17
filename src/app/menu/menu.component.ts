import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  base_url: string =  environment.BASE_URL ;
  errMess: string;

  constructor(private dishService: DishService) {}

  ngOnInit() {
    /*
    this.dishService.getDishes()
    .then(dishes => this.dishes = dishes);  }
    */
   this.dishService.getDishes()
   .subscribe(dishes => this.dishes = dishes,
     errmess => this.errMess = <any>errmess);  }
}
