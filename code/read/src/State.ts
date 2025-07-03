export type OutputState = {
    num: number;
};

export class State {
    private num: number = 0;
    inc = () => {
        this.num++;
    };
    dec = () => {
        this.num--;
    };
    getState = (): OutputState => {
        return { num: this.num };
    };
}
