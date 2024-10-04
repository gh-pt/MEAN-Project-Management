import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'web-app';

  constructor(private router: Router) { }

  isLoginOrRegister(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }
  ngOnInit(): void {
    initFlowbite();
  }
}