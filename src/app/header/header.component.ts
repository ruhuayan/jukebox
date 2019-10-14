import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('inputToggle') inputToggle: ElementRef<HTMLElement>;
  linkUrl = 'igame';
  constructor(private router: Router) { }

  ngOnInit() {
  }

  clickLink(url: string): void {
    this.inputToggle.nativeElement.click();
    this.linkUrl = url;
    setTimeout(() => this.router.navigateByUrl(url), 480);
  }
}
