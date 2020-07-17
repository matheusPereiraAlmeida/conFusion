import { Component, OnInit, Inject } from '@angular/core';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  leaders: Leader[];
  base_url: string =  environment.BASE_URL ;

  constructor(private leaderService: LeaderService) { }

  ngOnInit() {
    /*
    this.leaderService.getLeaders()
    .then(leader => this.leaders = leader); 
    */
    this.leaderService.getLeaders().subscribe(leader => this.leaders = leader);

  }

}
