import { Component, OnInit, Input } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css'],
  providers: [DatePipe]
})

export class DishdetailComponent implements OnInit {

    dish: Dish;
    dishIds: string[];
    prev: string;
    next: string;
    dishdetailFeedbackForm: FormGroup;
    commment = new Comment();
    myDate = new Date(); 
    base_url: string =  environment.BASE_URL ;
    dishcopy: Dish;

    constructor(
      private dishservice: DishService,
      private route: ActivatedRoute,
      private location: Location,
      private fb: FormBuilder,
      private datePipe: DatePipe) { 
        //this.myDate = this.datePipe;
        this.createForm();
      }
      
  
      ngOnInit() {
       this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
       this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
       .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
      }
      
    goBack(): void {
      this.location.back();
    }
    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }
    onSubmit(){
      this.commment.author= this.dishdetailFeedbackForm.get('name').value;
      this.commment.comment= this.dishdetailFeedbackForm.get('message').value;
      this.commment.rating= this.dishdetailFeedbackForm.get('rating').value;
      this.commment.date = this.myDate.toISOString();
      
      this.dish.comments.push(this.commment);

      this.dishcopy.comments.push(this.commment);
      this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;console.log("FOI");
      });

      this.dishdetailFeedbackForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)] ],
        rating: ['', [Validators.required] ],
        message: ['', [Validators.required], Validators.minLength(2) ],
      });
    }

    createForm() {
      this.dishdetailFeedbackForm = this.fb.group({
        name: ['', Validators.required, Validators.minLength(2) ],
        rating: ['', Validators.required],
        message: ['', Validators.required, Validators.minLength(2) ]
      });

      this.dishdetailFeedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  
      this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
      if (!this.dishdetailFeedbackForm) { return; }
      const form = this.dishdetailFeedbackForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }


    formErrors = {
      'name': '',
      'rating': '',
      'message': ''
    };

    validationMessages = {
      'name': {
        'required':      'Name is required.',
        'minlength':     'First Name must be at least 2 characters long.'
      },
      'rating': {
        'required':      'Rating is required.'
      },
      'message': {
        'required':      'Message is required.'
      }
    };
}
