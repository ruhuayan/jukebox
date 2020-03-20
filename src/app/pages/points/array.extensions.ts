export {}
declare global {
    interface Array<T> {
        combination() : Array<Array<T>>;
        propabilities(len: number) : Array<Array<T>>;
    }
}

if (!Array.prototype.combination)
    Array.prototype.combination = function () {
        if (this.length === 1) return [[...this]];
        else if (this.length === 2) return [[...this], [this[1], this[0]]];
        else return this.reduce((acc, curr, i) => {
                const self = this.filter((v, index) => i !== index);
                return [...acc, ...self.combination().map(a => [this[i], ...a])];
            }, []);
    };
if (!Array.prototype.propabilities)
    Array.prototype.propabilities = function (len: number) {
        if (len === 1) return this.map(op => [op]);
        else if (len === 2) return this.map(op1 => this.map(op2 => [op1, op2])).reduce((acc, cur) => [...acc, ...cur], []);
        else return this.map(op => this.propabilities(len - 1).map(a => [op, ...a])).reduce((acc, cur) => [...acc, ...cur], [])
    };