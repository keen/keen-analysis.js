<a name="0.1.1"></a>
# 0.1.1 Fix request construction

**New:**
* JSON module in `/lib/utils/serialize.js` is now properly defined (#4)
* Request objects are not correctly constructed to resolve issue where stray `?api_key=` was added to basic GET requests


<a name="0.1.0"></a>
# 0.1.0 Bluebird

**New:**
* Internal promises are now handled by bluebird.js (core)
* HTTP requests now support cancelation (via a `.cancel()` method) which can be called on active requests


<a name="0.0.3"></a>
# 0.0.3 Fixed query handling

**FIXED:**
* <client>.query() correctly requires two arguments, and appends "/result" to URLs when fetching the result of saved query resources.


<a name="0.0.2"></a>
# 0.0.2 Bower

**NEW:**
* Publish to bower


<a name="0.0.1"></a>
# 0.0.1 Hello, world!

**NEW:**
* [Everything](./README.md) :)
