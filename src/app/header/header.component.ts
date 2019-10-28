import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('inputToggle', {static: false}) inputToggle: ElementRef<HTMLElement>;
  linkUrl: string;
  menuChecked = false;
  constructor(private router: Router) { }

  ngOnInit() {
    if (!this.linkUrl) {
      this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          this.linkUrl = e.url.slice(1);
        }
      });
    }
  }

  clickLink(url: string): void {
    this.inputToggle.nativeElement.click();
    this.linkUrl = url;
    setTimeout(() => this.router.navigateByUrl(url), 480);
  }
}
