import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { HttpClient, HttpEventType, HttpHeaders} from '@angular/common/http';
import { BytesPipe } from './bytesPipe';
@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit, OnDestroy {
  file: File = null;
  error: string = null;
  isUploading = false;
  public progressPercentage = 0;
  private fileUploadSubscription: Subscription;
  constructor(private http: HttpClient) { }
  @Input('appFileTypes') fileTypes: string[]; 
  @Input('appAcceptType') acceptType: string;
  @Input('appFileSizeInMB') fileSize: number;
  ngOnInit() {}

  onChange(event: MouseEvent) {
    this.file = event.target['files'][0]; console.log(this.file.type);
    if (!this.file) return;

    if (this.validateFile(this.file)) {
      this.upload(this.file);
    }
  }
  @HostListener('drop', [ '$event' ])
  public onDrop(event: DragEvent): void {
    this.file = event.dataTransfer.files[0];
    if (!this.file) return;
    event.preventDefault();
    event.stopPropagation();
    if (this.validateFile(this.file)) {

    }
  }

  @HostListener('dragover', [ '$event' ])
  public onDropOver(event: any): void {
      event.preventDefault();
  }

  private validateFile(file: File): boolean {
    if (this.fileTypes && this.fileTypes.length) {
      if(!this.fileTypes.filter(v => v === file.type).length) {
        this.error = 'File format not accept !';
        return false;;
      }
    } 
    if (this.fileSize && file.size > this.fileSize) {
      this.error = `File max ${this.fileSize}MB`;
      return false;
    }
    return true;
  }

  private upload(file: File) {
    this.isUploading = true;
    const formData = new FormData();
    formData.set('files', this.file, this.file.name);

    const httpUrl = 'https://www.richyan.com/pdf/upload.php';
    this.fileUploadSubscription = this.http.post(httpUrl, formData, {
      headers: new HttpHeaders().set('Content-Type', 'multipart/form-data'),
      observe: 'events',
      // params: this.httpParams,
      reportProgress: true,
      responseType: 'json'
    }).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progressPercentage = Math.floor( event.loaded * 100 / event.total );
      } else {
        if (event['status'] === 200 && event['body']) {
          console.log(event['body']);
        }
      }
    }, (error: any) => {
      this.remove();
    });
  }
  remove() {
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription.unsubscribe();
    }
    this.file = null;
  }

  ngOnDestroy() {
    this.remove();
  }
}
