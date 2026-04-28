
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ValidationTypes } from '@app/shared/utils/global-constants.util';
import { ToUpperCaseDirective } from '@shared/directives/to-upper-case.directive';
import { GenericValidators } from '@shared/utils/generic-validators.util';

@Component({
  standalone: true,
  selector: 'gs-text',
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    ToUpperCaseDirective
],
  templateUrl: './gs-text.component.html',
})
export class GsTextComponent implements OnInit, OnChanges {
  @Input() inputControl: FormControl | any = new FormControl(null);
  @Input() label: string = 'Input';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() onlyText?: boolean = false;
  @Input() mode!: 'create' | 'read' | 'update';
  @Input() isLoading: boolean = false;
  @Input() withLabel: boolean = true;
  @Input() maxLength: number = 100;
  @Input() prefix_suffix: { label: string; mode: 'prefix' | 'suffix' } = {
    label: '',
    mode: 'prefix',
  };
  @Input() validatorType: string = '';
  validator: any = [];

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    for (let property in changes) {
      if (property === 'mode') {
        this.initMode();
      }

      if (property === 'required') {
        this.setValidators();
      }
    }
  }

  ngOnInit(): void {
    this.initMode();
    this.setOneError();
  }

  private initMode() {
    this.setValidators();
    switch (this.mode) {
      case 'create':
        this.inputControl.enable();
        break;
      case 'read':
        this.inputControl.disable();
        break;
      case 'update':
        if (this.inputControl.value != null) this.inputControl.enable();
        break;
      default:
        break;
    }
  }

  setOneError() {
    this.inputControl.valueChanges.subscribe(() => {
      if (this.inputControl.errors) {
        let claves = Object.keys(this.inputControl.errors);
        let clave: string = claves[0];
        let error: any = {};
        error[clave] = this.inputControl.errors[clave];
        this.inputControl.setErrors(error);
      } else {
        this.inputControl.setErrors(null);
      }
    });
  }

  get placeholderValue() {
    return this.mode !== 'read' ? this.placeholder : '';
  }

  setValidators() {
    this.validator = [];
    this.validator.push(Validators.minLength(2));
    this.validator.push(Validators.maxLength(this.maxLength));

    if (this.required) {
      this.validator.push(Validators.required);
      this.validator.push(GenericValidators.notOnlyWhitespaceValidator);
    }

    if (this.onlyText) {
      this.validator.push(GenericValidators.onlyTextOrSpaceValidator);
    }
    if (this.validatorType === ValidationTypes.RUC) {
      this.validator.push(GenericValidators.rucNumberValidator);
    }
    if (this.validatorType === ValidationTypes.SOLO_NUMEROS) {
      this.validator.push(GenericValidators.onlyNumberValidator);
    }
    this.inputControl.setValidators(this.validator);
    this.inputControl.updateValueAndValidity();
  }
}
