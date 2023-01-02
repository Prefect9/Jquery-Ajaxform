# Jquery Ajaxform
## Dependencies
For the library to work, you need to connect [jQuery](https://jquery.com/download/) and [EventsContainer](https://github.com/Prefect9/Js-EventsContainer). Scripts with libraries need to be connected before the <script> tag with the AjaxForm library.



## jQuery property
Now for the html tag \<form\> you can apply `.ajaxForm()` and it will be sent to the server without reloading the page.



## Examples
Only the following fields will be sent via ajax: text, checkbox and radio.
```html
<form action="" method="post" id="demo_form" data-request-type="form-data">
    <input type="text" name="name" value="Name">
    <input type="checkbox" name="checkbox">
    <input type="radio" name="r_1" value="1">
    <input type="radio" name="r_1" value="2">
    <input type="radio" name="r_1" value="3">
    <input type="radio" name="r_2" value="1">
    <input type="radio" name="r_2" value="2">
    <input type="radio" name="r_2" value="3">
    <button type="submit">Submit</button>
</form>
```

Initialize `.ajaxform()` along with page loading.
```javascript
var form = $("#demo_form").ajaxForm()
```

You can add a `loading` event. It is called before sending ajax and can be used to show a stub when submitting a form. Validation can also be performed at this stage, if `loading` returns a value other than `undefined`, the `error` event with this returned value will be called.
At this stage, before sending ajax, you can change the values of the fields.
```javascript
form.loading(function (sended_form) {
    if(!sended_form.find("input[name=name]").val().length) return "invalid:empty_name"
})
```

The `error` event is used to get errors. The following values can be used as an `error_code` argument to the function:
- `no_internet_connection`
- `invalid_response` - the server returned an invalid response
- the value returned by the `loading` event if it is not `undefined`
```javascript
form.error(function (error_code) {
     console.log("error: " + error_code)
 })
```

The `success` event is used to get the result when the server responds successfully.
```javascript
form.success(function (data) {
    console.log("success", data)
})
```

The number of `success`, `error` and `loading` events can be set to an unlimited number.

To send the form to the user, just press Enter in any field or click on the submit button. You can also submit the form by calling the standard js submit trigger on the \<form\> element or using the API:
```javascript
// Sending a form via jQuery
$("#demo_form").submit()

// Sending a form via the ajaxForm API
form.send()
```



## Types of data received and sent
Types of data to be sent:
- `urlencoded` _(by default)_
- `json`
- `form-data`

To change the type of data being sent, add the `data-request-type` attribute to the form:
```html
<form action="" method="post" id="test_form" data-request-type="json">
```

Types of data received:
- `json` _(by default)_
- `text`

If the server returns data that does not match the expected type, the error event is called with the `invalid_response` argument. To change the type of data received, add the `data-response-type` attribute to the form:
```html
<form action="" method="post" id="test_form" data-response-type="json">
```



## API
You can also create an ajaxForm from the constructor with its own parameters: method, url, etc. The ajaxForm created from the constructor will create an empty form, the values of the fields of which you can add/change when the `loading` event is called.
```javascript
var options = {
    method: "post",
    url: "/",
    ...
}
var form = new AjaxForm(options)
```

### Options
##### options.form [`HTMLElement`, _optional_]
the html element to which the ajaxForm object will be bound. If omitted, an empty form will be created.

##### options.method [`enum`, _required_]
sending method: `get`, `post`.

##### options.url [`string`, _optional_]
ajax delivery address: `""`, `"/"`, `"https://example.com/"`. Default: `""`.

##### options.requestType [`_enum_`, _optional_]
type of data being sent: `urlencoded`, `json`, `form-data`. Default: `urlencoded`.

##### options.responseType [`enum`, _optional_]
type of data expected from the server: `text`, `json`. Default: `json`.

##### options.getData [`function`, _optional_]
an arbitrary function for transmitting data to be sent via ajax. If the `getData` function is specified, no data is taken from the form fields. By default, data is serialized from form fields that have the name attribute.