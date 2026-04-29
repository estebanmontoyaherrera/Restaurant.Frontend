import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FilterDateRangeYmdComponent } from '@app/shared/components/reusables/filter-date-range-ymd/filter-date-range-ymd.component';
import { fadeInRight400ms } from '@shared/animations/fade-in-right.animation';
import { scaleIn400ms } from '@shared/animations/scale-in.animation';
import { SalesReportResponse } from '../../models/sales-report-response.interface';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, MatIcon, MatButtonModule, FilterDateRangeYmdComponent],
  templateUrl: './sales-report.component.html',
  animations: [scaleIn400ms, fadeInRight400ms],
})
export class SalesReportComponent {
  private readonly reportService = inject(ReportService);

  iconReport$ = 'analytics';
  startDate = '';
  endDate = '';
  loading = false;
  report: SalesReportResponse = {
    totalSales: 0,
    totalOrders: 0,
    averageTicket: 0,
    bestSellingDish: '',
    salesByCategory: [],
    salesByDish: [],
  };

  ngOnInit(): void {
    this.loadReport();
  }

  setDateRange(data: any): void {
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.loadReport();
  }

  resetFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    this.reportService.salesReport(this.startDate, this.endDate).subscribe({
      next: (resp) => {
        if (resp.isSuccess && resp.data) {
          this.report = resp.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
