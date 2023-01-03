/* Jquey AjaxForm
 * Version: 1.02
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
            return new AjaxForm({
                form: _this[0],
                method: _this.attr("method"),
                url: _this.attr("action"),
                requestType: _this.data("request-type"),
                responseType: _this.data("response-type"),
                showProgress: _this.data("show-progress") == "true"
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
                _showProgress=false,
                _events = {
                    progress: new window.EventsContainer(),
                    loading: new window.EventsContainer(),
                    success: new window.EventsContainer(),
                    error: new window.EventsContainer()
                }

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

            if(options.showProgress === true) _showProgress = true

            var get_form_data = function () {
                var _data = {}
                for(var _field of _form.find("input[type=text], input[type=hidden], input[type=password], input[type=email], input[type=phone], input[type=tel], input[type=search], input[type=number], input[type=date], input[type=datetime], input[type=time], input[type=datetime-local]")){
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
                for(var _file_input of _form.find("input[type=file]")){
                    _file_input = $(_file_input)
                    var _multiple = false,
                        _name = _file_input.attr("name"),
                        _data_field
                    if(_file_input.attr("multiple") == "multiple") _multiple = true

                    if(_file_input[0].files.length < 1) continue;
                    if(_multiple){
                        _data_field = []
                        for(var _file_input_file of _file_input[0].files) _data_field.push(_file_input_file)
                    }else _data_field = _file_input[0].files[0]
                    if(typeof _name == "string" && _name.trim().length) _data[_name] = _data_field
                }
                return _data
            }
            var sending_data = function () {
                var _data_form,
                    _data_return
                if(_customData != undefined) _data_form = _customData()
                else _data_form = get_form_data()
                if(typeof _data_form != "object") throw "The data to be sent must be in Object"

                if(_requestType == "urlencoded"){
                    _data_return = new URLSearchParams()
                    for(var _name in _data_form) _data_return.append(_name, _data_form[_name])
                }else if(_requestType == "json"){
                    _data_return = _data_form
                }else if(_requestType == "form-data"){
                    _data_return = new FormData()
                    for(var _name in _data_form) _data_return.append(_name, _data_form[_name])
                }else throw "Unknown request type"
                return { prepared:_data_return, original:_data_form }
            }
            var send = function(){
                var ajax_data = sending_data()
                for(var loading_result of _events.loading.trigger(_form, ajax_data["original"])){
                    if(loading_result != undefined) {
                        _events.error.trigger(loading_result)
                        return;
                    }
                }
                if(_showProgress) _events.progress.trigger(0)

                var ajax_options = { processData:false }
                ajax_options.method = _method
                ajax_options.url = _url
                switch (_requestType) {
                    case "urlencoded":
                        if(ajax_data["prepared"].constructor.name != "URLSearchParams") throw "The data to be sent by URLEncoded must be in URLSearchParams class"
                        ajax_options.contentType = "application/x-www-form-urlencoded; charset=UTF-8"
                        ajax_options.data = ajax_data["prepared"].toString()
                        break
                    case "json":
                        if(ajax_data["prepared"].constructor.name != "Object") throw "The data to be sent by Json must be in Object"
                        ajax_options.contentType = "application/json; charset=UTF-8"
                        ajax_options.data = JSON.stringify(ajax_data["prepared"])
                        break
                    case "form-data":
                        if(ajax_data["prepared"].constructor.name != "FormData") throw "The data to be sent by Json must be in FormData class"
                        ajax_options.contentType = false
                        ajax_options.data = ajax_data["prepared"]
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
                ajax_options.error = function (jqXHR, textStatus) { console.log(jqXHR)
                    if(textStatus == "parsererror") _events.error.trigger("invalid_response")
                    else if(jqXHR.status !== 0) _events.error.trigger("server_error")
                    else _events.error.trigger("no_internet_connection")
                    if(_showProgress) _events.progress.trigger(100)
                }
                ajax_options.success = function (data) {
                    _events.success.trigger(data)
                    if(_showProgress) _events.progress.trigger(100)
                }
                if(_showProgress){
                    var _xhr = function () {
                        var xhr = new window.XMLHttpRequest()
                        xhr.upload.addEventListener("progress", function (evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = evt.loaded / evt.total
                                percentComplete = parseInt(percentComplete * 100)
                                _events.progress.trigger(percentComplete)
                            }
                        }, false);
                        return xhr;
                    }
                }
                $.ajax(ajax_options)

                return this
            }
            _form.on("submit", function (e) {
                e.preventDefault()
                send()
            })

            var loading = function(_f){
                _events.loading.add(_f)
                return this
            }
            var success = function(_f){
                _events.success.add(_f)
                return this
            }
            var error = function(_f){
                _events.error.add(_f)
                return this
            }
            var progress = function(_f){
                _events.progress.add(_f)
                return this
            }
            var clear_events = function(){
                _events.loading.clear()
                _events.success.clear()
                _events.error.clear()
                return this
            }

            this.send = send
            this.loading = loading
            this.success = success
            this.error = error
            this.progress = progress
            this.clear_events = clear_events
        }
        window.AjaxForm = AjaxForm
        window.AjaxFormVersion = "1.02"
    }catch (e) {
        console.error("AjaxForm error: "+e)
    }
})(jQuery)