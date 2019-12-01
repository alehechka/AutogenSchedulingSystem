import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'Home',
  templateUrl: "./home-template.html",
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
