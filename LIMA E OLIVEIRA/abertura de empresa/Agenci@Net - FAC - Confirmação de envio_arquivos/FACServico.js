/// <reference path="../agt-typings.ts" />
var FACServico;
(function (FACServico) {
    (function (Status) {
        Status[Status["NAO_PREENCHIDO"] = 0] = "NAO_PREENCHIDO";
        Status[Status["COM_ERRO"] = 1] = "COM_ERRO";
        Status[Status["OK"] = 2] = "OK";
    })(FACServico.Status || (FACServico.Status = {}));
    var Status = FACServico.Status;
    var FichaCadastral = (function () {
        function FichaCadastral($agnet, $sessionStorage) {
            this.$agnet = $agnet;
            this.$sessionStorage = $sessionStorage;
            for (var field in this.status) {
                this.status[field] = Status.NAO_PREENCHIDO;
            }
        }
        FichaCadastral.prototype.sincronizar = function (o) {
            this.NAS = o.NAS;
            this.Situacao = o.Situacao;
            this.CPFResponsavel = o.CPFResponsavel;
            this.EmailResponsavel = o.EmailResponsavel;
            this.DataSolicitacao = o.DataSolicitacao;
            this.DataFinalEntrega = o.DataFinalEntrega;
            this.Passo1 = o.Passo1;
            this.Passo2 = o.Passo2;
            this.Passo3 = o.Passo3;
            this.AtividadeEconomicaISS = o.AtividadeEconomicaISS;
            this.AtividadeEconomicaICMS = o.AtividadeEconomicaICMS;
            this.AtividadeEconomicaSecundarias = o.AtividadeEconomicaSecundarias;
            this.Passo4 = o.Passo4;
            this.Passo5 = o.Passo5;
            this.Passo6 = o.Passo6;
            this.Passo7 = o.Passo7;
        };
        FichaCadastral.prototype.consultarSolicitacaoInscricao = function (consulta) {
            return this.$agnet.mvcPost('/FAC/ConsultarSolicitacaoInscricao', consulta);
        };
        FichaCadastral.prototype.consultarSolicitacao = function (consulta) {
            return this.$agnet.mvcPost('/FAC/ConsultarSolicitacao', consulta);
        };
        FichaCadastral.prototype.carregarFormAcompanhamentoSolicitacao = function () {
            return this.$agnet.mvcPost('/FAC/CarregarFormAcompanhamentoSolicitacao');
        };
        FichaCadastral.prototype.consultarAcompanhamento = function (consulta) {
            return this.$agnet.mvcPost('/FAC/ConsultarAcompanhamento', consulta);
        };
        FichaCadastral.prototype.consultarPerfilAcesso = function () {
            return this.$agnet.mvcPost('/FAC/ConsultarPerfilAcesso');
        };
        FichaCadastral.prototype.iniciarCadastro = function (cadastro) {
            return this.$agnet.mvcPost('/FAC/IniciarCadastro', cadastro);
        };
        FichaCadastral.prototype.retomarCadastro = function (cadastro) {
            var _this = this;
            return this.$agnet.mvcPost('/FAC/RetomarCadastro', cadastro).success(function (data) {
                _this.sincronizar(data);
            });
        };
        FichaCadastral.prototype.imprimirPedidoInscricao = function () {
            var _this = this;
            return this.$agnet.mvcPost('/FAC/ImprimirPedidoInscricao', { nas: this.$sessionStorage.FacNas }).success(function (data) {
                _this.sincronizar(data);
            });
        };
        FichaCadastral.prototype.iniciarAtualizacaoFAC = function (cfdf) {
            var _this = this;
            return this.$agnet.mvcPost('/FAC/IniciarAtualizacaoFAC', { CfDf: cfdf }).success(function (data) {
                _this.sincronizar(data.fac);
            });
        };
        FichaCadastral.prototype.retomarAtualizacaoFAC = function () {
            return this.$agnet.mvcPost('/FAC/RetomarAtualizacaoFAC', this);
        };
        FichaCadastral.prototype.carregarCadastro = function (info) {
            var _this = this;
            return this.$agnet.mvcPost('/FAC/CarregarCadastro', info).success(function (data) {
                _this.sincronizar(data);
            });
        };
        FichaCadastral.prototype.gravarFAC = function () {
            return this.$agnet.mvcPost('/FAC/GravarFAC', this);
        };
        FichaCadastral.$inject = ['$agnet', '$sessionStorage'];
        return FichaCadastral;
    }());
    FACServico.FichaCadastral = FichaCadastral;
})(FACServico || (FACServico = {}));
var servicos = angular.module('FACServico', ['AgNet', 'ngRoute', 'ui.bootstrap', 'ngStorage']);
servicos
    .service('fichaCadastral', FACServico.FichaCadastral)
    .factory('passo1', [
    '$agnet', '$q', 'fichaCadastral', '$sessionStorage', '$http',
    function ($agnet, $q, fichaCadastral, $sessionStorage, $http) {
        function Passo1() { }
        Passo1.prototype.salvar = function () {
            var self = this;
            return $agnet.mvcPost('/FAC/SalvarPasso1', { Passo1: self, nas: $sessionStorage.FacNas }).success(function (data) {
                fichaCadastral.sincronizar(data);
            });
        };
        Passo1.prototype.carregar = function () { return $agnet.mvcPost('/FAC/CarregarPasso1', { nas: $sessionStorage.FacNas }).success(function (data) {
            fichaCadastral.sincronizar(data.fac);
        }); };
        Passo1.prototype.cancelar = function () { return $agnet.mvcPost('/FAC/ExcluirSolicitacao', { NAS: $sessionStorage.FacNas }); };
        Passo1.prototype.listaTiposContribuinte = function () { return $agnet.mvcPost('/FAC/ListaTiposContribuinte'); };
        Passo1.prototype.recuperar = function (fichaCadastral) { };
        return new Passo1();
    }
])
    .factory('passo2', [
    '$agnet', 'fichaCadastral', '$sessionStorage',
    function ($agnet, fichaCadastral, $sessionStorage) {
        function Passo2() { }
        Passo2.prototype.salvar = function () {
            var self = this;
            return $agnet.mvcPost('/FAC/SalvarPasso2', { Passo2: self, nas: $sessionStorage.FacNas }).success(function (data) {
                fichaCadastral.sincronizar(data);
            });
        };
        Passo2.prototype.carregar = function () { return $agnet.mvcPost('/FAC/CarregarPasso2', { nas: $sessionStorage.FacNas }).success(function (data) {
            fichaCadastral.sincronizar(data.fac);
        }); };
        Passo2.prototype.listaFaixasEndereco = function () { return $agnet.mvcPost('/FAC/ListaFaixasEndereco'); };
        Passo2.prototype.consultarIPTU = function (IPTU) { return $agnet.mvcPost('/FAC/ConsultarIPTU', {
            IPTU: IPTU
        }); };
        return new Passo2();
    }
])
    .factory('passo3', [
    '$agnet', 'fichaCadastral', '$q', '$sessionStorage',
    function ($agnet, fichaCadastral, $q, $sessionStorage) {
        function Passo3() { }
        Passo3.prototype.salvarAtividadeEconomicaICMS = function () {
            var self = this;
            return $agnet.mvcPost('/FAC/SalvarAtividadeEconomicaICMS', { atividade: self.ICMS, nas: $sessionStorage.FacNas });
        };
        Passo3.prototype.salvarAtividadeEconomicaISS = function () {
            var self = this;
            return $agnet.mvcPost('/FAC/SalvarAtividadeEconomicaISS', { atividade: self.ISS, nas: $sessionStorage.FacNas });
        };
        Passo3.prototype.salvarAtividadeEconomicaSecundaria = function (secundaria) {
            var self = this;
            return $agnet.mvcPost('/FAC/AdicionarAtividadeSecundaria', { atividade: secundaria, nas: $sessionStorage.FacNas });
        };
        Passo3.prototype.limparAtividadeEconomicaSecundaria = function () { return $agnet.mvcPost('/FAC/LimparAtividadeSecundaria', { nas: $sessionStorage.FacNas }); };
        Passo3.prototype.salvar = function () {
            var self = this;
            self.cadastro.CapitalSocial = self.cadastro.CapitalSocial.toString().replace(',', '').replace('.', ',');
            return ($agnet.mvcPost('/FAC/SalvarPasso3', { Passo3: self.cadastro, nas: $sessionStorage.FacNas }));
        };
        Passo3.prototype.removerAtividadeSecundaria = function (cnae) {
            return $agnet.mvcPost('/FAC/RemoverAtividadeSecundaria', { nas: $sessionStorage.FacNas, CnaeFiscal: cnae });
        };
        Passo3.prototype.limparPasso3 = function () { return $agnet.mvcPost('/FAC/LimparPasso3', { nas: $sessionStorage.FacNas }).success(function (data) {
        }); };
        Passo3.prototype.carregar = function () { return $agnet.mvcPost('/FAC/CarregarPasso3', { nas: $sessionStorage.FacNas }).success(function (data) {
            fichaCadastral.sincronizar(data.fac);
        }); };
        Passo3.prototype.listarTiposTributacao = function () { return $agnet.mvcPost('/FAC/ListarTiposTributacao'); };
        Passo3.prototype.listaQualificacoes = function () { return $agnet.mvcPost('/FAC/ListaQualificacoes'); };
        return new Passo3();
    }
])
    .factory('passo4', [
    '$agnet', 'fichaCadastral', '$sessionStorage',
    function ($agnet, fichaCadastral, $sessionStorage) {
        function Passo4() { }
        Passo4.prototype.consultarPasso4PorCFDF = function (cfdf) { return $agnet.mvcPost('/FAC/ConsultarPasso4PorCFDF', { cfdf: cfdf }); };
        Passo4.prototype.salvar = function () {
            var self = this;
            return $agnet.mvcPost('/FAC/SalvarPasso4', { Passo4: self, nas: $sessionStorage.FacNas }).success(function (data) {
                fichaCadastral.sincronizar(data);
            });
        };
        Passo4.prototype.limparPasso4 = function () { return $agnet.mvcPost('/FAC/LimparPasso4', { nas: $sessionStorage.FacNas }).success(function (data) {
        }); };
        Passo4.prototype.carregar = function () { return $agnet.mvcPost('/FAC/CarregarPasso4', { nas: $sessionStorage.FacNas }).success(function (data) {
            fichaCadastral.sincronizar(data.fac);
        }); };
        return new Passo4();
    }
])
    .factory('passo5', [
    '$agnet', '$q', 'fichaCadastral', '$http', '$filter', '$sessionStorage',
    function ($agnet, $q, fichaCadastral, $http, $filter, $sessionStorage) {
        function Passo5() { }
        Passo5.prototype.salvar = function () {
            var self = this;
            var def = $q.defer();
            var promise = def.promise;
            def.resolve();
            $agnet.mvcPost('/FAC/LimparSocios', { nas: $sessionStorage.FacNas });
            angular.forEach(self.Socios, function (socio) {
                promise = promise.then(function () { return $agnet.mvcPost('/FAC/AdicionarSocio', { socio: socio, nas: $sessionStorage.FacNas }); });
            });
            return promise.then(function () { return $agnet.mvcPost('/FAC/SalvarPasso5', { nas: $sessionStorage.FacNas }).success(function (data) {
                fichaCadastral.sincronizar(data);
            }); });
        };
        Passo5.prototype.adicionarSocio = function (socio) { return $agnet.mvcPost('/FAC/AdicionarSocio', { socio: socio, nas: $sessionStorage.FacNas }); };
        Passo5.prototype.carregar = function () { return $http.post('/FAC/CarregarPasso5', { nas: $sessionStorage.FacNas }).success(function (pas5Soc) {
            for (var i = 0; i < pas5Soc.fac.Passo5.Socios.length; i++) {
                pas5Soc.fac.Passo5.Socios[i].DataExpedicaoRg = $filter('date')(pas5Soc.fac.Passo5.Socios[i].DataExpedicaoRg, 'dd/MM/yyyy');
                pas5Soc.fac.Passo5.Socios[i].DataInicio = $filter('date')(pas5Soc.fac.Passo5.Socios[i].DataInicio, 'dd/MM/yyyy');
                pas5Soc.fac.Passo5.Socios[i].DataSaida = $filter('date')(pas5Soc.fac.Passo5.Socios[i].DataSaida, 'dd/MM/yyyy');
            }
            fichaCadastral.sincronizar(pas5Soc.fac);
        }); };
        Passo5.prototype.recarregarSocios = function () { return $http.post('/FAC/recarregarSociosPasso5', { nas: $sessionStorage.FacNas }).success(function (pasRec5Soc) {
        }); };
        Passo5.prototype.getInfoSocio = function (socio) { return $http.post('/FAC/getCadastroSocio', socio).success(function (pas5InfoSoc) {
            if (angular.isObject(pas5InfoSoc)) {
                socio.Nome = pas5InfoSoc.NomeRazaoSocial;
                socio.Logradouro = pas5InfoSoc.Endereco;
                socio.Bairro = pas5InfoSoc.Bairro;
                socio.Cidade = pas5InfoSoc.Cidade;
                socio.Cep = pas5InfoSoc.CEP;
                socio.Uf = pas5InfoSoc.Uf;
                socio.Ddd = pas5InfoSoc.DDD;
                socio.Telefone = pas5InfoSoc.DDD + pas5InfoSoc.Telefone;
            }
            else
                alert("O REGISTRO NÃO FOI LOCALIZADO NO BANCO DE DADOS DA SEF");
        }); };
        return new Passo5();
    }
])
    .factory('passo6', [
    '$agnet', '$q', 'fichaCadastral', '$http', '$sessionStorage',
    function ($agnet, $q, fichaCadastral, $http, $sessionStorage) {
        function Passo6() { }
        Passo6.prototype.salvar = function () {
            var self = this;
            var def = $q.defer();
            var promise = def.promise;
            def.resolve();
            $agnet.mvcPost('/FAC/LimparAdministradores', { nas: $sessionStorage.FacNas });
            return $http.post('/FAC/SalvarPasso6', { adms: self.Administradores, nas: $sessionStorage.FacNas }).success(function (data) {
                fichaCadastral.sincronizar(data);
            });
        };
        Passo6.prototype.adicionarAdministrador = function (adm) { return $agnet.mvcPost('/FAC/Administrador', adm); };
        Passo6.prototype.carregar = function () { return $agnet.mvcPost('/FAC/CarregarPasso6', { nas: $sessionStorage.FacNas }).success(function (d) {
            fichaCadastral.sincronizar(d.fac);
        }); };
        Passo6.prototype.getInfoSocio = function (socio) { return $http.post('/FAC/getCadastroSocio', socio).success(function (pas6InfoSoc) {
            if (angular.isObject(pas6InfoSoc)) {
                socio.Nome = pas6InfoSoc.NomeRazaoSocial;
                socio.Logradouro = pas6InfoSoc.Endereco;
                socio.Bairro = pas6InfoSoc.Bairro;
                socio.Cidade = pas6InfoSoc.Cidade;
                socio.Cep = pas6InfoSoc.CEP;
                socio.Uf = pas6InfoSoc.Uf;
                socio.Ddd = pas6InfoSoc.DDD;
                socio.Telefone = pas6InfoSoc.DDD + pas6InfoSoc.Telefone;
            }
            else
                alert("O REGISTRO NÃO FOI LOCALIZADO NO BANCO DE DADOS DA SEF");
        }); };
        return new Passo6();
    }
])
    .factory('passo7', [
    '$agnet', 'fichaCadastral', '$sessionStorage',
    function ($agnet, fichaCadastral, $sessionStorage) {
        function Passo7() { }
        Passo7.prototype.salvar = function () {
            var self = this;
            return $agnet.mvcPost('/FAC/SalvarPasso7', { passo7: this, nas: $sessionStorage.FacNas }).success(function (data) {
                fichaCadastral.sincronizar(data);
            });
        };
        Passo7.prototype.carregar = function () { return $agnet.mvcPost('/FAC/CarregarPasso7', { nas: $sessionStorage.FacNas }).success(function (d) {
            fichaCadastral.sincronizar(d.fac);
        }); };
        return new Passo7();
    }
])
    .factory('passo8', [
    '$agnet', 'fichaCadastral', '$sessionStorage',
    function ($agnet, fichaCadastral, $sessionStorage) {
        function Passo8() { }
        Passo8.prototype.salvar = function () {
            return $agnet.mvcPost('', this).success(function (data) {
                fichaCadastral.sincronizar(data);
            });
        };
        Passo8.prototype.carregar = function () { return $agnet.mvcPost('/FAC/CarregarPasso8', { nas: $sessionStorage.FacNas }).success(function (d) {
            fichaCadastral.sincronizar(d.fac);
        }); };
        Passo8.prototype.cancelar = function () { return $agnet.mvcPost('/FAC/ExcluirSolicitacao', { NAS: $sessionStorage.FacNas }); };
        return new Passo8();
    }
])
    .factory('passo9', [
    '$agnet', 'fichaCadastral', '$sessionStorage',
    function ($agnet, fichaCadastral, $sessionStorage) {
        function Passo9() { }
        Passo9.prototype.avancar = function () {
            return $agnet.mvcPost('', this).success(function (data) {
                fichaCadastral.sincronizar(data);
            });
        };
        Passo9.prototype.carregar = function () { return $agnet.mvcPost('/FAC/CarregarPasso9', { nas: $sessionStorage.FacNas }).success(function (d) {
            fichaCadastral.sincronizar(d.fac);
        }); };
        return new Passo9();
    }
])
    .factory('passo10', [
    '$agnet', 'fichaCadastral', '$sessionStorage',
    function ($agnet, fichaCadastral, $sessionStorage) {
        function Passo10() { }
        Passo10.prototype.avancar = function () { return $agnet.mvcPost('/FAC/GravarFac', { nas: $sessionStorage.FacNas }).success(function (data) {
            fichaCadastral.sincronizar(data);
        }); };
        Passo10.prototype.carregar = function () { return $agnet.mvcPost('/FAC/CarregarPasso10', { nas: $sessionStorage.FacNas }).success(function (d) {
            fichaCadastral.sincronizar(d.fac);
        }); };
        return new Passo10();
    }
])
    .directive('agtCnae', [
    '$agnet', '$q',
    function ($agnet, $q) {
        return {
            require: '?ngModel',
            link: function (scope, elem, attrs, ngModel) {
                scope.aberto = false;
                var seletor = new CNAESeletor($agnet, $q, scope, attrs.imposto);
                var input = elem.find('input');
                for (var attr in attrs) {
                    if (attrs.hasOwnProperty(attr)) {
                        if (['$', '_'].indexOf(attr[0]) >= 0)
                            continue;
                        input.attr(attr, attrs[attr]);
                    }
                }
                ngModel.$render = function () {
                    var valor = ngModel.$viewValue || '';
                    if (valor.length === 0)
                        return;
                    seletor.resetar()
                        .then(function (r) {
                        var filter = scope.cnaes.filter(function (cnae) { return valor.startsWith(cnae.Codigo); });
                        return seletor.selecionar(filter[0]);
                    })
                        .then(function (r) {
                        var filter = scope.cnaes.filter(function (cnae) { return valor.startsWith(cnae.Codigo); });
                        return seletor.selecionar(filter[0]);
                    })
                        .then(function (r) {
                        var filter = scope.cnaes.filter(function (cnae) { return valor.startsWith(cnae.Codigo); });
                        return seletor.selecionar(filter[0]);
                    })
                        .then(function (r) {
                        var filter = scope.cnaes.filter(function (cnae) { return valor.startsWith(cnae.Codigo); });
                        return seletor.selecionar(filter[0]);
                    })
                        .then(function (r) {
                        var filter = scope.cnaes.filter(function (cnae) { return valor.startsWith(cnae.Codigo); });
                        return seletor.selecionar(filter[0]);
                    });
                };
                ngModel.$validators.cnae = function (modelValue) {
                    return modelValue && modelValue.length === 10;
                };
                scope.$watch(function () { return scope.value; }, function () {
                    if (!angular.isString(seletor.valor) || seletor.valor.length === 0)
                        return;
                    ngModel.$setViewValue(seletor.valor);
                });
            },
            templateUrl: '/Templates/FAC/CNAE.html',
            scope: {
                name: '=name'
            }
        };
    }
])
    .filter('X', function () { return function (valor, n) {
    if (valor != null && valor != '' && valor != 0)
        return valor;
    n = n || 5;
    return new Array(n + 1).join('?');
}; })
    .directive('agtFacCriticaCampo', function () {
    return {
        link: function (scope, element, attrs) {
            scope.$watchGroup(['criticasAviso', 'criticasErro'], function () {
                if (scope.criticasAviso == null || scope.criticasAviso == undefined) {
                    scope.criticasAviso = new Array();
                }
                if (scope.criticasErro == null || scope.criticasErro == undefined) {
                    scope.criticasErro = new Array();
                }
                var avisos = scope.criticasAviso.filter(function (c) { return (parseInt(c.CodigoCampo) == parseInt(attrs.agtFacCriticaCampo)); });
                var erros = scope.criticasErro.filter(function (c) { return (parseInt(c.CodigoCampo) == parseInt(attrs.agtFacCriticaCampo)); });
                var html = new Array((avisos.length + erros.length) * 3);
                var i = 0;
                angular.forEach(avisos, function (aviso) {
                    html[i++] = '<span class="alert alert-warning alerta-em-linha">';
                    html[i++] = aviso.DescricaoErro;
                    html[i++] = '</span>';
                });
                angular.forEach(erros, function (erro) {
                    html[i++] = '<span class="alert alert-danger alerta-em-linha">';
                    html[i++] = erro.DescricaoErro;
                    html[i++] = '</span>';
                });
                element.find('span').remove();
                element.addClass('vermelho');
                element.html(element.html() + html);
            });
        }
    };
});
var CNAESeletor = (function () {
    function CNAESeletor($agnet, $q, scope, imposto) {
        this.$agnet = $agnet;
        this.$q = $q;
        this.scope = scope;
        this._ligarEventos();
        this.imposto = imposto;
        this.scope.etiquetaEtapa = function (i) { return [
            'Seção',
            'Divisão',
            'Grupo',
            'Classe',
            'Subclasse'
        ][i]; };
    }
    CNAESeletor.prototype._ligarEventos = function () {
        var _this = this;
        var _that = this;
        this.scope.abrir = function () {
            _this.abrir();
        };
        this.scope.selecionar = function () {
            _that.selecionar.apply(_that, arguments);
        };
        this.scope.voltarEtapa = function () {
            _that.voltarEtapa.apply(_that, arguments);
        };
    };
    CNAESeletor.prototype.voltarEtapa = function (event, i) {
        event.preventDefault();
        if (i === 0) {
            this.resetar();
            return;
        }
        i--;
        this.scope.etapa = i;
        var cnae = this.scope.breadcrumb[i];
        this.scope.value = cnae.Codigo + " - " + cnae.Descricao;
        this.valor = cnae.Codigo;
        this.scope.breadcrumb = this.scope.breadcrumb.slice(0, i);
        this.selecionar(cnae);
    };
    CNAESeletor.prototype.abrir = function () {
        this.scope.aberto = !this.scope.aberto;
        if (!angular.isNumber(this.scope.etapa) || this.scope.etapa === 0)
            this.resetar();
    };
    CNAESeletor.prototype.resetar = function () {
        var _this = this;
        this.scope.value = '';
        this.scope.etapa = 0;
        this.scope.cnaes = [];
        this.scope.breadcrumb = [];
        return this.$agnet.mvcPost('/FAC/ConsultarCNAE', {
            Imposto: this.imposto,
            CNAE: ''
        }).success(function (d) {
            _this.scope.cnaes = d;
        });
    };
    CNAESeletor.prototype.selecionar = function (cnae) {
        /* if (cnae.Codigo.length == 10) {
             console.log(this.scope.etapa);
             console.log(cnae);
         }*/
        var _this = this;
        if (!cnae)
            return this.$q.reject();
        this.valor = cnae.Codigo;
        this.scope.value = cnae.Codigo + " - " + cnae.Descricao;
        this.scope.breadcrumb[this.scope.etapa] = cnae;
        if (this.scope.etapa === 4)
            return null;
        this.scope.etapa += 1;
        this.scope.cnaes = [];
        return this.$agnet.mvcPost('/FAC/ConsultarCNAE', {
            Imposto: this.imposto,
            CNAE: this.valor
        }).success(function (d) {
            _this.scope.cnaes = d;
        });
    };
    return CNAESeletor;
}());
//# sourceMappingURL=FACServico.js.map