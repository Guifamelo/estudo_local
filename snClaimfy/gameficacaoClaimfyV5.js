function run() {
    var originador = new GlideRecord('sys_user_group');
    originador.setLimit(10);
    originador.query();


    var nomes = [];
    var originadores = [];
    while (originador.next()) {
        originadores.push(originador.getUniqueValue());
        nomes.push(originador.getDisplayValue());
    }



    for (i in originadores) {

        var gr = new GlideRecord('x_jam_special_oppo_oportunidades_claims');
        gr.addEncodedQuery('^u_originador=' + originadores[i]);
        gr.query();

        var opocs = [];
        var investidos = [];

        while (gr.next()) {
            opocs.push(gr.getDisplayValue());

            if (gr.getValue('fase_workflow_ppv') == 'investido') {
                investidos.push(gr.getDisplayValue());
            }

            //	pegar a data de abertura. se menor q uma semana, ooouuu melhor fazer outro glideqrecord la em baixo..      

        }

        var qtdeOpo = opocs.length;
        var qtdInv = investidos.length;
        var classificacaoOpo = '';
        var classificacaoInv = '';
        var classificacaoFreq = '';
        var classificacaoLead = '';



        //		Performance  (50% qtde de opocs, 30% Opoc Investidas, 10% Freq. 10% Leadtime)

        if (qtdeOpo < 6) {
            classificacaoOpo = 'nao classificado';
        } else if (qtdeOpo < 11) {
            classificacaoOpo = 'bronze';
        } else if (qtdeOpo < 21) {
            classificacaoOpo = 'prata';
        } else if (qtdeOpo > 20) {
            classificacaoOpo = 'ouro';
        }

        var conversaoInv = (qtdInv / qtdeOpo * 100);

        if (conversaoInv < 20.99) {
            classificacaoInv = 'nao classificado';
        } else if (conversaoInv < 39.99) {
            classificacaoInv = 'bronze';
        } else if (conversaoInv < 69.99) {
            classificacaoInv = 'prata';
        } else if (conversaoInv >= 70) {
            classificacaoInv = 'ouro';
        }

        // var opocSemana = new GlideRecord('x_jam_special_oppo_oportunidades_claims')
        var opocSemana = new GlideRecord('x_jam_special_oppo_oportunidades_claims');
        opocSemana.addEncodedQuery('^opened_at>javascript:gs.endOfLastWeek()');
        opocSemana.query();
        var semanal = [];
        while (opocSemana.next()) {
            semanal.push(opocSemana.getDisplayValue());
        }
        var semana = semanal.length;

        if (semana < 1) {
            classificacaoFreq = 'nao classificado';
        } else if (semana < 2) {
            classificacaoFreq = 'bronze';
        } else if (semana < 5) {
            classificacaoFreq = 'prata';
        } else if (semana >= 5) {
            classificacaoFreq = 'ouro';
        }


        var pausaAnalise = new GlideRecord('x_jam_special_oppo_tarefas_de_oportunidades_claim');
        pausaAnalise.addEncodedQuery('^u_tipo_tarefa=analise_cedente^ORu_tipo_tarefa=analise_jive^parent=' + gr.getValue('sys_id'));
        pausaAnalise.query();


        //gs.info('Class OPOC >  ' + classificacaoOpo);
        //gs.info('Class INV >  ' + classificacaoInv);
        //gs.info('Class FREQ > ' + classificacaoFreq);












        /////////////////////////////////  LEADTIME  //////////////////////////////////////////













        var opoc = new GlideRecord('x_jam_special_oppo_oportunidades_claims');
        opoc.addEncodedQuery('^u_originador=' + originadores[i]);
        opoc.query();

        var horasCedente = 0;
        var horasJive = 0;


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

                //    gs.info('duration: ' + dur2.getDisplayValue());
                //     gs.info('milisegundos:  ' + (dur2.getNumericValue()));
                //    gs.info('calculo horas:  ' + (dur2.getNumericValue() / 1000) / 3600);

                horasJive += ((dur2.getNumericValue() / 1000) / 3600);
            }

            //  gs.info('aqui ' + horasJive)
            //   gs.info(' TAMANHO  ' + pausa2)

            if (pausa2.length > 0) {
                topcJivePausadas.push('ok');
            }



            //return topcJive + ' ----------  ' + pausa1 + ' horas Total:  ' + horasTotal;



        }


        //-------------------- SOMA DAS HORAS e CLASSIFICAÇÃO LEADTIME ------------
        var horasTotal = horasCedente + horasJive;

        var calculoGameLead = (horasTotal / log.length);


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
        //return calculoGameLead + ' Portanto o cedente é Classe ' + classificacaoLead


        // gs.info('Class LEAD >  ' + classificacaoLead);






        ////////////////////////////////////////////////////////////////////////////



        // CLASSIFICAÇÃO GLOBAL: 

        var classificacaoGlobal = 0;

        if (classificacaoOpo == 'nao classificado') {
            classificacaoGlobal += 0;
        } else if (classificacaoOpo == 'bronze') {
            classificacaoGlobal += 12.5;
        } else if (classificacaoOpo == 'prata') {
            classificacaoGlobal += 32.5;
        } else if (classificacaoOpo == 'ouro') {
            classificacaoGlobal += 50;
        }

        if (classificacaoInv == 'nao classificado') {
            classificacaoGlobal += 0;
        } else if (classificacaoInv == 'bronze') {
            classificacaoGlobal += 7.5;
        } else if (classificacaoInv == 'prata') {
            classificacaoGlobal += 19.5;
        } else if (classificacaoInv == 'ouro') {
            classificacaoGlobal += 30;
        }

        if (classificacaoFreq == 'nao classificado') {
            classificacaoGlobal += 0;
        } else if (classificacaoFreq == 'bronze') {
            classificacaoGlobal += 2.5;
        } else if (classificacaoFreq == 'prata') {
            classificacaoGlobal += 6.5;
        } else if (classificacaoFreq == 'ouro') {
            classificacaoGlobal += 10;
        }


        if (classificacaoLead == 'nao classificado') {
            classificacaoGlobal += 0;
        } else if (classificacaoLead == 'bronze') {
            classificacaoGlobal += 2.5;
        } else if (classificacaoLead == 'prata') {
            classificacaoGlobal += 6.5;
        } else if (classificacaoLead == 'ouro') {
            classificacaoGlobal += 10;
        }

        var classificaGeral = '';
        var classificaID = '';

        if (classificacaoGlobal <= 20) {
            classificaGeral = 'nao classificado';
        } else if (classificacaoGlobal <= 40) {
            classificaGeral = 'bronze';
            classificaID = 'cab4fa6b1be1c1d089f687bfe54bcbb0';
        } else if (classificacaoGlobal <= 80) {
            classificaGeral = 'prata';
            classificaID = '4ca43a6b1be1c1d089f687bfe54bcb21';
        } else if (classificacaoGlobal <= 100) {
            classificaGeral = 'ouro';
            classificaID = '63643a2b1be1c1d089f687bfe54bcb8e';
        }

        var comissao = '';
        if (classificaGeral == 'nao classificado') {
            comissao = 5;
        } else if (classificaGeral == 'bronze') {
            comissao = 8;
        } else if (classificaGeral == 'prata') {
            comissao = 9;
        } else if (classificaGeral == 'ouro') {
            comissao = 10;
        }





        gs.info('Originador: ' + nomes[i].toLowerCase() + '  ' + originadores[i] + ' GERAL: ' + classificaGeral + '  :. comissão= ' + comissao + '%');


        var grupo = originadores[i];
        var classificacaoIntermediario = classificaGeral;
        var comissaoIntermediario = comissao;



        var grGrupo = new GlideRecord('sys_user_group');
        grGrupo.get(originadores[i]);

        gs.info(grGrupo.getValue('name'));
        var nomeGrupo = grGrupo.getValue('name');



        var company = new GlideRecord('core_company');
        company.addQuery('u_nome_geral', nomeGrupo);
        company.query();

        while (company.next()) {
            var companyId = company.getUniqueValue();

            gs.info('COMPANY: ' + companyId);


            var inter = new GlideRecord('x_jam_special_oppo_intermediario_claim');
            inter.addQuery('number_prestador', companyId);
            inter.query();

            while (inter.next()) {
                gs.info('------aaaaaaaaaaaaaaaaaa ' + inter.getDisplayValue());

                gs.info('------aaaaaaaaaaaaaaaaaa ' + inter.getValue('classificacao'));




                inter.setValue('classificacao', classificaID);
                inter.setValue('comissao_campanha', comissaoIntermediario);
                inter.setValue('active', true);
                inter.update();






            }








        }



    }


}
run();