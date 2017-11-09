import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FauxDOM } from './fauxdom';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FauxDOM],
})
export class AppComponent implements OnInit {
  title = 'app';

  @ViewChild('plotlyContainer')
  private plotlyContainer: ElementRef;

  fauxElement: any;

  constructor(
    private faux: FauxDOM
  ) { }

  ngOnInit() {
    this.fauxElement = this.faux.createElement('div');
    Plotly.plot(this.fauxElement,
      [{ x: [1, 2, 3, 4, 5],
      y: [1, 2, 4, 8, 16] }], {
        margin: {
          t: 16,
          l: 16,
          r: 16,
          b: 32
        }
      }, {
        displaylogo: false,
        modeBarButtons: [['zoom2d', 'pan2d'], ['zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d']]
      }
    );
    this.faux.append(this.plotlyContainer.nativeElement, this.fauxElement);
  }
}
