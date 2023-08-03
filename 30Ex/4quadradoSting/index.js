//resolvendo por String
/*
function quadrado(num) {
    let valor = '';
    var nv = num.toString();

    for (i in nv) {
       // valor += Number(nv[i]) * Number(nv[i]).toString();
        valor += Math.pow(Number(nv[i]),2).toString();
        console.log(nv[i]);
        console.log(typeof (nv));
    }
    fin = Number(valor);
    console.log(typeof(fin))
    return Number(valor);    
}
console.log(quadrado(14));
*/

//resolvendo por Array;
function square(num) {
    const digtsArray = num.toString().split('');
    const squareArray = digtsArray.map(digit => Number(digit) ** 2).join('');
    return Number(squareArray);
}
console.log(square(14));