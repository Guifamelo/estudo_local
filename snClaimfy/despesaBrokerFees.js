var gr = new GlideRecord('x_jam_special_oppo_tarefas_de_oportunidades_claim');
gr.get('d054db061bf8d19440a50dcbe54bcb83');
//gr;
var current = gr
//current

var tipo_despesa = '4c01b22d1bb824d05e0d86afe54bcb3a';
    if (parseFloat(current.parent.u_valor_negociado_cedente) < 1000000) {
        var ana = new GlideRecord('x_jam_special_oppo_tarefas_de_oportunidades_claim');
        ana.addEncodedQuery('parent=' + current.getValue('parent') + '^u_tipo_tarefa=analise_ppv');
        ana.query();
      if (ana.next()) {
            var utilsDespesa = new x_jam_special_oppo.Despesas_Claimfy();

            var number_oportunidade = current.getValue('parent');
        
        var parent = new GlideRecord('x_jam_special_oppo_oportunidades_claims')
        parent.get(number_oportunidade)
        
            var opened_by = parent.getValue('opened_by');
            var u_veiculo = parent.getValue('u_veiculo');
            var valor = ana.getValue('u_valor_correspondente_originador');

        var user = new GlideRecord('sys_user')
        user.get(opened_by)
        
            var number_prestador = user.getValue('company');
      
        /*
        if (number_prestador = undefined){
          number_prestador = 'fe27fde8dba3e300195309a0ba961983'
          valor = 0
        }
        */
         gs.info('prestsa '+number_prestador)
        if (number_prestador == 'fe27fde8dba3e300195309a0ba961983'){          
          valor = 0
          //return;
        }
        
           // var indicador = utilsDespesa._getPercentQuery(number_prestador).originador_indicador.number_prestador;

          
          	gs.info(number_oportunidade)	
          gs.info(opened_by)
          gs.info(u_veiculo)
          gs.info(valor)
          gs.info('prestsa '+number_prestador)
     //     gs.info(indicador)
          gs.info(ana.getDisplayValue())
          gs.info('OI')
          
          /*  if (!indicador.nil()) {
                var valorIndicado = valor * utilsDespesa.getPercentCampanha(indicador);
                utilsDespesa.criarComissao(number_oportunidade, indicador, valorIndicado, opened_by, u_veiculo, tipo_despesa);
                valor -= valorIndicado;
            }*/
            utilsDespesa.criarComissao(number_oportunidade, number_prestador, valor, opened_by, u_veiculo, tipo_despesa);
        }
    }