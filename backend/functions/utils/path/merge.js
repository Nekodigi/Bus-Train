
module.exports.mergeOverriteA = (a, b ) => {//
    //console.log(a.length, b.length);
    a.forEach((item, i) => {
        let resIndex = b.findIndex(item2 => item2.hash === item.hash);
        let res = undefined;
        if(resIndex !== -1){
            a[i] = b[resIndex];
            b.splice(resIndex, 1);
        } 
    });
    //console.log(a.length, b.length);
    a = a.concat(b);
    //console.log(a.length);
    return a;
}