import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourFormat',
  standalone: true,
})
export class HourFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const horaMinutos = value.split(':');
    const hora = parseInt(horaMinutos[0]);
    const minutos = parseInt(horaMinutos[1]);

    const ampm = hora >= 12 ? 'PM' : 'AM';
    const hora12 = hora % 12 || 12;

    return `${hora12}:${minutos < 10 ? '0' + minutos : minutos} ${ampm}`;
  }
}
