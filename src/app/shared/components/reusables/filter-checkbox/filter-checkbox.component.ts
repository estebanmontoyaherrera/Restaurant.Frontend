import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import {
  FilterCheckbox,
  SubTask,
  Task,
} from '@shared/models/reusables/filter-checkbox.interface';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-filter-checkbox',
  imports: [MatCheckbox, MatIcon, NgClass, FormsModule],
  templateUrl: './filter-checkbox.component.html',
  styleUrl: './filter-checkbox.component.scss',
})
export class FilterCheckboxComponent {
  @Input() checkData: FilterCheckbox[] = [];
  @Input() key = null;
  @Input() initFilter: string = null!;
  @Input() reset?: boolean = false;
  @Output() checkOut = new EventEmitter<any>();

  allComplete: boolean = false;
  private _task: Task = {
    label: 'TODOS',
    completed: false,
    subtasks: [] as SubTask[],
  };
  public get task(): Task {
    return this._task;
  }
  public set task(value: Task) {
    this._task = value;
  }
  constructor() {}

  ngOnInit(): void {
    this.getConfigurations();
    this.updateAllComplete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.reset != undefined && this.reset != null) {
      this.task.subtasks.map((e: SubTask) => {
        e.completed = this.initFiltersChecked(e.value);
        return e;
      });
      this.updateAllComplete();
    }

    if (changes.checkData && changes.checkData.previousValue != undefined) {
      this.getConfigurations();
    }
  }

  updateData() {
    this.emitChecked();
    this.updateAllComplete();
  }

  updateAllComplete() {
    this.allComplete =
      this.task.subtasks != null &&
      this.task.subtasks.every((t: any) => t.completed);
    this.reset = false;
  }

  emitChecked() {
    let selected = [];
    selected = this.task.subtasks
      .filter((e: any) => e.completed == true)
      .map((e: any) => e.value);
    if (this.key) {
      selected.push(this.key);
    }
    this.checkOut.emit(selected);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return (
      this.task.subtasks.filter((t: any) => t.completed).length > 0 &&
      !this.allComplete
    );
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach((t: any) => (t.completed = completed));
    this.updateData();
  }

  getConfigurations() {
    let setData: any = [];
    this.checkData.map((x) => {
      let newCheck = {
        value: x.value,
        label: x.label,
        icon: x.icon,
        cssIcon: x.cssIcon,
        completed: this.initFiltersChecked(x.value),
      };
      setData.push(newCheck);
    });
    this.task.subtasks = setData;
  }

  initFiltersChecked(codigo: any) {
    if (this.initFilter != undefined) {
      if (this.initFilter.includes(codigo)) {
        return true;
      }
      return false;
    }
    return false;
  }
}
