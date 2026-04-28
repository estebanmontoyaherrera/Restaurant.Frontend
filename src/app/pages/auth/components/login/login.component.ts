
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { SpinnerComponent } from '@shared/components/reusables/spinner/spinner.component';
import { BaseApiResponse } from '@shared/models/commons/base-api-response.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '@app/shared/services/alert.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatLabel,
    MatError,
    MatTooltip,
    MatIcon,
    FormsModule,
    MatInputModule,
    SpinnerComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cd = inject(ChangeDetectorRef);
  private spinner = inject(NgxSpinnerService);
  private readonly alertService = inject(AlertService);

  form!: FormGroup;
  inputType = 'password';
  visible = false;

  icVisibility = 'visibility';
  icVisibilityOff = 'visibility_off';
  icUsername = 'account_circle';

  initForm(): void {
    this.form = this.fb.group({
      email: ['admin@gmail.com', [Validators.required]],
      password: ['12345', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  login(): void {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }
    this.spinner.show('spinnerxxx');
    this.authService
      .login(this.form.value)
      .subscribe((response: BaseApiResponse<string>) => {
        if (response.isSuccess) {
          this.router.navigate(['/']);
          this.spinner.hide('spinnerxxx');
        } else {
          this.alertService.warn('Atención', response.message);
          this.spinner.hide('spinnerxxx');
        }
      });
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
