import { Component, OnInit, Input } from '@angular/core';
import { Card } from './models/card.model';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
    @Input('appCard') card: Card;
    constructor() { }

    ngOnInit(): void {
    }
}
