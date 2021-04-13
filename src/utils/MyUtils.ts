

export function arrayEquals(arr1, arr2) {
    if (arr1.length != arr2.length)
        return false;

    for (var i = 0, l = arr1.length; i < l; i++) {
        // Check if we have nested arr2s
        if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
            // recurse into the nested arr2s
            if (!arrayEquals(arr1[i], arr2[i]))
                return false;
        }
        else if (arr1[i] != arr2[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;

}

// Array.prototype.equals = function (array) {
//     // if the other array is a falsy value, return
//     if (!array)
//         return false;

//     // compare lengths - can save a lot of time 
//     if (this.length != array.length)
//         return false;

//     for (var i = 0, l = this.length; i < l; i++) {
//         // Check if we have nested arrays
//         if (this[i] instanceof Array && array[i] instanceof Array) {
//             // recurse into the nested arrays
//             if (!this[i].equals(array[i]))
//                 return false;
//         }
//         else if (this[i] != array[i]) {
//             // Warning - two different object instances will never be equal: {x:20} != {x:20}
//             return false;
//         }
//     }
//     return true;
// }