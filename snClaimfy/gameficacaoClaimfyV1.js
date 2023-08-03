function run() {
    var gr = new GlideRecord('x_jam_special_oppo_oportunidades_claims');
    gr.addEncodedQuery('^u_originador=7fc89ae9dbcab850b673c363149619c5');
    //gr.orderBy('name');
    //gr.setLimit(100);
    //gr.setWorkflow(false);
    //gr.autoSysFields(false);
    gr.query();
  
var horasCedente = 0;
var horasJive = 0;
  
    var log = [];
    while (gr.next()) {
        log.push(gr.getDisplayValue());










        // --------------------  ANALISE CEDENTE  --------------------
        var anaCedente = new GlideRecord('x_jam_special_oppo_tarefas_de_oportunidades_claim');
        anaCedente.addEncodedQuery('parent=' + gr.getUniqueValue() + '^u_tipo_tarefa=analise_cedente');
        anaCedente.query();
        var topcCedente = [];
        while (anaCedente.next()) {
            topcCedente.push(anaCedente.getUniqueValue());
        }

        //tempo de pausa topCedente
        var metric01 = new GlideRecord('metric_instance');
        metric01.addEncodedQuery('definition=88a2ed851bb3345089f687bfe54bcb96^value=pausado^table=x_jam_special_oppo_tarefas_de_oportunidades_claim^field=state^id=' + topcCedente);
        metric01.query();

        var pausa1 = [];
        while (metric01.next()) {
            pausa1.push(metric01.getValue('duration'));
        }

        
        for (i in pausa1) {
         //   gs.info(pausa1[i]);

            var dur1 = new GlideDuration();
            dur1.setValue(pausa1[i]);

      //      gs.info('duration: ' + dur1.getDisplayValue());
         //   gs.info('milisegundos:  ' + (dur1.getNumericValue()));
        //    gs.info('calculo horas:  ' + (dur1.getNumericValue() / 1000) / 3600);

            horasCedente += ((dur1.getNumericValue() / 1000) / 3600);
        }
    //  gs.info('aqui '+horasCedente)



        // ----------------------  ANALISE JIVE  ------------------------

        var anaJive = new GlideRecord('x_jam_special_oppo_tarefas_de_oportunidades_claim');
        anaJive.addEncodedQuery('parent=' + gr.getUniqueValue() + '^u_tipo_tarefa=analise_ppv');
        anaJive.query();
        var topcJive = [];
        while (anaJive.next()) {
            topcJive.push(anaJive.getUniqueValue());
        }

        //tempo de pausa topJive
        var metric02 = new GlideRecord('metric_instance');  
        metric02.addEncodedQuery('definition=88a2ed851bb3345089f687bfe54bcb96^value=pausado^table=x_jam_special_oppo_tarefas_de_oportunidades_claim^field=state^id=' + topcJive);
        metric02.query();

        var pausa2 = [];
        while (metric02.next()) {
            pausa2.push(metric02.getValue('duration'));
        }

        
        for (i in pausa2) {
      //      gs.info(pausa2[i]);

            var dur2 = new GlideDuration();
            dur2.setValue(pausa2[i]);

            gs.info('duration: ' + dur2.getDisplayValue()) ;
       //     gs.info('milisegundos:  ' + (dur2.getNumericValue()));
            gs.info('calculo horas:  ' + (dur2.getNumericValue() / 1000) / 3600);

            horasJive += ((dur2.getNumericValue() / 1000) / 3600);
        }
      
      gs.info('aqui '+horasJive)
      gs.info(' TAMANHO  '+pausa2.length)
      
      //-------------------- SOMA DAS HORAS ------------
        


        if (horasTotal > 24) {
            classificacaoLead = 'nao classificado';
        } else if (horasTotal <= 24) {
            classificacaoLead = 'bronze';
        } else if (horasTotal <= 12) {
            classificacaoLead = 'prata';
        } else if (horasTotal <= 5) {
            classificacaoLead = 'ouro';
        }





        //return topcJive + ' ----------  ' + pausa1 + ' horas Total:  ' + horasTotal;

















    }
  var horasTotal = horasCedente + horasJive;

        var calculoGameLead = horasTotal

  
    return horasTotal;
}
run();