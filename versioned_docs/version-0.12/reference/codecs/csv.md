# csv

The `csv` codec provides marshalling support for the Comma Separated Volume format.

The codec expects a single line of [RFC-4180](https://datatracker.ietf.org/doc/html/rfc4180) CSV format data.

If there iss more than a single line in the message, the lines after the first will be discarded unless
a `lines` preprocessor is used during deserialization.

## Example

The following CSV line
```csv
"some "" field",1234567,other_text,"2020-01-01 00:00:00"
```

Will get transalted the following equivalent tremor value:

```json
[
    "some \" field",
    "1234567",
    "other_text",
    "2020-01-01 00:00:00"
]    
```

