


var opoc = new GlideRecord('x_jam_special_oppo_oportunidades_claims');
opoc.addEncodedQuery('^u_originador=6b51e8b71be209186cb6dcafe54bcbff');
opoc.query();

var horasCedente = 0;
var horasJive = 0;
var classificacaoLead = '';

var topcJivePausadas = [];

var topcCedentePausadas = [];

var log = [];
while (opoc.next()) {
    log.push(opoc.getDisplayValue());




    // --------------------  ANALISE CEDENTE  --------------------
    var anaCedente = new GlideRecord('x_jam_special_oppo_tarefas_de_oportunidades_claim');
    anaCedente.addEncodedQuery('parent=' + opoc.getUniqueValue() + '^u_tipo_tarefa=analise_cedente');
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



    if (pausa1.length > 0) {
        topcCedentePausadas.push('ok');
    }




    // ----------------------  ANALISE JIVE  ------------------------

    var anaJive = new GlideRecord('x_jam_special_oppo_tarefas_de_oportunidades_claim');
    anaJive.addEncodedQuery('parent=' + opoc.getUniqueValue() + '^u_tipo_tarefa=analise_ppv');
    anaJive.query();
    var topcJive = [];
    while (anaJive.next()) {
        topcJive.push(anaJive.getUniqueValue());
    }

    //tempo de pausa topJive
    var metric02 = new GlideRecord('metric_instance'); metric02.addEncodedQuery('definition=88a2ed851bb3345089f687bfe54bcb96^value=pausado^table=x_jam_special_oppo_tarefas_de_oportunidades_claim^field=state^id=' + topcJive);
    metric02.query();

    var pausa2 = [];
    while (metric02.next()) {
        pausa2.push(metric02.getValue('duration'));
    }


    for (i in pausa2) {
        //      gs.info(pausa2[i]);

        var dur2 = new GlideDuration();
        dur2.setValue(pausa2[i]);

        gs.info('duration: ' + dur2.getDisplayValue());
        //     gs.info('milisegundos:  ' + (dur2.getNumericValue()));
        gs.info('calculo horas:  ' + (dur2.getNumericValue() / 1000) / 3600);

        horasJive += ((dur2.getNumericValue() / 1000) / 3600);
    }

    gs.info('aqui ' + horasJive)
    gs.info(' TAMANHO  ' + pausa2)

    if (pausa2.length > 0) {
        topcJivePausadas.push('ok');
    }



    //return topcJive + ' ----------  ' + pausa1 + ' horas Total:  ' + horasTotal;





}


//-------------------- SOMA DAS HORAS e CLASSIFICAÇÃO LEADTIME ------------
var horasTotal = horasCedente + horasJive;

var calculoGameLead = (horasTotal / log.length)





if (calculoGameLead > 24) {
    classificacaoLead = 'nao classificado';
} else if (calculoGameLead <= 24) {
    classificacaoLead = 'bronze';
} else if (calculoGameLead <= 12) {
    classificacaoLead = 'prata';
} else if (calculoGameLead <= 5) {
    classificacaoLead = 'ouro';
}





//  return 'Cedente= '+horasCedente+'  Jive= '+horasJive+'  Total= '+ horasTotal;
return calculoGameLead + ' Portanto o cedente é Classe ' + classificacaoLead






