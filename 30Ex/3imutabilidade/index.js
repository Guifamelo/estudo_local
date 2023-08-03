//inverter array sem destrui-la., no caso criando outra.., Imutabilidade é mto importante para programação funcional.
//desafio é não utilizar métodos do Obj Global Array do js (reverse, map, forEach,etc)
let arr = [1, 2, 3, 4, 5];
console.log(arr);
function inverte(arr) {
    let arr2 = arr;
    arr2[0] = arr[arr.length - 1];
    arr2[1] = arr[arr.length - 2];
    console.log(arr);
    // console.log(arr2)   
}//inverte(arr);

let arr3 = [1, 2, 3, 4, 5];
let arr5 = [true, false, true, true]
let arr4 = []
function rev(arra) {
    for (i in arra) {
        arr4.push(arra[(arra.length - 1)-i])
    }
    console.log(arr4)
}rev(arr5)

