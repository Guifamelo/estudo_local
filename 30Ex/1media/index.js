  function media(...notas) { //desestruturração de array. pega os numeros de entrada e bota na
    //let notas = [];
    let nota = 0;
    /*
    for (i in notas) {
        nota += notas[i]
    }
    let media = (nota / (notas.length));
    console.log(media);
    */
    notas.forEach(elemento =>{
        nota += elemento
    })
    let media = (nota / (notas.length));
    console.log(media);
}
console.log(media(1,2,3,4,2));
