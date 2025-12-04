'use client';

// src/game/EventBus.ts
import { EventEmitter } from "events";

// Used to emit events between components, HTML and Phaser scenes
let eventBusInstance: any = null;

export const EventBus = {
    on: (event: string, callback: Function) => {
        if (!eventBusInstance) {
            const { Events } = require('phaser');
            eventBusInstance = new Events.EventEmitter();
        }
        return eventBusInstance.on(event, callback);
    },
    off: (event: string, callback?: Function) => {
        if (!eventBusInstance) {
            const { Events } = require('phaser');
            eventBusInstance = new Events.EventEmitter();
        }
        return eventBusInstance.off(event, callback);
    },
    emit: (event: string, ...args: any[]) => {
        if (!eventBusInstance) {
            const { Events } = require('phaser');
            eventBusInstance = new Events.EventEmitter();
        }
        return eventBusInstance.emit(event, ...args);
    },
    removeListener: (event: string, callback?: Function) => {
        if (!eventBusInstance) {
            const { Events } = require('phaser');
            eventBusInstance = new Events.EventEmitter();
        }
        return eventBusInstance.removeListener(event, callback);
    }
};