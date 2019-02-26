// <reference path="../../agt-typings.ts" />
// <reference path="../../neAGT.d.ts" />
var FAC;
(function (FAC) {
    var Socio = (function () {
        function Socio() {
            this._aberta = true;
        }
        return Socio;
    }());
    FAC.Socio = Socio;
    var Passo5Controller = (function () {
        function Passo5Controller($agnet, $location, fichaCadastral, passo5, notificacaoFactory, $q, $filter) {
            var _this = this;
            this.totalSocio = 0;
            this.$agnet = $agnet;
            this.$location = $location;
            this.fichaCadastral = fichaCadastral;
            this.passo5 = passo5;
            this.notificacaoFactory = notificacaoFactory;
            this.$q = $q;
            this.percentualOK = true;
            this.rgDesabilitado = true;
            this.participacaoDesabilitado = true;
            this.contribuinteNaoAtivo = false;
            this.tipo4 = false;
            this.notificacao = notificacaoFactory('passo5');
            this.socios = new Array();
            passo5.carregar().success(function (data) {
                if (_this.fichaCadastral.Situacao > 1) {
                    _this.$location.path("/Passo8/" + _this.fichaCadastral.NAS + "/" + _this.fichaCadastral.CPFResponsavel);
                }
                if (data.fac.Passo5.Socios.length > 0)
                    _this.totalSocio = data.fac.Passo5.Socios[0].qtdSociosExistentes;
                _this.Passo1 = data.fac.Passo1;
                _this.socios = data.fac.Passo5.Socios || _this.socios;
                _this.cargos = data.cargos;
                _this.TipoSolicitacao = data.fac.TipoSolicitacao;
                //alert(this.Passo1.TipoPessoaContribuinte);
                //this.rgDesabilitado = this.Passo1.TipoPessoaContribuinte != 'F';
                _this.participacaoDesabilitado = false; // [1, 2, 3].indexOf(this.Passo1.TipoContribuinte) >= 0;
                if (!angular.isArray(_this.socios) || _this.socios.length == 0) {
                    _this.socios.push(_this.novoSocio());
                    if (_this.Passo1.TipoPessoaContribuinte === 'F') {
                        _this.socios[0].CpfCnpj = _this.Passo1.CpfCnpjContribuinte;
                    }
                }
            }).error(function (data) {
                if (data.hasOwnProperty('Codigo') && data.Codigo == 10) {
                    _this.notificacaoFactory('fac').erro(data.Mensagem);
                    _this.$location.path('/');
                }
                _this.notificacao.erro(data);
            });
        }
        Passo5Controller.prototype.novoSocio = function () {
            var socio = new Socio();
            //socio.Responsavel = !this.rgDesabilitado;
            if (this.tipo4) {
                socio.CodigoCargo = 1;
            }
            socio.Responsavel = false;
            return socio;
        };
        Passo5Controller.prototype.adicionarSocio = function (event) {
            event.preventDefault();
            this.socios.push(this.novoSocio());
        };
        Passo5Controller.prototype.voltar = function () {
            this.$location.path("/Passo4/" + this.fichaCadastral.NAS + "/" + this.fichaCadastral.CPFResponsavel);
        };
        Passo5Controller.prototype.restaurarSocios = function (event) {
            var _this = this;
            event.preventDefault();
            if (confirm("Atenção! Essa operação irá descartar todas as alterações realizadas no Quadro Societário desse NAS. Deseja realmente recuperar as informações do Quadro Societário contidas na última FAC Homologada para essa empresa?")) {
                this.passo5.recarregarSocios(this.fichaCadastral.NAS).success(function (data) {
                    if (data.Passo5.Socios.length > 0)
                        _this.totalSocio = data.Passo5.Socios[0].qtdSociosExistentes;
                    _this.Passo1 = data.Passo1;
                    _this.socios = data.Passo5.Socios;
                    _this.TipoSolicitacao = data.TipoSolicitacao;
                    _this.participacaoDesabilitado = false;
                    if (!angular.isArray(_this.socios) || _this.socios.length == 0) {
                        _this.socios.push(_this.novoSocio());
                        if (_this.Passo1.TipoPessoaContribuinte === 'F') {
                            _this.socios[0].CpfCnpj = _this.Passo1.CpfCnpjContribuinte;
                        }
                    }
                });
            }
        };
        Passo5Controller.prototype.selecionarResponsavel = function (socio) {
            this.socios.forEach(function (s) {
                s.Responsavel = false;
            });
            socio.Responsavel = true;
        };
        Passo5Controller.prototype.consultarPessoaSocio = function (socio) {
            this.passo5.getInfoSocio(socio);
            return;
        };
        Passo5Controller.prototype.remover = function (event, index) {
            event.preventDefault();
            this.socios.splice(index, 1);
        };
        Passo5Controller.prototype.avancar = function () {
            /* for (var i = 0; i < this.socios.length; i++) {
                 if (this.socios[i].DataExpedicaoRg != null) {
                     this.socios[i].DataExpedicaoRg.setDate = new Date(this.socios[i].DataExpedicaoRg.toString().substring(0, 2) + "/" +
                         this.socios[i].DataExpedicaoRg.toString().substring(3, 2) + "/" +
                         this.socios[i].DataExpedicaoRg.toString().substring(5, 4)).getDate;
                 }
                 if (this.socios[i].DataInicio != null) {
                     this.socios[i].DataInicio.setDate = new Date(this.socios[i].DataInicio.toString().substring(0, 2) + "/" +
                         this.socios[i].DataInicio.toString().substring(3, 2) + "/" +
                         this.socios[i].DataInicio.toString().substring(5, 4)).getDate;
                 }
                 if (this.socios[i].DataSaida != null) {
                     this.socios[i].DataSaida.setDate = new Date(this.socios[i].DataSaida.toString().substring(0, 2) + "/" +
                         this.socios[i].DataSaida.toString().substring(3, 2) + "/" +
                         this.socios[i].DataSaida.toString().substring(5, 4)).getDate;
                 }
                 this.socios[i].Percentual = this.socios[i].Percentual;
             }
 
             alert(this.socios[0].DataExpedicaoRg);*/
            var _this = this;
            this.passo5.Socios = this.socios;
            this.percentualOK = true;
            for (var i = 0; i < this.socios.length; i++) {
                if (parseInt(this.socios[i].Percentual.toString().substr(0, this.socios[i].Percentual.toString().length - 2)) > 100) {
                    this.percentualOK = false;
                    alert('Percentual de sócio inválido!');
                    break;
                }
            }
            ;
            if ([5, 8, 31, 32, 33, 34].indexOf(this.Passo1.TipoContribuinte) >= 0 && this.socios.length < 2) {
                alert('Esta empresa deve possuir no mínimo dois sócios.');
                return;
            }
            else if (this.Passo1.TipoPessoaContribuinte === 'F' && this.socios[0].CpfCnpj.trim() != this.Passo1.CpfCnpjContribuinte.trim()) {
                alert('O CPF informado deve ser o mesmo informado no passo 1!');
                return;
            }
            else if (this.percentualOK) {
                this.passo5.salvar().then(function () {
                    _this.$location.path(['/Passo6/', _this.fichaCadastral.NAS, '/', _this.fichaCadastral.CPFResponsavel].join(''));
                }, function (response) {
                    alert(response.data);
                });
            }
        };
        Passo5Controller.$inject = ['$agnet', '$location', 'fichaCadastral', 'passo5', 'notificacaoFactory', '$q', '$filter'];
        return Passo5Controller;
    }());
    FAC.Passo5Controller = Passo5Controller;
})(FAC || (FAC = {}));
//# sourceMappingURL=passo5.js.map