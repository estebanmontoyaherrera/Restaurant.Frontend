import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuFilterTable } from '@shared/models/reusables/filter-menu-states.interface';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FilterCheckboxComponent } from '../filter-checkbox/filter-checkbox.component';

@Component({
  standalone: true,
  selector: 'app-filter-menu-states',
  imports: [
    MatMenuTrigger,
    MatTooltip,
    MatIcon,
    MatMenu,
    FilterCheckboxComponent,
  ],
  templateUrl: './filter-menu-states.component.html',
})
export class FilterMenuStatesComponent {
  @Input() menuFilter!: MenuFilterTable;
  @Input() initfilters: string = null!;
  @Input() reset: boolean = false;
  @Output() dataChecked = new EventEmitter<any>();

  checkedTrue(e: any) {
    this.dataChecked.emit(e);
  }
}
