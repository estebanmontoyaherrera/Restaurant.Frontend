import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { scaleInOutAnimation } from '@shared/animations/scale-in-out.animation';
import { SelectResponse } from '@shared/models/core/selects-response.interface';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIcon,
    CommonModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './autocomplete.component.html',
  animations: [scaleInOutAnimation],
})
export class AutocompleteComponent implements OnInit, OnChanges {
  // Propiedades de entrada

  //control=va a representar mi inputControl para el autocomplete
  @Input() control: FormControl | any = new FormControl(null);
  //label=valor de nuestro texto en el autocomplete
  @Input() label: string = '';
  //placeholder=valor interno del autocomplete
  @Input() placeholder: string = '';
  //listOptions=listado para mostrar en el autocomplete
  @Input() listOptions?: SelectResponse[];
  //required=propiedad para saber si es requerido o no nuestro autocomplete
  @Input() required: boolean = false;
  //readonly=para solo lectura
  @Input() readonly: boolean = false;
  //opcionesfiltradas=para setear los filtros y obtener el resultado en esta propiedad
  opcionesfiltradas!: SelectResponse[];

  @Output() itemSelected = new EventEmitter<string>();
  selectedItem!: string;

  ngOnChanges(changes: SimpleChanges) {
    // Itera sobre cada propiedad que ha cambiado
    for (let property in changes) {
      // Verifica si la propiedad es "listOptions"
      if (property === 'listOptions') {
        // Verifica si el valor previo de "listOptions" no es indefinido
        if (changes.listOptions.previousValue !== undefined) {
          // Filtra las opciones y asigna el resultado a "opcionesfiltradas"
          this.opcionesfiltradas = this.filter('', this.listOptions!);
        }
        // Verifica si el valor actual de "listOptions" no es indefinido
        if (changes.listOptions.currentValue !== undefined) {
          // Filtra las opciones y asigna el resultado a "opcionesfiltradas"
          this.opcionesfiltradas = this.filter('', this.listOptions!);
          // Verifica si el valor actual de "listOptions" es un array vacío
          if (changes.listOptions.currentValue.length === 0) {
            // Reinicia el valor del control (FormControl)
            this.control.reset();
          }
        }
      }
    }
    this.initMode();
    // this.setValidators();
  }

  ngOnInit(): void {
    this.initMode();
  }

  onOptionSelected(event: any): void {
    if (this.listOptions) {
      const selectedItem = this.listOptions.find((item) => item.id === event);

      if (selectedItem) {
        this.itemSelected.emit(selectedItem.id);
      }
    }
  }

  private initMode() {
    // this.setValidators();
    // Inicializa "opcionesfiltradas" con las opciones actuales
    this.opcionesfiltradas = this.listOptions!;
    // Nos vamos a suscribir a los cambios en el valor del control
    this.control.valueChanges.subscribe((value: any) => {
      // Verifica si hay un valor en el control
      if (value) {
        // Filtra las opciones basándose en el valor y actualiza "opcionesfiltradas"
        this.opcionesfiltradas = this.filter(value, this.listOptions!);
      } else {
        // Si no hay valor, filtra con un valor vacío y actualiza "opcionesfiltradas"
        this.opcionesfiltradas = this.filter('', this.listOptions!);
      }
      // Verifica la opción seleccionada en el control
      this.checkOption(this.control.value, this.listOptions!);
    });

    // Habilita el control
    this.control.enable();
  }

  setValidators() {
    if (this.required) {
      this.control.setValidators([Validators.required]);
      this.control.updateValueAndValidity();
    } else {
      this.control.clearValidators();
      this.control.updateValueAndValidity();
    }
  }

  //Vamos a personalizar la visualización del valor seleccionado
  //en el input del autocomplete
  mostrarDropdrown(id: string): any {
    // Inicializa la variable para almacenar el valor seleccionado
    let selectValue = null;
    // Verifica si hay opciones y si hay un ID proporcionado
    if (this.listOptions && id) {
      // Busca la opción con el ID correspondiente en la lista de opciones
      let Opcion = this.listOptions.find((opcion) => opcion.id === id);
      // Asigna la descripción de la opción a selectValue si la opción existe,
      //de lo contrario, asigna null
      selectValue = Opcion != undefined ? Opcion.descripcion : null;
    }
    // Devuelve el valor seleccionado
    return selectValue;
  }

  private filter(value: string, listOptions: SelectResponse[]) {
    // Inicializa la variable para almacenar el valor de filtrado
    let filterValue = '';
    let aOptionsFiltered: any = []!;
    // Verifica si el tipo de valor es una cadena para asignar el filterValue en consecuencia
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    }
    // Verifica si listOptions no es undefined y tiene elementos
    if (listOptions != undefined && listOptions.length > 0) {
      // Filtra las opciones basándose en la descripción y filterValue
      aOptionsFiltered = listOptions.filter((option) => {
        return option.descripcion.toLowerCase().includes(filterValue);
      });
      // Establece el placeholder en el valor de la etiqueta (label)
      this.placeholder = this.label;
    } else {
      // Si listOptions está vacío o es undefined, establece un placeholder de lista vacía
      this.placeholder = 'Listado de ' + this.label + ' vacía';
    }
    // Devuelve las opciones filtradas
    return aOptionsFiltered;
  }

  private checkOption(value: string, listOptions: SelectResponse[]): any {
    // Verifica si hay opciones
    if (listOptions) {
      // Obtiene una matriz de IDs de las opciones
      let ids = listOptions.map((opcion) => opcion.id);
      // Verifica si el valor está incluido en la matriz de IDs
      let isValid = ids.includes(value);
      // Si el valor es válido
      if (isValid) {
        // Reinicia el control
        this.control.reset;
      } else {
        // Si el valor no es válido y se requiere, establece un error en el control
        if (this.required) this.control.setErrors({ required: true });
      }
    }
  }

  close(): void {
    this.itemSelected.emit('null');
    this.control.reset();
  }
}
