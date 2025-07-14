import { Resource } from "./components/Resource";
import { AppContext } from "./AppContext";
import { State } from "./State";

// export class AppState extends State {
//     constructor(public context: AppContext) {
//         super(context);
//     }
//     enter() {
//         if (this.context.mode === "insert") {
//             this.onEnterWhileInInsert();
//         }
//     }
//     private onEnterWhileInInsert() {
//         if (this.context.inputAction === "goto") {
//             try {
//                 const ref = Resource.parse(this.context.buffer);
//                 this.context.nav.goTo(ref);
//             } catch {
//                 this.context.error = `there was an issue parsing '${this.context.buffer}'`;
//             } finally {
//                 this.context.buffer = "";
//                 this.context.inputAction = null;
//                 this.context.mode = "nav";
//             }
//         } else if (this.context.inputAction === "link") {
//             try {
//                 if (
//                     this.context.selectedWord === null ||
//                     this.context.selectedWord < 0
//                 )
//                     throw "Cannot create link with no word selected";
//                 const res = Resource.parse(this.context.buffer);
//                 this.context.links.add({
//                     from: this.context.nav.getCurrent(),
//                     to: res,
//                     word: this.context.selectedWord,
//                 });
//             } catch {
//                 this.context.error = `there was an issue parsing '${this.context.buffer}'`;
//             } finally {
//                 this.context.buffer = "";
//                 this.context.inputAction = null;
//                 this.context.mode = "nav";
//                 this.context.selectedWord = null;
//             }
//         }
//     }

//     cancel() {
//         if (this.context.mode === "insert") {
//             this.context.buffer = "";
//             this.context.mode = "nav";
//         }
//     }
//     startLinking() {
//         this.context.mode = "insert";
//         this.context.inputAction = "link";
//     }
//     addToBuffer(key: string) {
//         if (key === "\b" || key === "\x08" || key === "\x7F")
//             this.context.buffer = this.context.buffer.slice(0, -1);
//         else this.context.buffer = this.context.buffer + key;
//     }
//     toggleBookMark() {
//         const ref = this.context.nav.getState().ref;
//         if (this.context.bm.has(ref)) this.context.bm.remove(ref);
//         else this.context.bm.add(ref);
//     }
//     enterInsertMode() {
//         this.context.mode = "insert";
//     }
//     enterSelectMode() {
//         this.context.selectedWord = 0;
//         this.context.mode = "select";
//     }
//     enterNavMode() {
//         this.context.mode = "nav";
//         this.context.selectedWord = null;
//     }
//     save = () => this.context.bm.save();
//     inc = () => this.context.nav.nextVerse();
//     dec = () => this.context.nav.prevVerse();
//     goTo = () => {
//         this.context.mode = "insert";
//         this.context.inputAction = "goto";
//     };
//     incWord = () => {
//         const verseSize = this.context.nav.getState().text.split(" ").length;
//         if (
//             this.context.selectedWord !== null &&
//             this.context.selectedWord < verseSize - 1
//         )
//             this.context.selectedWord++;
//     };
//     decWord = () => {
//         if (
//             this.context.selectedWord !== null &&
//             this.context.selectedWord >= 1
//         )
//             this.context.selectedWord--;
//     };
//     getMode = () => this.context.mode;

//     clearError() {
//         this.context.error = null;
//     }
// }
