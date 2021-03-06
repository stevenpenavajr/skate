import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ShopItem } from 'src/app/core/models/ShopItem';
import { ErrorService } from '../error/error.service';
import { LogService } from '../log/log.service';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root',
})

/* -------------------------------------------------------------------------- */
/*                              FIRESTORE SERVICE                             */
/*                         INTERACTS WITH FIRESTORE DB                        */
/* -------------------------------------------------------------------------- */
export class FirestoreService {
  public allShopItems: Observable<ShopItem[]> | Observable<unknown[]> = of([]);

  constructor(
    private firestore: AngularFirestore,
    private log: LogService,
    private toast: ToastService,
    private error: ErrorService
  ) {
    /**
     * Tracks and live-updates firestore documents as they are inserted,
     * deleted, or modified
     */
    this.allShopItems = this.firestore
      .collection('decks', (ref) =>
        ref.orderBy('sold', 'asc').orderBy('id', 'desc')
      )
      .valueChanges({ idField: 'firebase_doc_id' })
      .pipe(catchError(this.error.handleError));
  }

  /**
   * Remove from cart and mark as sold in firestore.
   * @param itemStripeIds - stripe_id's for prices
   */
  markItemsAsSold(itemStripeIds: string[], items: ShopItem[]): void {
    itemStripeIds.forEach((stripeId) => {
      const firestoreId = items.find((i) => i.stripe_id === stripeId)
        ?.firebase_doc_id;

      if (!!firestoreId) {
        this.firestore
          .collection('decks')
          .doc('/' + firestoreId)
          .update({ sold: true })
          .then(() => {
            this.log.logDebug(
              `Updated firebase document ${firestoreId}, set sold = true`
            );
          })
          .catch((error) => {
            this.log.logError(
              'updating firebase document',
              'markItemsAsSold()'
            );
            console.log(error);
            this.toast.showError('Error updating product collection');
          });
      } else {
        this.log.logDebug(
          'Could not find firestore id from stripe id, no update was performed'
        );
      }
    });
  }
}
