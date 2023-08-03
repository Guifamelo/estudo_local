(function executeRule(current, previous /*null when async*/) {

    if (current.getValue('tipo_de_pessoa') == "juridica") {
        var filtroCPF = 'u_string_cnpj=' + current.u_cnpj_ppv;
    } else {
        filtroCPF = 'u_string_cnpj=000' + current.cpf_cedente;
    }

    var grContato = new GlideRecord('core_company');
    grContato.addEncodedQuery(filtroCPF);
    grContato.query();
    grContato.next();

    var regexLetras = /[A-Z]|[a-z]/g;
    var numero = current.number.toString();
    var numeroSolicitacaoS = numero.replace(regexLetras, '');

    if (current.getValue('opened_by') == '31144bec1b08c51040a50dcbe54bcb00') {
        var carteira = "b1fd75591bd4895089f687bfe54bcbba";
    } else {
        // Cadastrar carteira PPV
        var originador = current.opened_by.company.toString();
        carteira = '';
        var nomeFantasia = current.opened_by.company.u_nome_geral.toString();
        nomeFantasia.toUpperCase();
        var nomeCarteira = current.u_nome_carteira.toString();
        nomeCarteira.toUpperCase();
        var carteiraDisplay = "";
        var gestor = '9ad626c013097a00472f3d7ed144b04e';
        var nomeFinal = '';

        nomeFinal = nomeCarteira == '' ? nomeFantasia : nomeCarteira;

        var grCarteira = new GlideRecord('x_jam_special_oppo_x_carteira');
        grCarteira.addEncodedQuery('u_parceiro_originador=' + originador);
        grCarteira.query();

        if (grCarteira.next()) {
            carteiraDisplay = grCarteira.getValue('u_carteira');
            carteira = grCarteira.getUniqueValue();
            if (current.u_subtipo_ativo == 'direito_creditorio_trabalhista' && current.u_originador == '') {
                carteiraDisplay = 'CASO TRABALHISTA GERAL CLAIMFY';
                carteira = 'e54600a41bd3151040a50dcbe54bcb08';
            }
        } else {
            grCarteira.initialize();
            grCarteira.setValue('u_empresa', '1');
            grCarteira.setValue('u_veiculo', current.getValue('u_veiculo'));
            grCarteira.setValue('u_carteira', "PARCERIA - " + nomeFinal);
            grCarteira.setValue('u_gestor', gestor);
            //grCarteira.setValue('u_tipo_do_ativo', 'Precatórios');  Campo é calculado pelo u_cluster
            grCarteira.setValue('u_administrativo', '2');
            grCarteira.setValue('u_reembolsavel', '1');
            grCarteira.setValue('u_parceiro_originador', originador);
            grCarteira.insert();
            carteira = grCarteira.getUniqueValue();
            carteiraDisplay = grCarteira.getValue('u_carteira');
        }
    }

    //Cadastro de caso
    var nomeCedente = current.tipo_de_pessoa == 'juridica' ? current.u_razao_social : current.u_nome_cedente;
    nomeCedente.toUpperCase();
    var cpfcnpj = current.tipo_de_pessoa == 'juridica' ? current.u_cnpj_ppv : current.cpf_cedente;
    var tipoPessoa = current.getValue('tipo_de_pessoa') == 'fisica' ? 'Física' : 'Jurídica';

    if (current.getValue('opened_by') == '31144bec1b08c51040a50dcbe54bcb00') {
        var nomeCaso = "Parceria Sindifisco - " + nomeCedente + " " + numeroSolicitacaoS;
    } else {
        carteiraDisplay.toUpperCase();
        nomeCaso = carteiraDisplay + " - " + nomeCedente + " " + numeroSolicitacaoS;
    }


    var ativoCaso = current.getValue('u_subtipo_ativo');
    if (ativoCaso == 'precatorio') {
        var cluster = 10
    } else if (ativoCaso == 'direito_creditorio_trabalhista') {
        cluster = 21
    } else if (ativoCaso == 'ups_eletrobras') {
        cluster = 22
    } else if (ativoCaso == 'direito_creditorio') {
        cluster = 23
    }

    var grCaso = new GlideRecord('x_jam_special_oppo_caso');
    grCaso.initialize();
    grCaso.setValue('u_caso', nomeCaso);
    grCaso.setValue('u_carteira', carteira);
    grCaso.setValue('u_oportunidade_claim', current.getUniqueValue());
    grCaso.setValue('u_tese', current.u_tese);
    grCaso.setValue('u_cluster', 10);
    grCaso.setValue('u_classe_de_ativo', 'fcd712b91be4c950c9270e9fe54bcb87');
    grCaso.setValue('u_cedente', grContato.getUniqueValue());
    grCaso.setValue('u_cpf_cnpj', cpfcnpj);
    grCaso.setValue('u_investido', 'nao');
    grCaso.setValue('u_veiculo', current.getValue('u_veiculo'));
    grCaso.setValue('u_substituicao_processual_protocolada', 'nao');
    if (current.getValue('u_subtipo_ativo') == 'precatorio') {
        grCaso.setValue('u_lei_orcamentaria', 'sim');
        grCaso.setValue('u_data_loa', current.getDisplayValue('loa') + '-07-01');
    } else {
        grCaso.setValue('u_lei_orcamentaria', 'nao');
    }
    grCaso.setValue('u_prec_dir', current.getValue('u_subtipo_ativo'));
    grCaso.setValue('u_tipo_precatorio', current.getValue('u_esfera'));

    grCaso.setValue('u_administrativo', '0');
    grCaso.setValue('u_tipo_rateio', 'nao_aplicavel');

    grCaso.setValue('u_tipo_pessoa', tipoPessoa);

    grCaso.setValue('u_valor_face_upb_novo', current.getValue('u_valor_face_liquido_ativo'));
    grCaso.setValue('u_valor_investimento', current.getValue('u_preco_indicativo_total'));

    if (ativoCaso == 'direito_creditorio_trabalhista') {
        grCaso.setValue('u_valor_face_upb_novo', 1);
        grCaso.setValue('u_valor_investimento', 1);
    }

    grCaso.insert();

    var caso = grCaso.getUniqueValue();

    current.setValue('u_caso', caso);
    current.setValue('u_carteira', carteira);
    current.update();


    // ADD ARQUIVOS PARA CASO
    function copyAttachment(attachment, new_attachment) {
        var gat = new GlideSysAttachment();
        return gat.copy('x_jam_diretorio_m2m_categoria_arquivo', attachment, 'x_jam_diretorio_m2m_categoria_arquivo', new_attachment)
    }

    new global.GlideQuery('x_jam_diretorio_m2m_categoria_arquivo')
        .where('u_registro', current.getUniqueValue())
        .select('u_nome', 'u_registro', 'u_categoria.sys_id', 'u_categoria.u_nome')
        .toArray(100)
        .map(function (arquivo) {

            var new_dir = new global.GlideQuery('x_jam_diretorio_categoria')
                .where('regra_de_vizualiza_o', 'claimfy')
                .where('u_nome', arquivo.u_categoria.u_nome)
                .select('u_tabela')
                .toArray(100)
                .filter(function (dir) {
                    return !dir.u_tabela;
                }).shift();


            if (new_dir) {

                var new_attach = new global.GlideQuery('x_jam_diretorio_m2m_categoria_arquivo')
                    .insert({
                        u_nome: arquivo.u_nome,
                        source_table: 'x_jam_special_oppo_caso',
                        u_categoria: new_dir.sys_id,
                        u_active: true,
                        u_registro: caso
                    })
                    .get();


                copyAttachment(arquivo.sys_id, new_attach.sys_id);
            }
        });





})(current, previous);