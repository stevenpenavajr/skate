import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CartService } from './core/services/cart/cart.service';
import { ResponsiveService } from './shared/services/responsive/responsive.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'skate';

  constructor(
    private shoppingCartService: CartService,
    private responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.responsiveService.detectScreenSizeChange();
  }
}
