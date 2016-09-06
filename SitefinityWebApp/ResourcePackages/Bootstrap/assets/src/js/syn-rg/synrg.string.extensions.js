/* String extensions
 * Copyright (c) 2016 O C Synnes - Syn-RG
 * Version 1.0 (27-06-2016)
 */
if (!String.format) {
    String.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}