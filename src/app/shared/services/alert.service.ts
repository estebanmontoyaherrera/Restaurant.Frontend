import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  // Detecta el contenedor del modal de Material (Top Layer)
  private getTarget(): HTMLElement {
    const overlay = document.querySelector('.cdk-global-overlay-wrapper') as HTMLElement;
    return overlay ? overlay : document.body;
  }

  private readonly config = {
    confirmButtonColor: '#004A89',
    cancelButtonColor: '#9c667d',
    width: 430,
  };

  success(title: string, message: string) {
    Swal.fire({
      ...this.config,
      title: title,
      text: message,
      icon: 'success',
      target: this.getTarget()
    });
  }

  // ESTA ES LA FUNCIÓN QUE TE DABA ERROR
  warn(title: string, message: string) {
    Swal.fire({
      ...this.config,
      title: title,
      text: message,
      icon: 'warning',
      target: this.getTarget()
    });
  }

  error(title: string, message: string) {
    Swal.fire({
      ...this.config,
      title: title,
      text: message,
      icon: 'error',
      target: this.getTarget()
    });
  }

  // Para preguntas de confirmación (como eliminar)
  async question(title: string, message: string): Promise<boolean> {
    const result = await Swal.fire({
      ...this.config,
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      target: this.getTarget()
    });
    return result.isConfirmed;
  }
}