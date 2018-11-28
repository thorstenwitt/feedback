import {Injectable} from '@angular/core';
import html2canvas from 'html2canvas';
import {Subject, Observable} from 'rxjs';
import {Feedback} from './entity/feedback'; // import Observable to solve build issue

@Injectable()
export class FeedbackService {

  public highlightedColor = 'yellow';
  public hiddenColor = 'black';
  private screenshotCanvasSource = new Subject<HTMLCanvasElement>();
  public screenshotCanvas$: Observable<HTMLCanvasElement> = this.screenshotCanvasSource.asObservable();

  private feedbackSource = new Subject<Feedback>();
  public feedback$: Observable<Feedback> = this.feedbackSource.asObservable();

  private isDraggingToolbarSource = new Subject<boolean>();
  public isDraggingToolbar$: Observable<boolean> = this.isDraggingToolbarSource.asObservable();


  public initScreenshotCanvas() {
    const that = this;
    const body = document.body;
    html2canvas(body, {
      canvas: that.generateExistingCanvas(),
      logging: false,
      width: window.innerWidth,
      height: window.innerHeight,
      x: document.documentElement.scrollLeft || document.body.scrollLeft,
      y: document.documentElement.scrollTop || document.body.scrollTop,
      allowTaint : true
    }).then(bodyCanvas => {
      this.screenshotCanvasSource.next(bodyCanvas);
    });
  }

  private generateExistingCanvas() {
    const scale = 5;
    const w = document.body.offsetWidth;
    const h = document.body.offsetHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.getContext('2d').scale(scale, scale);
    return canvas;
  }

  public setCanvas(canvas: HTMLCanvasElement): void {
    this.screenshotCanvasSource.next(canvas);
  }

  public setFeedback(feedback: Feedback): void {
    this.feedbackSource.next(feedback);
  }

  public setIsDraggingToolbar(isDragging: boolean): void {
    this.isDraggingToolbarSource.next(isDragging);
  }

  public getImgEle(canvas): HTMLElement {
    const img = canvas.toDataURL('image/png'),
          imageEle = document.createElement('img');
    imageEle.setAttribute('src', img);
    Object.assign(imageEle.style, {
      position: 'absolute',
      top: '50%',
      right: '0',
      left: '0',
      margin: '0 auto',
      maxHeight: '100%',
      maxWidth: '100%',
      transform: 'translateY(-50%)'
    });
    return imageEle;
  }

  public hideBackDrop() {
    const dialogBackDrop = document.getElementsByClassName('dialogBackDrop')[0] as HTMLElement;
    dialogBackDrop.style.backgroundColor = 'initial';
  }

  public showBackDrop() {
    const dialogBackDrop = document.getElementsByClassName('dialogBackDrop')[0] as HTMLElement;
    if (!dialogBackDrop.getAttribute('data-html2canvas-ignore')) {
      dialogBackDrop.setAttribute('data-html2canvas-ignore', 'true');
    }
    dialogBackDrop.style.backgroundColor = 'rgba(0, 0, 0, .288)';
  }
}
