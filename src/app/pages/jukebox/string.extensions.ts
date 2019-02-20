interface String {
  leftStrip(): string;
  removeCodeZero(): string;
  removeHtmlTag(): string;
}
String.prototype.leftStrip = function(): string {
    const len = this.length;
    let str = this;
    for (let i = 0; i < len; i++) {
        if (!this.charAt(i).match(/[a-z1-9*_]/i)){
            str = this.substring(i + 1, len);
        } else break;
    }
    return str;
};

String.prototype.removeCodeZero = function(): string {
  const str = <String>this;
  const arr = Array.from(str).filter(ch => ch.charCodeAt(0) > 0);
  return arr.join('');
}
String.prototype.removeHtmlTag = function(): string {
  return null;
}
