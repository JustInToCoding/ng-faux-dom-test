import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import FauxDOM from './faux-dom';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  @ViewChild('plotlyContainer')
  private plotlyContainer: ElementRef;

  fauxElement;

  constructor(private renderer: Renderer2) {

  }

  ngOnInit() {
    this.fauxElement = FauxDOM.createElement('div');
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
  }
}
