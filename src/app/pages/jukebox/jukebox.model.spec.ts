import { Jukebox, BufferLoader } from './jukebox.model';
declare let window: any;

describe('BufferLoader', () => {
    let buffer: BufferLoader;

    beforeEach(() => {
        buffer = new BufferLoader(window.AudioContext);
    });
    it('should init', () => {
        expect(buffer).toBeTruthy();
    });

    it(`should load music`, () => {
        const music = 'assets/jukebox/musics/iLoveRocknRoll.mp3';
    });
});
