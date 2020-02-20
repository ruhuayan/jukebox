import { Component, OnInit, OnDestroy, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit, OnDestroy {
  file: File = null;
  error: string = null;
  isUploading = false;
  progressPercentage = 0;
  private httpUrl = environment.uploadUrl;
  private fileUploadSubscription: Subscription;
  @Input('appFileTypes') fileTypes: string[];
  @Input('appAcceptType') acceptType: string;
  @Input('appFileSizeInMB') fileSize: number;
  @Output() public onUploaded: EventEmitter<string> =  new EventEmitter<string>();
  constructor(private http: HttpClient) { }
  ngOnInit() {}

  onChange(event: MouseEvent) {
    this.file = event.target['files'][0];
    if (!this.file) return;

    this.validateFile(this.file).subscribe(
      res => {if (res) { this.upload(); }},
      err => console.log(err)
    );
    event.target['value'] = '';
  }
  @HostListener('drop', [ '$event' ])
  public onDrop(event: DragEvent): void {
    this.file = event.dataTransfer.files[0];
    if (!this.file) return;
    event.preventDefault();
    event.stopPropagation();
    this.validateFile(this.file).subscribe(
      res => {if (res) { this.upload(); }},
      err => console.log(err)
    );
  }

  @HostListener('dragover', [ '$event' ])
  public onDropOver(event: any): void {
      event.preventDefault();
  }

  private validateFile(file: File):  Observable<boolean> {
    return new Observable(observer => {
      if (this.fileTypes && this.fileTypes.length) {
        if (!this.fileTypes.filter(v => v === file.type).length) {
          this.setError('File format not accept !');
          observer.next(false);
          observer.complete();
        }
      }
      if (this.fileSize && file.size > this.fileSize * 1024 * 1024) {
        this.setError(`File max ${this.fileSize}MB`);
        observer.next(false);
        observer.complete();
      }

      if (this.fileTypes[0].indexOf('image') >= 0) {
        const reader = new FileReader();
        const _this = this;
        reader.onload = (e) => {
          const img = new Image();
          // img.src = e.target['result'];

          img.onload = () => {
            if (img.width < 300 || img.height < 538) {
              _this.setError(`Image size must be 300 X 538`);
              observer.next(false);
            } else {
              observer.next(true);
            }
          };
        };
        reader.readAsDataURL(file);
      } else {
        observer.next(true);
      }

    });
  }

  private setError(err: string): void {
    this.error =  err;
    setTimeout(() => this.error = null, 2000);
  }

  private upload() {
    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.file);

    this.fileUploadSubscription = this.http.post<any>(this.httpUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progressPercentage = Math.floor( event.loaded * 100 / event.total );
      } else {
        if (event['status'] === 200 && event['body']) {

          this.isUploading = false;

          if (event['body'] && event['body']['success']) {
            this.onUploaded.emit(event['body']['path']);
          } else {
            this.setError(event['body']['msg']);
          }
        }
      }
    }, (error: any) => {
      console.log(error);
      this.stopUpload();
    });
  }
  stopUpload() {
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription.unsubscribe();
    }
    this.isUploading = false;
    this.file = null;
  }

  ngOnDestroy() {
    this.stopUpload();
  }
}
