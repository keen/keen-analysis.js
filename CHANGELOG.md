<a name="1.0.1"></a>
# 1.0.1 Update to keen-core.js@0.0.3

**New:**
* Minor update imports keen-core.js@0.0.3 with `Keen.ready(fn)` handler and an internal `domReady` function


<a name="1.0.0"></a>
# 1.0.0 Remove keen-tracking.js

**Change:**
* Important update: [keen-tracking.js](https://github.com/keen/keen-tracking.js) is no longer built into this SDK (#7). This is an intentional decision to prevent publicly hosted releases of this essential SDK from being blacklisted and blocked by AdBlockers. Learn more about installing keen-tracking.js [here](https://github.com/keen/keen-tracking.js#install-the-library).


<a name="0.1.1"></a>
# 0.1.1 Fix request handling

**New:**
* JSON module in `/lib/utils/serialize.js` is now properly defined (#4)
* Request objects are not correctly constructed to resolve issue where stray `?api_key=` was added to basic GET requests (#5)


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
