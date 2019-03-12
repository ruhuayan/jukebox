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

  private getOrientation(file: File, callback: Function): void {
    var reader = new FileReader();
  
    reader.onload = (event: ProgressEvent) => {
  
      if (! event.target) {
        return;
      }
  
      const file = event.target as FileReader;
      const view = new DataView(file.result as ArrayBuffer);
  
      if (view.getUint16(0, false) != 0xFFD8) {
          return callback(-2);
      }
  
      const length = view.byteLength
      let offset = 2;
  
      while (offset < length)
      {
          if (view.getUint16(offset+2, false) <= 8) return callback(-1);
          let marker = view.getUint16(offset, false);
          offset += 2;
  
          if (marker == 0xFFE1) {
            if (view.getUint32(offset += 2, false) != 0x45786966) {
              return callback(-1);
            }
  
            let little = view.getUint16(offset += 6, false) == 0x4949;
            offset += view.getUint32(offset + 4, little);
            let tags = view.getUint16(offset, little);
            offset += 2;
            for (let i = 0; i < tags; i++) {
              if (view.getUint16(offset + (i * 12), little) == 0x0112) {
                return callback(view.getUint16(offset + (i * 12) + 8, little));
              }
            }
          } else if ((marker & 0xFF00) != 0xFF00) {
              break;
          }
          else {
              offset += view.getUint16(offset, false);
          }
      }
      return callback(-1);
    };
  
    reader.readAsArrayBuffer(file);
  }
}
