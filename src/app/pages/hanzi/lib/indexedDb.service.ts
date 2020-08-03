import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, BehaviorSubject } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { Record } from '.';

export enum DBMode {
	readonly = 'readonly',
	readwrite = 'readwrite'
}

const VERSION = 1;
const DB_NAME = 'dict';
const ST_NAME = 'records';
@Injectable({
    providedIn: 'root',
})
export class IndexedDbService {
    db = new ReplaySubject<IDBDatabase | null>(1);
    $db = this.db.pipe(take(1), filter(db => !!db));
    dbExisted$ = new BehaviorSubject<boolean>(true);

    constructor() {
        const onError = error => {
            console.log(error);
            this.db.complete();
        };
        const indexedDB = window.indexedDB || (<any>window).mozIndexedDB ||
                        (<any>window).webkitIndexedDB || (<any>window).msIndexedDB;
        if (!indexedDB) {
            onError('IndexedDB not available');
        } else {
            indexedDB.databases().then(res => {
                const existed = res.map(db => db.name).includes(DB_NAME); console.log(existed)
                this.dbExisted$.next(existed);
            });

            const openRequest = indexedDB.open(DB_NAME, VERSION);
            openRequest.onerror = () => onError(openRequest.error); 
            openRequest.onsuccess = () => this.db.next(openRequest.result);
            openRequest.onupgradeneeded = (e) => { console.log(e)
                try {
                    const db: IDBDatabase = openRequest.result;
                    const cacheStore = db.createObjectStore(ST_NAME, { keyPath: 'hanzi' });
                    cacheStore.createIndex('radical', 'radical');
                    cacheStore.createIndex('definition', 'definition');
                } catch (error) {
                    onError(error);
                }
            };
        }
    }

    get(hanzi: string): Observable<Record | null> {
        return Observable.create((observer: Observer<Record>) => {
            const onError = error => {
                console.log(error);
                observer.complete();
            };
            this.$db.subscribe(db => {
                try {
                    const txn = db.transaction([ST_NAME], DBMode.readonly);
                    const store = txn.objectStore(ST_NAME);
                    const getRequest: IDBRequest<Record> = store.get(hanzi);
                    getRequest.onerror = () => onError(getRequest.error);
                    getRequest.onsuccess = () => {
                        const record = getRequest.result;
                        // if (!record ||
                        //     new Date(Date.now() - record.timestamp).getSeconds() > record.ttl
                        // ) {
                        //     observer.next(null);
                        // } else {
                            observer.next(getRequest.result);
                        // }
                        observer.complete();
                    };
                } catch (err) {
                    onError(err);
                }
            });
        });
    }

    put(record: Record): Observable<IDBValidKey | null> {
        return Observable.create((observer: Observer<IDBValidKey>) => {
            const onError = error => {
                console.log(error);
                observer.complete();
            };
            this.$db.subscribe(db => {
                try {
                    const txn = db.transaction([ST_NAME], DBMode.readwrite);
                    const store = txn.objectStore(ST_NAME);
                    // const record: Record = {...value, timestamp: Date.now()};
                    const putRequest = store.put(record);
                    putRequest.onerror = () => onError(putRequest.error);
                    putRequest.onsuccess = () => {
                        observer.next(putRequest.result);
                        observer.complete();
                    };
                } catch (err) {
                    onError(err);
                }
            });
        });
    }

    clear() {
        return Observable.create((observer: Observer<void>) => {
            this.$db.subscribe(db => {
                try {
                    db.transaction([ST_NAME], DBMode.readwrite).objectStore(ST_NAME).clear();
                } catch (error) {
                    console.log(error);
                }
                observer.complete();
            });
        });
    }
}