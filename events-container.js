/* Js EventsContainer
 * Version: 1.01
 * Author: Prefect9
 * TG: https://t.me/it_dev9/
 */
(function () {
    "use strict";
    try {
        var EventsContainer = function () {
            var _callbacks = []
            var add = function (_f) {
                if(typeof _f != "function") throw "you are trying to add a non-function like event"
                _callbacks.push(_f)
                return this
            }
            var trigger = function (...args) {
                var _result = []
                for(var _f of _callbacks) _result.push(_f(...args))
                return _result
            }
            var clear = function () {
                _callbacks = []
                return this
            }

            this.add = add
            this.trigger = trigger
            this.clear = clear
        }
        window.EventsContainer = EventsContainer
        window.EventsContainerVersion = "1.01"
    }catch (e) {
        console.error("EventsContainer error: "+e)
    }
})()