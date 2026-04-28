import { Component, inject } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  standalone: true,
  selector: 'app-spinner',
  imports: [NgxSpinnerModule],
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {
  private spinner = inject(NgxSpinnerService);

  showSpinner() {
    this.spinner.show('spinnerxxx');
  }

  hideSpinner() {
    this.spinner.hide('spinnerxxx');
  }
}
