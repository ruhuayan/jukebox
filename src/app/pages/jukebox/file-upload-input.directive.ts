import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: 'input[appFileUploadInput], div[appFileUploadInput]',
})
export class AppFileUploadInput {

  private _element: HTMLElement;
  @Output() public onFileSelected: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(private element: ElementRef) {
      this._element = this.element.nativeElement;
  }

  @HostListener('change', [ '$event' ])
  public onChange(event: MouseEvent): void {
    const files = this.element.nativeElement.files;
    this.pushFileToQueue(files, event);
  }

  @HostListener('drop', [ '$event' ])
  public onDrop(event: DragEvent): void {
    
    const fileList = event.dataTransfer.files;
    this.pushFileToQueue(Array.from(fileList), event);
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('dragover', [ '$event' ])
  public onDropOver(event: any): void {
      event.preventDefault();
  }

  private pushFileToQueue(files: File[], event: Event): void{
    
    if (files[0].type !== 'audio/mp3' && files[0].type !== 'audio/wav') {
      files[0]['error'] = 'Accept only audio file format - .mp3 & .wav!'; 
    } else if (files[0].size > 3 * 1024 * 1024) {
      files[0]['error'] = 'File max 3 MB!';
    }
    event['file'] = files[0];
    this.onFileSelected.emit(event);
    this.element.nativeElement.value = ''; 
  }
}
