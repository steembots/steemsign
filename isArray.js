/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Array#isArray for older browsers.                                                             */  
/*    - Based on https://github.com/juliangruber/isarray.git                                      */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

// This is definitely a bit awkward, but it ensures that we can use isArray on older browsers.

var isArray = {};
isArray.toString = {}.toString;

isArray.isArray = Array.isArray || function(arr) {
    return toString.call(arr) == '[object Array]';
};
