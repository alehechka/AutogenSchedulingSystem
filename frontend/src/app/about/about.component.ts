import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'About',
  templateUrl: "./about-template.html",
  styleUrls: ['about.component.css'],
})

export class AboutComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
