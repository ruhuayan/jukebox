import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { from } from 'rxjs/internal/observable/from';
import * as faceapi from 'face-api.js';
import { forkJoin, interval } from 'rxjs';
import { WebWorkerService } from 'ngx-web-worker';

@Component({
  selector: 'app-faceapi',
  templateUrl: './faceapi.component.html',
  styleUrls: ['./faceapi.component.scss']
})
export class FaceapiComponent implements OnInit, OnDestroy {
  @ViewChild('videoEl') videoEl: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

  private subscription: Subscription;
  private intervalSubscribe: Subscription;
  private video: any;
  public supportMedia = true;
  public canShow = true;

  constructor(private _webWorkerService: WebWorkerService) { }

  ngOnInit() {
    this.video = this.videoEl.nativeElement;

    const model_url = 'https://gitcdn.xyz/repo/justadudewhohacks/face-api.js/master/weights/'; 
    // const model_url = 'https://www.richyan.com/assets/models/';
    const promises = [faceapi.nets.tinyFaceDetector.loadFromUri(model_url),
                      faceapi.nets.faceLandmark68Net.loadFromUri(model_url),
                      faceapi.nets.faceRecognitionNet.loadFromUri(model_url),
                      faceapi.nets.faceExpressionNet.loadFromUri(model_url)
                    ];

    const sub = forkJoin(promises).subscribe(() => {
      this.startVideo();
      sub.unsubscribe();
    });
  }

  private startVideo(): void {

    try{
      const promise = window.navigator.mediaDevices.getUserMedia({video: true, audio: false});
      this.subscription = from(promise).subscribe(
                            stream => {
                              this.video.srcObject  = stream;
                            },
                            err => {
                              this.supportMedia = false;
                              console.log(err);
                            }
                          );
    } catch (err) {
      this.supportMedia = false;
      console.log(err);
    }
    
  }

  public toggle(): void {
    this.canShow = !this.canShow;
  }

  public detect(): void {
    console.log('loaded');
    const canvas = this.canvas.nativeElement; //faceapi.createCanvasFromMedia(this.video);

    const displaySize = { width: this.video.offsetWidth, height: this.video.offsetHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const source = interval(100);
    this.intervalSubscribe = source.subscribe(async () => {

        const detections = await this._webWorkerService.run(this.detections);
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    });
  }

  private detections(): any{
    return faceapi.detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions(/*{ inputSize: 128, scoreThreshold: 0.4 }*/))
        .withFaceLandmarks().withFaceExpressions();
  }

  public end(): void {
    console.log('ended');
    this.intervalSubscribe.unsubscribe();
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.intervalSubscribe) {
        this.intervalSubscribe.unsubscribe();
    }
  }
}
