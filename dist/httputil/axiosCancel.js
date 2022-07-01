"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosCanceler = exports.getPendingUrl = void 0;
const axios_1 = require("axios");
const lodash_es_1 = require("lodash-es");
// Used to store the identification and cancellation function of each request
let pendingMap = new Map();
const getPendingUrl = (config) => [config.method, config.url].join('&');
exports.getPendingUrl = getPendingUrl;
class AxiosCanceler {
    /**
     * Add request
     * @param {Object} config
     */
    addPending(config) {
        this.removePending(config);
        const url = (0, exports.getPendingUrl)(config);
        config.cancelToken =
            config.cancelToken ||
                new axios_1.default.CancelToken((cancel) => {
                    if (!pendingMap.has(url)) {
                        // If there is no current request in pending, add it
                        pendingMap.set(url, cancel);
                    }
                });
    }
    /**
     * @description: Clear all pending
     */
    removeAllPending() {
        pendingMap.forEach((cancel) => {
            cancel && (0, lodash_es_1.isFunction)(cancel) && cancel();
        });
        pendingMap.clear();
    }
    /**
     * Removal request
     * @param {Object} config
     */
    removePending(config) {
        const url = (0, exports.getPendingUrl)(config);
        if (pendingMap.has(url)) {
            // If there is a current request identifier in pending,
            // the current request needs to be cancelled and removed
            const cancel = pendingMap.get(url);
            cancel && cancel(url);
            pendingMap.delete(url);
        }
    }
    /**
     * @description: reset
     */
    reset() {
        pendingMap = new Map();
    }
}
exports.AxiosCanceler = AxiosCanceler;
//# sourceMappingURL=axiosCancel.js.map