// <reference path="../../agt-typings.ts" />
// <reference path="../../neAGT.d.ts" />
var FAC;
(function (FAC) {
    var AtividadeSecundaria = (function () {
        function AtividadeSecundaria() {
            this._aberta = true;
        }
        return AtividadeSecundaria;
    }());
    FAC.AtividadeSecundaria = AtividadeSecundaria;
    var Passo3Controller = (function () {
        function Passo3Controller($agnet, $location, fichaCadastral, passo3, notificacaoFactory, $q) {
            var _this = this;
            this.$agnet = $agnet;
            this.$location = $location;
            this.fichaCadastral = fichaCadastral;
            this.passo3 = passo3;
            this.notificacaoFactory = notificacaoFactory;
            this.notificacao = notificacaoFactory('passo3');
            this.secundarias = new Array();
            this.$q = $q;
            passo3.carregar().success(function (data) {
                if (_this.fichaCadastral.Situacao > 1) {
                    _this.$location.path("/Passo8/" + _this.fichaCadastral.NAS + "/" + _this.fichaCadastral.CPFResponsavel);
                }
                _this.Passo3 = angular.copy(fichaCadastral.Passo3);
                _this.ISS = angular.copy(fichaCadastral.AtividadeEconomicaISS);
                _this.ICMS = angular.copy(fichaCadastral.AtividadeEconomicaICMS);
                _this.secundarias = fichaCadastral.AtividadeEconomicaSecundarias;
                _this.tiposTributacao = data.qualificacoes;
            }).error(function (data) {
                if (data.Codigo == 10) {
                    notificacaoFactory('fac').erro(data.Mensagem);
                    $location.path('/');
                }
                _this.notificacao.erro(data);
            });
        }
        Passo3Controller.prototype.voltar = function () {
            this.$location.path("/Passo2/" + this.fichaCadastral.NAS + "/" + this.fichaCadastral.CPFResponsavel);
        };
        Passo3Controller.prototype.avancar = function () {
            var _this = this;
            this.passo3.cadastro = angular.copy(this.Passo3);
            this.passo3.ISS = angular.copy(this.ISS);
            this.passo3.ICMS = angular.copy(this.ICMS);
            this.passo3.secundarias = angular.copy(this.secundarias);
            /* if (this.passo3.MotivoRegimeIss.$error.required) {
                 this.notificacao.erro('ISS: o campo motivo é obrigatório.');
                 return;
             }
             */
            var promises = new Array();
            if (this.Passo3.SujeitoATributo != 4) {
                promises.push(this.passo3.salvarAtividadeEconomicaISS());
            }
            if (this.Passo3.SujeitoATributo >= 4) {
                promises.push(this.passo3.salvarAtividadeEconomicaICMS());
            }
            if (this.passo3.secundarias.length > 0) {
                angular.forEach(this.passo3.secundarias, function (secundaria) {
                    promises.push(_this.passo3.salvarAtividadeEconomicaSecundaria(secundaria));
                });
            }
            else
                promises.push(this.passo3.limparAtividadeEconomicaSecundaria());
            this.$q.all(promises).then(function () {
                _this.passo3.salvar().then(function () {
                    _this.$location.path("/Passo4/" + _this.fichaCadastral.NAS + "/" + _this.fichaCadastral.CPFResponsavel);
                }, function (res) {
                    var data = res.data;
                    if (data.Codigo == 10) {
                        _this.notificacaoFactory('fac').erro(data.Mensagem);
                        _this.$location.path('/');
                        return;
                    }
                    if (angular.isArray(data)) {
                        _this.notificacao.tratarErrosMVC(data, _this.formPasso3);
                    }
                    else {
                        _this.notificacao.erro(data);
                    }
                });
            }, function (res) {
                if (angular.isArray(res.data)) {
                    _this.notificacao.tratarErrosMVC(res.data, _this.formPasso3);
                }
                else {
                    _this.notificacao.erro(res.data);
                }
            });
        };
        Passo3Controller.prototype.limpar = function (valor) {
            var _this = this;
            this.passo3.limparPasso3().success(function (data) {
                if (valor === 4)
                    _this.ISS = null;
                else if (valor !== 5)
                    _this.ICMS = null;
            }).error(function (data) { _this.notificacao.erro(data); });
        };
        Passo3Controller.prototype.remover = function (event, index, cnae) {
            var _this = this;
            event.preventDefault();
            this.passo3.removerAtividadeSecundaria(cnae).then(function () {
                _this.secundarias.splice(index, 1);
            }, function (data) {
                _this.notificacao.erro(data);
            });
        };
        Passo3Controller.prototype.adicionarAtividadeEconomicaSecundaria = function (event) {
            event.preventDefault();
            if (this.secundarias.length < 10)
                this.secundarias.push(new AtividadeSecundaria());
            else
                alert("A quantidade máxima de atividade secundária deve ser igual a 10");
        };
        Passo3Controller.$inject = ['$agnet', '$location', 'fichaCadastral', 'passo3', 'notificacaoFactory', '$q'];
        return Passo3Controller;
    }());
    FAC.Passo3Controller = Passo3Controller;
})(FAC || (FAC = {}));
//# sourceMappingURL=passo3.js.map