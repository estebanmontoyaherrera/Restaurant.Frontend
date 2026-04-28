import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { startWith, switchMap } from 'rxjs';
import { fadeInUp400ms } from '@shared/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@shared/animations/scale-fade-in.animation';
import {
  TableColumns,
  TableFooter,
} from '@shared/models/reusables/list-table.interface';
import { HourFormatPipe } from '@shared/pipes/hour-format.pipe';
import { DefaultService } from '@shared/services/default.service';
import { getEsPaginatorIntl } from '@shared/utils/es-paginator-intl.util';

@Component({
  standalone: true,
  selector: 'app-list-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatPaginatorModule,
    NgxSpinnerModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    HourFormatPipe,
  ],
  templateUrl: './list-table.component.html',
  styleUrl: './list-table.component.scss',
  animations: [
    scaleFadeIn400ms,
    fadeInUp400ms,
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' })
      ),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getEsPaginatorIntl() },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
      } as MatFormFieldDefaultOptions,
    },
  ],
})
export class ListTableComponent<T> implements OnInit, AfterViewInit, OnChanges {
  @Input() service!: DefaultService;
  @Input() columns!: any | TableColumns<T>[];
  @Input() getInputs: any;
  @Input() sortBy!: string;
  @Input() sortDir: any | string = 'asc';
  // @Input() itemsMenuContextual: MenuContextual<T>[] = [];
  @Input() footer: TableFooter<T>[] = [];
  @Output() rowClick = new EventEmitter<any>();
  @Input() subColumns: any;
  @Input() expandableTable = false;
  @Input() striped = true;
  @Input() showPaginator = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild('menuContacts') menuContacts;
  // @ViewChild(ContextMenuComponent) contextMenu: ContextMenuComponent<T>;
  changesGetInputs = new EventEmitter<any>();

  expandedElement: any;
  dataSource = new MatTableDataSource<T>();
  visibleColumns!: Array<keyof T | string>;
  visibleFooter: any;
  paginatorOptions = {
    pageSizeOptions: [10, 20, 50],
    pageSize: 10,
    pageLength: 0,
  };

  constructor(
    private spinner: NgxSpinnerService // private accesoService: AccesoService
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns) {
      this.setVisibleColums();
    }

    if (changes.getInputs && this.paginator) {
      this.paginator.pageIndex = 0;
      this.changesGetInputs.emit();
    }
  }

  ngAfterViewInit(): void {
    this.getDataByService();
    this.sortChanges();
    this.paginatorChanges();
  }

  rowButtonMenuAction(e: any) {
    this.changesGetInputs.emit();
  }

  closeMe(menuTrigger: MatMenuTrigger) {
    menuTrigger.closeMenu();
  }

  async getDataByService() {
    this.changesGetInputs
      .pipe(
        startWith(''),
        switchMap(() => {
          this.spinner.show('modal-table');
          return this.service.getAll(
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.getInputs
          );
        })
      )
      .subscribe((data) => {
        this.setData(data);
        this.spinner.hide('modal-table');
      });
  }

  setData(data: any) {
    if (data.isSuccess) {
      this.setVisibleColums();
      this.paginatorOptions.pageLength = data.totalRecords;
      this.dataSource.data = data.data;
      // if (data.data.footer) this.setFooter(data.data.footer);
    } else {
      // swalSmart({
      //   type: 'warning',
      //   showCancelButton: false,
      //   text: 'Ha ocurrido un error al cargar los datos',
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     // this.accesoService.routeNavigation();
      //   }
      // });
    }
  }

  setFooter(data: any) {
    this.visibleFooter = [];
    if (this.footer.length && data) {
      this.footer.forEach((e) => {
        this.visibleFooter.push({
          label: e.label,
          value: data[e.property],
          tooltip: e.tooltip,
        });
      });
    }
  }

  setVisibleColums() {
    // if (this.getTypeList()) {
    //   this.visibleColumns = this.columns
    //     .filter((column: any) => column.visible && column.visibleIndividualList)
    //     .map((column: any) => column.property);
    // } else {
    this.visibleColumns = this.columns
      .filter((column: any) => column.visible)
      .map((column: any) => column.property);
    // }
  }

  sortChanges() {
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.changesGetInputs.emit();
    });
  }

  paginatorChanges() {
    this.paginator.page.subscribe(() => {
      this.changesGetInputs.emit();
    });
  }

  // getTypeList() {
  //   let typeList = this.getInputs.split('&');
  //   let bool = 'false';
  //   typeList.map((e: any) => {
  //     if (e.includes('bListado_individual')) {
  //       bool = e.split('=')[1];
  //     }
  //   });
  //   return JSON.parse(bool);
  // }

  isClosedMenuContextual(e: any) {}

  openMenuContextual($event: any, row: any, i: any) {
    // this.contextMenu.open($event, row, i);
  }
}
