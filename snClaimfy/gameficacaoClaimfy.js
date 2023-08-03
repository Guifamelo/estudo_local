/*
Eu como sistema 

Quando um originador inclui o percentual de de comissão em uma oportunidade

Quero restringir essa comissão, de acordo com o valor do ativo e a categoria do Originador

Para que não seja mais possível a aplicação de comissões abusivas por parte do Originador, garantindo assim um maior retorno ao cedente



Regras:

Categorias:

1)  Não classificados: São aqueles parceiros que não atingiram o mínimo necessário para a categoria mais baixa.
Política de comissionamento: Média máxima de 4% e teto de 5% de comissão.

2)  Bronze: Parceiros que já possuem classificação mas estão abaixo da meta mínima

Política de comissionamento: Média máxima de 6% e teto de 8% de comissão.

3) Prata: Parceiros com bom desempenho e atingimento das metas mínimas.

Política de comissionamento: Média máxima de 7% e teto de 9% de comissão.

4)  Ouro: Parceiro com melhor desempenho (top originadores) que se destacam na geração de oportunidades de investimentos.

política de comissionamento: Média máxima de 8% e teto de 10% de comissão.

RPV´S (ATIVOS VALORES MENORES)

Política de comissionamento para RPV's: 

Média máxima de 8% e teto de 10% para todos os parceiros, sem distinção de categorias.





Outras Regras de Negócio para Comissionamento:

Deve ser apresentado na tela ao originador a sua média atual (média ponderada) e o teto.

Quando ele inserir o percentual de comissão o sistema deve aplicar a regra, de acordo com a categoria do parceiro

Exemplo:

RPV

média ponderada da comissão <= 8%

comissão teto  <= 10%

Esta regra (aplicação da média) deve ser aplicada a partir da implementação  - para fins de cálculos a média não se aplica a investimentos passados



Sobre o programa de gamificação

À saber,
O programa de gamificação, hoje, conta com 4 indicadores:

Número de oportunidades inseridas no sistema - representa 40% da pontuação;

Taxa de conversão - representa 40% da pontuação;

Recorrência - representa 10% da pontuação;

Leadtime (tempo de resposta na esteira) - representa 10% na pontuação.

*Estes indicadores vão mudando conforme nosso interesse na performance do canal.



Indicadores de performance:

Número de oportunidades (mês) - representa 50% da pontuação
Não Classificado - até 5
Bronze - 6 a 10
Prata - 11 a 20
Ouro - acima de 20



Taxa de Conversão - representa 30% da pontuação
Não Classificado - até 20%
Bronze - entre 20 e 40%
Prata - entre 40 e 70%
Ouro - acima de 70%



Frequência - representa 10% da pontuação
Não Classificado - <1 ativo por semana
Bronze - >= 1 e <2 ativos por semana
Prata - >= 2 e <5 ativos por semana
Ouro - >= 5 por semana



Lead Time (média de tempo de resposta na plataforma)- representa 10% da pontuação
Não Classificado - >24hs de média
Bronze - >12hs e <=24hs
Prata - >5hs e <=12hs de média
Ouro - até 5hs de média
*/


// 16:50 - 11/07/22

///////////////////
function run() {
    var gr = new GlideRecord('x_jam_special_oppo_oportunidades_claims');
    gr.addEncodedQuery('^u_originador=7fc89ae9dbcab850b673c363149619c5');  
    gr.query();
    
    var opocs = [];
    var investidos = [];
  
    while (gr.next()) {
        opocs.push(gr.getDisplayValue());           
      
      if(gr.getValue('fase_workflow_ppv') == 'investido'){
        investidos.push(gr.getDisplayValue());            
      }     
      
      //pegar a data de abertura. se menor q uma semana, ooouuu melhor fazer outro glideqrecord la em baixo..
      
      
    }
  
  var qtdeOpo = opocs.length;
  var qtdInv = investidos.length;
  var classificacaoOpo = '';
  var classificacaoInv = '';
  var classificacaoFreq = '';
  
  //Performance  (50% qtde de opocs, 30% Opoc Investidas, 10% Freq. 10% Leadtime)
  
  if(qtdeOpo < 6){
      classificacaoOpo = 'nao classificado'
  }else if(qtdeOpo < 11){
    classificacaoOpo = 'bronze'
  }else if(qtdeOpo < 21){
    classificacaoOpo = 'prata'
  }else if(qtdeOpo > 20){
    classificacaoOpo = 'ouro'
  }
  
 var conversaoInv = (qtdInv/qtdeOpo*100);
  
  if(conversaoInv < 20.99){
      classificacaoInv = 'nao classificado'
  }else if(conversaoInv < 39.99){
    classificacaoInv = 'bronze'
  }else if(conversaoInv < 69.99){
    classificacaoInv = 'prata'
  }else if(conversaoInv >= 70){
    classificacaoInv = 'ouro'
  }
  
 // var opocSemana = new GlideRecord('x_jam_special_oppo_oportunidades_claims')
  var opocSemana = new GlideRecord('x_jam_special_oppo_oportunidades_claims');
    opocSemana.addEncodedQuery('^opened_at>javascript:gs.endOfLastWeek()');   
    opocSemana.query();
  	var semanal = [];
    while (opocSemana.next()) {
        semanal.push(opocSemana.getDisplayValue());        
    }
  var semana = semanal.length
  
  if(semana < 1){
      classificacaoFreq = 'nao classificado'
  }else if(semana < 2){
    classificacaoFreq = 'bronze'
  }else if(semana < 5){
    classificacaoFreq = 'prata'
  }else if(semana >= 5){
    classificacaoFreq = 'ouro'
  }
  
  
    /*
  switch(qtdeOpo){
    case  < '6':
      classificacao = 'nao classificado'
      break;
    case  < '11':
      classificacao = 'bronze'
      break;
    case  < '21':
      classificacao = 'prata'
      break;
    case  > '26':
      classificacao = 'ouro'
      break;  
  }
  */
    
    
    
  gs.info(classificacaoFreq)
  
    return 'Total OPOCS: ' + qtdeOpo + ' Investidas: '+ qtdInv;
}
run();