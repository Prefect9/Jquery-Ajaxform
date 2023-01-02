# Jquery Ajaxform
## Dependencies
For the library to work, you need to connect [jQuery](https://jquery.com/download/) and [EventsContainer](https://github.com/Prefect9/Js-EventsContainer). Scripts with libraries need to be connected before the <script> tag with the AjaxForm library.
## jQuery property
Now for the html tag <form> you can apply `.ajaxForm()` and it will be sent to the server without reloading the page.
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
## Types of data received and sent
Types of data to be sent:
- `urlencoded` (by default)
- `json`
- `form-data`
To change the type of data being sent, add the `data-request-type` attribute to the form:
```html
<form action="" method="post" id="test_form" data-request-type="json">
```

Types of data received:
- `json`
- `text` (by default)
If the server returns data that does not match the expected type, the error event is called with the `invalid_response` argument. To change the type of data received, add the `data-response-type` attribute to the form:
```html
<form action="" method="post" id="test_form" data-response-type="json">
```