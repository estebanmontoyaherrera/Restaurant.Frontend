import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { GenericButton } from '@shared/models/reusables/generic-button.interface';

@Component({
  standalone: true,
  selector: 'app-generic-button',
  imports: [MatIcon, MatTooltip],
  templateUrl: './generic-button.component.html',
})
export class GenericButtonComponent {
  @Input() infoButton!: GenericButton;
  @Output() clickButton = new EventEmitter();
}
