import { Deck } from "./deck.model";
import { Card } from "./card.model";

describe('Deck', () => {
    let deck: Deck;

    beforeEach(() => {
        deck = new Deck(1);
    });

    it('should have 52 cards',() => {
        expect(deck.getCards().length).toEqual(52);
    });

    it('should contain only Cards',() => {
        for(let card of deck.getCards()){
            expect(card instanceof Card).toBeTruthy();
        }
    });

    it('should contain valued cards', ()=>{
        for(let card of deck.getCards()){
            expect(card.getValue()).toBeGreaterThan(0);
            expect(card.getValue()).toBeLessThan(14);
        }
    });

    it('should contain cards with image source', ()=>{
        for(let card of deck.getCards()){
            expect(card.imgUrl.indexOf('png')).toBeTruthy();
        }
    });

    it('should be able to shuffle and return no value', ()=>{
        const i = Math.floor(Math.random() * deck.getCards().length)
        const card1: Card= deck.getCards()[i];
        const novalue = deck.shuffle();
        const card2: Card = deck.getCards()[i];
        expect(card1).not.toEqual(card2);
        expect(novalue).toBeFalsy();
    });

    it('should be able to deal one card from deck', ()=>{
        const card = deck.dealOneCard();
        expect(card instanceof Card).toBeTruthy();
    });

    it('should return no card after 53 dealOneCard call', ()=>{
        let card: Card;
        for(let i=1; i<53; i++){
            deck.dealOneCard();
        }
        card = deck.dealOneCard();
        expect(card).toBeFalsy();
    });

    it('should return 52 random cards after 52 dealOneCard calls then shuffle Call', ()=>{
        for(let i=1; i<53; i++){
            deck.dealOneCard();
        }
        expect(deck.getCards().length).toBe(0);
        deck.shuffle();
        expect(deck.getCards().length).toBe(52);
    }); 
  });