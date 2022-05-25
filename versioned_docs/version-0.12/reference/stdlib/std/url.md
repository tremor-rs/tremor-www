
# url

 The url module contains functions to work on urls
## Functions

### decode(str)

Returns a decoded UTF-8 url encoded string

> ```tremor
> "beep:snot/foobar" == url::decode("beep%3Asnot%2Ffoobar")
> ```

Returns a `string`

### encode(str)

Returns a url encoded UTF-8 string

> ```tremor
> use std::url;
>
> "beep%3Asnot%2Ffoobar" == url::encode("beep:snot/foobar")
> ```

Returns a `string`
