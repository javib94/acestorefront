import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'vsf-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InformationComponent implements OnInit {
  images = [
    {path: 'assets/slides/Slide1.jpg'},
    {path: 'assets/slides/Slide2.jpg'},
    {path: 'assets/slides/Slide3.jpg'},
    {path: 'assets/slides/Slide4.jpg'},
    {path: 'assets/slides/Slide5.jpg'},
    {path: 'assets/slides/Slide6.jpg'},
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
