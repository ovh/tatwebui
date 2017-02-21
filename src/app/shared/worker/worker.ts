import {Observable, BehaviorSubject} from 'rxjs/Rx';
export class TatWorker {

  // Webworker
  webWorker: Worker = null;
  webWorkerScript: string;

  private _response: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(webWorkerScript: string) {
    this.webWorkerScript = webWorkerScript;
  }

  response(): Observable<any> {
    return new Observable<any>(fn => this._response.subscribe(fn));
  }

  /**
   * Create worker
   * @param msgToSend Message to send to worker to start it.
   */
  start(msgToSend: any) {
    if (!this.webWorker) {
      this.webWorker = new Worker(this.webWorkerScript);
      this.webWorker.onmessage = ((e) => {
        if (e.data && e.data !== 'null' && e.data !== '') {
          this._response.next(e.data);
        }
      });
      this.webWorker.onerror = function (e) {
        console.log('Warning Worker Error: ', e);
      };
      this.webWorker.postMessage(msgToSend);
    } else {
      // Stop worker
      this.webWorker.terminate();
      this.webWorker = null;
      this.start(msgToSend);
    }

  }
}
