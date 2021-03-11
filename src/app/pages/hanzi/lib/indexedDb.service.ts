import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, BehaviorSubject } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { Record } from '.';

export enum DBMode {
    readonly = 'readonly',
    readwrite = 'readwrite'
}

const DBConfig = {
    VERSION: 1,
    DB_NAME: 'dict',
    ST_NAME: 'records',
}
@Injectable({
    providedIn: 'root',
})
export class IndexedDbService {
    db = new ReplaySubject<IDBDatabase | null>(1);
    $db = this.db.pipe(take(1), filter(db => !!db));
    dbExisted$ = new BehaviorSubject<boolean>(true);
    private dbExisted = false;

    constructor() {
        const onError = error => {
            console.log(error);
            this.db.complete();
        };
        const indexedDB = window.indexedDB || (<any>window).mozIndexedDB || (<any>window).webkitIndexedDB || (<any>window).msIndexedDB;
        if (!indexedDB) {
            onError('IndexedDB not available');
        } else {
            indexedDB.databases().then(res => {
                const existed = res.map(db => db.name).includes(DBConfig.DB_NAME);
                this.dbExisted$.next(existed);
                this.dbExisted = true;
            });

            const openRequest = indexedDB.open(DBConfig.DB_NAME, DBConfig.VERSION);
            openRequest.onerror = () => onError(openRequest.error);
            openRequest.onsuccess = () => this.db.next(openRequest.result);
            openRequest.onupgradeneeded = (e) => {
                try {
                    const db: IDBDatabase = openRequest.result;
                    const cacheStore = db.createObjectStore(DBConfig.ST_NAME, { keyPath: 'hanzi' });
                    cacheStore.createIndex('radical', 'radical');
                    cacheStore.createIndex('definition', 'definition');
                } catch (error) {
                    onError(error);
                }
            };
        }
    }

    get(hanzi: string): Observable<Record | null> {
        return new Observable((observer: Observer<Record>) => {
            const onError = error => {
                console.log(error);
                observer.complete();
            };
            this.$db.subscribe(db => {
                try {
                    const txn = db.transaction([DBConfig.ST_NAME], DBMode.readonly);
                    const store = txn.objectStore(DBConfig.ST_NAME);
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
        return new Observable((observer: Observer<IDBValidKey>) => {
            const onError = error => {
                observer.error(error);
                observer.complete();
            };
            this.$db.subscribe(db => {
                try {
                    const txn = db.transaction([DBConfig.ST_NAME], DBMode.readwrite);
                    const store = txn.objectStore(DBConfig.ST_NAME);
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

    clear(): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {
            this.$db.subscribe(db => {
                try {
                    db.transaction([DBConfig.ST_NAME], DBMode.readwrite).objectStore(DBConfig.ST_NAME).clear();
                    observer.next(true);
                } catch (error) {
                    observer.error(error);
                }
                observer.complete();
            });
        });
    }
}