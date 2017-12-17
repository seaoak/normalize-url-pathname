# normalize-url-pathname

normalize a string as pathname part of URL whose scheme is "http" or "https".

This API returns *canonical* pathname, that is:
- should not be empty
- should start with "`/`" (U+002F)
- should be separated with "`/`" (U+002F)
- should not contain an element "`..`" (U+002E U+002E)
- should not contain an element "`.`" (U+002E)
- should not contain an empty element

For more precise definition, please refer to:
- [RFC3986](https://tools.ietf.org/html/rfc3986)
- [WHATWG Specification](https://url.spec.whatwg.org/)

Note that:
- An unnecessary (redundant) percent-encoded character (especially "`/`")  is decoded before processing


## Example

```javascript
const normalizer = require('normalize-url-pathname');

const canonicalPathname = normalizer(target);
if (! canonicalPathname) throw new TypeError('invalid pathname: ' + target);
const targetUrl = new URL(href);
targetUrl.pathname = canonicalPathname;
```


## License

MIT


## Author

Seaoak

https://seaoak.jp
