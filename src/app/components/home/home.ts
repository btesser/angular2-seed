import {Component} from '@angular/core';
import {PatientList} from '../patient-list/patient-list';

@Component({
  selector: 'home',
  templateUrl: 'app/components/home/home.html',
  styleUrls: ['app/components/home/home.css'],
  providers: [],
  directives: [PatientList],
  pipes: []
})
export class Home {

  constructor() {}

  ngOnInit() {

  }

}
