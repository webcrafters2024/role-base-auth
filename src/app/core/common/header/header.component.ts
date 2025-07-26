import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../../../components/login/login.component';
import { LoginService } from '../../service/login.service';
import { CommonService } from '../../service/common.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  userRole: string = ""

  constructor(
    private loginService: LoginService,
    private common: CommonService) {
  }

  ngOnInit(): void {
    this.userRole = this.loginService.getUserRole()
  }

  getRoleBasedMenu(userRole: string) {
    if (!userRole) {
      return []; // Return empty menu if userRole is null or undefined
    }
    return this.common.menu.filter((menu: any) => menu.role.includes(userRole.toUpperCase()));
  }

  logOut() {
    this.loginService.logOut()
  }
}
