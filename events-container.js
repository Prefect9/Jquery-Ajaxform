/* Js EventsContainer
 * Version: 1.00
 * Author: Prefect9
 * TG: https://t.me/it_dev9/
 */
(function () {
    "use strict";
    try {
        var EventsContainer = function () {
            var _callbacks = [],
                _return
            var add = function (_f) {
                if(typeof _f != "function") throw "you are trying to add a non-function like event"
                _callbacks.push(_f)
                return _return
            }
            var trigger = function (...args) {
                var _result = []
                for(var _f of _callbacks) _result.push(_f(...args))
                return _result
            }
            var clear = function () {
                _callbacks = []
                return _return
            }
            _return = { add:add, trigger:trigger, clear:clear }
            return _return
        }
        window.EventsContainer = EventsContainer
        window.EventsContainerVersion = "1.00"
    }catch (e) {
        console.error("EventsContainer error: "+e)
    }
})()