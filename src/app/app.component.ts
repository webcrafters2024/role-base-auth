import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/common/header/header.component";
import { FooterComponent } from "./core/common/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  title = 'role-based-auth';

  currentUrl: string = "";

  constructor(private router : Router,){

  }
  
  
  ngOnInit(): void {

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.currentUrl = ev.url;
      }
    })



  
 
    
  }


}
