import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest } from 'rxjs';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';
import { ShopItem } from '../../models/ShopItem';
import { CartService } from '../../services/cart/cart.service';

@Component({
  templateUrl: './success-container.component.html',
  styleUrls: ['./success-container.component.scss'],
})

/* -------------------------------------------------------------------------- */
/*                                SUCCESS PAGE                                */
/* -------------------------------------------------------------------------- */
/*                        LOADED ON SUCCESSFUL PURCHASE                       */
/* -------------------------------------------------------------------------- */
export class SuccessContainerComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: FirestoreService,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    this.cart.emptyCart();

    /**
     * Mark items as sold as soon as component is activated
     * Must get past CanActivate guard first
     */
    combineLatest(
      this.activatedRoute.queryParams,
      this.firestore.allShopItems
    ).subscribe(([params, decks]: [Params, ShopItem[]]) => {
      let itemIdsToRemove = params['itemPurchased'];

      // params indexing returns a string if only one is present
      if (typeof itemIdsToRemove === 'string') {
        itemIdsToRemove = [itemIdsToRemove];
      }

      this.firestore.markItemsAsSold(itemIdsToRemove, decks);
    });
  }
}
