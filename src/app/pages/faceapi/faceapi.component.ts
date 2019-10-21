import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
// import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { from } from 'rxjs/internal/observable/from';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-faceapi',
  templateUrl: './faceapi.component.html',
  styleUrls: ['./faceapi.component.scss']
})
export class FaceapiComponent implements OnInit, OnDestroy {
  @ViewChild('videoEl') videoEl: any;
  private _navigator = <any> navigator;
  private subscription: Subscription;
  private video: any;

  constructor() { }

  ngOnInit() {
    this.video = this.videoEl.nativeElement;
    this._navigator = <any>navigator;
    this._navigator.getUserMedia = ( this._navigator.getUserMedia || this._navigator.webkitGetUserMedia
      || this._navigator.mozGetUserMedia || this._navigator.msGetUserMedia );

    // Promise.all([
    //   faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models'),
    //   faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
    //   faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'),
    //   faceapi.nets.faceExpressionNet.loadFromUri('/assets/models')
    // ]).then(this.startVideo);
    this.startVideo();
  }

  private startVideo(): void {

    const promise = this._navigator.mediaDevices.getUserMedia({video: true, audio: true});
    this.subscription = from(promise).subscribe(
                          stream => {
                            this.video.srcObject  = stream;
                          },
                          err => {
                            console.log(err);
                          }
                        );

    // this.video.addEventListener('play', () => { console.log('play')
    //   const canvas = faceapi.createCanvasFromMedia(this.video);
    //   document.body.append(canvas);
    //   const displaySize = { width: this.video.width, height: this.video.height };
    //   faceapi.matchDimensions(canvas, displaySize);
    //   setInterval(async () => {
    //     const detections = await faceapi.detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions())
    //                                     .withFaceLandmarks().withFaceExpressions();
    //     const resizedDetections = faceapi.resizeResults(detections, displaySize);
    //     canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    //     faceapi.draw.drawDetections(canvas, resizedDetections);
    //     faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    //     faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    //   }, 100);
    // });
  }

  public start(): void {
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }
  /****
   interface HTMLCanvasElement extends HTMLElement {
      // ...
      transferControlToOffscreen(): OffscreenCanvas;
    }

    interface OffscreenCanvasRenderingContext2D extends CanvasState, CanvasTransform, CanvasCompositing, CanvasImageSmoothing, CanvasFillStrokeStyles, CanvasShadowStyles, CanvasFilters, CanvasRect, CanvasDrawPath, CanvasUserInterface, CanvasText, CanvasDrawImage, CanvasImageData, CanvasPathDrawingStyles, CanvasTextDrawingStyles, CanvasPath {
      readonly canvas: OffscreenCanvas;
    }
    // declare var OffscreenCanvasRenderingContext2D: {
    //   prototype: OffscreenCanvasRenderingContext2D;
    //   new(): OffscreenCanvasRenderingContext2D;
    // }
    interface OffscreenCanvas extends EventTarget {
      width: number;
      height: number;
      getContext(contextId: "2d", contextAttributes?: CanvasRenderingContext2DSettings): OffscreenCanvasRenderingContext2D | null;
    }

   */
}
