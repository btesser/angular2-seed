import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {RouteParams, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import * as _ from 'lodash';
let patientList = require('../../../data/patients.json');

enum SORT_DIRECTION {
  ASCENDING = 1,
  DESCENDING = -1
}
const DEFAULT_SORT_PROPERTY = 'age';

@Component({
  selector: 'patient-list',
  templateUrl: 'app/components/patient-list/patient-list.html',
  styleUrls: ['app/components/patient-list/patient-list.css'],
  providers: [],
  directives: [ ROUTER_DIRECTIVES ],
  pipes: []
})
export class PatientList {
  /**
   * Array of Patients
   */
  patients: Array<Patient> = [];
  /**
   * Path to use for sorting (in dot notation)
   */
  sortProperty: string = DEFAULT_SORT_PROPERTY;
  /**
   * Direction for sorting (ASC/DESC)
   */
  sortDirection: SORT_DIRECTION = SORT_DIRECTION.ASCENDING;
  constructor() {}

  ngOnInit() {
    this.patients = patientList.map(patient => new Patient(patient));
    this.patients = _.sortBy(this.patients, this.sortProperty);
  }
  
  /**
   * Sorts the list of patients by the given property
   */
  sortBy(property: string = DEFAULT_SORT_PROPERTY) {
    if (property === this.sortProperty) {
      this.sortDirection *= -1;
      this.patients = _.reverse(this.patients);
    } else {
      this.sortDirection = SORT_DIRECTION.ASCENDING;
      this.sortProperty = property;
      this.patients = _.sortBy(this.patients, this.sortProperty);
    }
  }
}


class Patient {
  static DEFAULT_HIGH_SYSTOLIC: number = 140;
  static DEFAULT_HIGH_DIASTOLIC: number = 90;
  fullName: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  age: number;
  bloodPressure: BloodPressure;
  highSystolicLimit: number = Patient.DEFAULT_HIGH_SYSTOLIC;
  highDiastolicLimit: number = Patient.DEFAULT_HIGH_DIASTOLIC;
  
  
  constructor({firstName, lastName, emailAddress, birthDate, latestBloodPressureDate, systolic, diastolic}: PatientJson) {
    this.fullName = `${firstName} ${lastName}`;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = emailAddress;
    this.birthDate = new Date(birthDate);
    this.age = this.getAgeFromBirthDate(this.birthDate);
    this.bloodPressure = {
      systolic,
      diastolic,
      date: latestBloodPressureDate && new Date(latestBloodPressureDate)
    };
  }
  
  hasHighBloodPressure() {
    const {systolic, diastolic} = this.bloodPressure;

    return systolic && diastolic &&
        this.hasHighSystolic() || this.hasHighDiastolic();
  }
  
  hasHighSystolic() {
    const {systolic} = this.bloodPressure;
    return systolic > this.highSystolicLimit;
  }

  hasHighDiastolic() {
    const {diastolic} = this.bloodPressure;
    return diastolic > this.highDiastolicLimit;
  }
  
  private getAgeFromBirthDate(birthDate: Date): number {
    const EPOCH_YEAR = 1970;
    const ageInMilliseconds = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageInMilliseconds);
    const age = Math.abs(ageDate.getUTCFullYear() - EPOCH_YEAR);
    
    if (age < 0 || isNaN(age)) {
      throw new Error('Invalid Date of Birth');
    }
    
    return age;
  }
}

interface BloodPressure {
  systolic: number;
  diastolic: number;
  date: Date;
}

interface PatientJson {
  firstName: string;
  lastName: string;
  emailAddress: string;
  birthDate: string;
  latestBloodPressureDate?: string;
  systolic?: number;
  diastolic?: number;
}