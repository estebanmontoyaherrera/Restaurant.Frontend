import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Renderer2
} from '@angular/core';
import {
  DefaultValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
  selector: 'input[toUppercase]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToUpperCaseDirective),
      multi: true
    }
  ]
})
export class ToUpperCaseDirective extends DefaultValueAccessor {

  constructor(
    renderer: Renderer2,
    elementRef: ElementRef
  ) {
    super(renderer, elementRef, false);
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    const cursorPosition = input.selectionStart ?? input.value.length;

    const upperValue = input.value.toUpperCase();

    if (input.value !== upperValue) {
      input.value = upperValue;
      input.setSelectionRange(cursorPosition, cursorPosition);
      this.onChange(upperValue);
    }
  }
}
