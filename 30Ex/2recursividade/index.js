//é tipo uma repetição sem o laço de reepetição. quebrar o problema complexo em pequenos pedaçõs, 
//comum "dar o exemplo para o codigo, fazer o primeiro, segundo... e a partir daí ele consegue calcular o resto."
var qtde = prompt('Quantas vezes?');
function chunck(num){
    if(num == 0){
        return ''
    }else if(num == 1){
        return 'Chunk'
    }else {
        return 'Chunk-'+chunck(num-1)
    }    
}
alert(chunck(qtde))
console.log(chunck(5))