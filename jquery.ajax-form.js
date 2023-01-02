/* Jquey AjaxForm
 * Version: 1.00
 * Author: Prefect9
 * TG: https://t.me/it_dev9/
 */
(function ($) {
    "use strict";
    try {
        $.fn.ajaxForm = function () {
            var _this = $(this)
            if(_this.length != 1) throw "You can initialize only one form at a time"
            if(_this.prop("tagName") != "FORM") throw "With this method, you can initialize only the <form> tag"
            return AjaxForm({
                form: _this[0],
                method: _this.attr("method"),
                url: _this.attr("action"),
                requestType: _this.data("request-type"),
                responseType: _this.data("response-type")
            })
        };
        var AjaxForm = function (options) {
            if(typeof window.EventsContainer != "function" ||
                isNaN(parseFloat(window.EventsContainerVersion)) ||
                parseFloat(window.EventsContainerVersion) < 1)
                throw "The EventsContainer library is not connected"

            var _method,                     // "post", "get"
                _url,                        // "https://example.com/", "/backend/api/auth", ""
                _requestType="urlencoded",   // urlencoded (default), json, formdata
                _responseType="json",        // json (default), text
                _form,
                _customData,
                _events = {
                    loading: window.EventsContainer(),
                    success: window.EventsContainer(),
                    error: window.EventsContainer()
                },
                _return

            if (typeof options != "object") throw "Invalid configuration object"

            if(typeof options.form == "object" && options.form.tagName == "FORM") _form = $(options.form)
            else _form = $("<form></form>")
            if(_form[0]["ajaxform-initialized"]) throw "AjaxForm already initialized"
            else _form[0]["ajaxform-initialized"] = true

            if (typeof options.method != "string" || !["post", "get"].includes(options.method.toLowerCase())) throw "Unknown sending method"
            _method = options.method.toLowerCase()

            if(typeof options.url == "string") _url = options.url
            else _url = ""

            if(options.requestType != undefined && !["urlencoded", "json", "form-data"].includes(options.requestType.toLowerCase())) throw "Unknown request type"
            else if(options.requestType != undefined) _requestType = options.requestType.toLowerCase()

            if(options.responseType != undefined && !["text", "json"].includes(options.responseType.toLowerCase())) throw "Unknown response type"
            else if(options.responseType != undefined) _responseType = options.responseType.toLowerCase()

            if(options.getData != undefined && options.getData != "function") throw "Invalid getData method"
            else if(options.getData != undefined) _customData = options.getData

            var get_form_data = function () {
                var _data = {}
                for(var _field of _form.find("input[type=text]")){
                    _field = $(_field)
                    var _name = _field.attr("name"),
                        _value = _field.val()
                    if(typeof _name == "string" && _name.trim().length) _data[_name] = _value
                }
                for(var _checkbox of _form.find("input[type=checkbox]")){
                    _checkbox = $(_checkbox)
                    var _name = _checkbox.attr("name"),
                        _value = _checkbox.prop("checked")
                    if(typeof _name == "string" && _name.trim().length) _data[_name] = _value
                }
                var _radio_names = []
                for(var _radio of _form.find("input[type=radio]")){
                    _radio = $(_radio)
                    var _name = _radio.attr("name")
                    if(typeof _name == "string" && _name.trim().length && !_radio_names.includes(_name)) _radio_names.push(_name)
                }
                for(var _radio_name of _radio_names){
                    var _radio_value = _form.find("input[type=radio][name="+_radio_name+"]:checked").val()
                    _data[_radio_name] = _radio_value
                }
                return _data
            }
            var sending_data = function () {
                var _data
                if(_customData != undefined) _data = _customData()
                else if(_requestType == "urlencoded"){
                    _data = new URLSearchParams()
                    var _getted_form_data = get_form_data()
                    for(var _name in _getted_form_data) _data.append(_name, _getted_form_data[_name])
                }else if(_requestType == "json"){
                    _data = get_form_data()
                }else if(_requestType == "form-data"){
                    _data = new FormData()
                    var _getted_form_data = get_form_data()
                    for(var _name in _getted_form_data) _data.append(_name, _getted_form_data[_name])
                }
                return _data
            }
            var send = function(){
                for(var loading_result of _events.loading.trigger(_form)){
                    if(loading_result != undefined) {
                        _events.error.trigger(loading_result)
                        return;
                    }
                }

                var ajax_options = { processData:false },
                    ajax_data = sending_data()
                if(typeof ajax_data != "object") throw "The data to be sent must be in Object1"
                ajax_options.method = _method
                ajax_options.url = _url
                switch (_requestType) {
                    case "urlencoded":
                        if(ajax_data.constructor.name != "URLSearchParams") throw "The data to be sent by URLEncoded must be in URLSearchParams class"
                        ajax_options.contentType = "application/x-www-form-urlencoded; charset=UTF-8"
                        ajax_options.data = ajax_data.toString()
                        break
                    case "json":
                        if(ajax_data.constructor.name != "Object") throw "The data to be sent by Json must be in Object2"
                        ajax_options.contentType = "application/json; charset=UTF-8"
                        ajax_options.data = JSON.stringify(ajax_data)
                        break
                    case "form-data":
                        if(ajax_data.constructor.name != "FormData") throw "The data to be sent by Json must be in FormData class"
                        ajax_options.contentType = false
                        ajax_options.data = ajax_data
                        break
                    default:
                        throw "Unsupported requestType"
                }
                switch(_responseType) {
                    case "json":
                        ajax_options.dataType = "json"
                        break
                    case "text":
                        ajax_options.dataType = "text"
                        break
                    default:
                        throw "Unsupported responseType"
                }
                ajax_options.error = function (jqXHR, textStatus) {
                    if(textStatus == "parsererror") _events.error.trigger("invalid_response")
                    else _events.error.trigger("no_internet_connection")
                }
                ajax_options.success = function (data) {
                    _events.success.trigger(data)
                }
                $.ajax(ajax_options)

                return _return
            }
            _form.on("submit", function (e) {
                e.preventDefault()
                send()
            })

            var loading = function(_f){
                _events.loading.add(_f)
                return _return
            }
            var success = function(_f){
                _events.success.add(_f)
                return _return
            }
            var error = function(_f){
                _events.error.add(_f)
                return _return
            }
            var clear_events = function(){
                _events.loading.clear()
                _events.success.clear()
                _events.error.clear()
            }
            _return = { send:send, loading:loading, success:success, error:error, clear_events:clear_events }

            return _return
        }
        window.AjaxForm = AjaxForm
        window.AjaxFormVersion = "1.00"
    }catch (e) {
        console.error("AjaxForm error: "+e)
    }
})(jQuery)