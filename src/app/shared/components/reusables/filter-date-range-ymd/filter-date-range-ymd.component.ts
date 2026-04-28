import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-filter-date-range-ymd',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatIcon,
    MatLabel,
  ],
  providers: [MatDatepickerModule],
  templateUrl: './filter-date-range-ymd.component.html',
})
export class FilterDateRangeYmdComponent implements OnChanges {
  @Input() label: string = '';
  @Input() start: string = '';
  @Input() end: string = '';
  // @Input() maxDate: Moment = moment();
  @Output() rangeDate = new EventEmitter<any>();

  range = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  icToday = 'today';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.start || changes.end) {
      this.range.get('startDate')!.patchValue(this.start);
      this.range.get('endDate')!.patchValue(this.end);
    }
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    if (event.value != null) {
      this.emitDates();
    }
  }

  emitDates() {
    const startDateControl = this.range.get('startDate')!.value;
    const endDateControl = this.range.get('endDate')!.value;

    if (startDateControl && endDateControl) {
      const startDate = this.convert(startDateControl);
      const endDate = this.convert(endDateControl);
      const data = {
        startDate,
        endDate,
      };

      this.rangeDate.emit(data);
    }
  }

  convert(str: string) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }
}
