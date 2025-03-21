import { Component } from '@angular/core';
import { ApiService } from '../../core/service/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


    products:any =[]

  constructor(
    private apiService: ApiService,

  ) {


  }

  ngOnInit(): void {
    this.getData()
  }

  getData(){
    this.apiService.apiGet('api/product').subscribe((res)=>{
      if(res.success){
      this.products = res.products
      }
    })
  }


}
