import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'jukebox';
    loading: boolean;

    constructor(router: Router) {
        this.loading = false;

        router.events.subscribe(
            (event: RouterEvent): void => {
                if (event instanceof NavigationStart) {
                    this.loading = true;
                } else if (event instanceof NavigationEnd) {
                    this.loading = false;
                }
            }
        );
    }
}
