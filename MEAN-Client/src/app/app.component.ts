import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'web-app';
  isLoginOrRegisterPage: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialize Flowbite when the app starts
    initFlowbite();
  }

  // Check if the current URL is either '/login' or '/register'
  isLoginOrRegister(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }
}
