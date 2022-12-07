import {Ace} from "ace-code";
import {
    ChangeMessage, ChangeModeMessage,
    CompleteMessage, DeltasMessage,
    FormatMessage,
    HoverMessage,
    InitMessage,
    ValidateMessage
} from "./message-types";
import * as oop from "ace-code/src/lib/oop";
import {EventEmitter} from "ace-code/src/lib/event_emitter";
import {ServiceOptions} from "./services/language-service";

export class MessageController {
    private static _instance: MessageController;

    static get instance() {
        if (!MessageController._instance) {
            MessageController._instance = new MessageController();
        }
        return MessageController._instance;
    }

    private worker: Worker;

    constructor() {
        //@ts-ignore
        this.worker = new Worker(new URL('./webworker.ts', import.meta.url));

        this.worker.onmessage = (e) => {
            this["_signal"]("message-" + e.data.sessionId, e);
        }
    }

    init(sessionId: string, value: string, options: ServiceOptions) {
        this.worker.postMessage(new InitMessage(sessionId, value, options));
    }

    doValidation(sessionId: string) {
        this.worker.postMessage(new ValidateMessage(sessionId))
    }

    doComplete(sessionId: string, position: Ace.Point) {
        this.worker.postMessage(new CompleteMessage(sessionId, position))
    }

    format(sessionId: string, range: Ace.Range) {
        this.worker.postMessage(new FormatMessage(sessionId, range));
    }

    doHover(sessionId: string, position: Ace.Point) {
        this.worker.postMessage(new HoverMessage(sessionId, position))
    }

    change(sessionId: string, deltas: Ace.Delta[], value: string, docLength: number) {
        if (deltas.length > 50 && deltas.length > docLength >> 1) {
            this.worker.postMessage(new ChangeMessage(sessionId, value));
        } else {
            this.worker.postMessage(new DeltasMessage(sessionId, deltas));
        }
    }

    changeMode(sessionId: string, options: ServiceOptions) {
        this.worker.postMessage(new ChangeModeMessage(sessionId, options));
    }

    postMessage(message: any ) {
        this.worker.postMessage(message);
    }
}

oop.implement(MessageController.prototype, EventEmitter);