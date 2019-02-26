// <reference path="../../agt-typings.ts" />
// <reference path="../../neAGT.d.ts" />
var FAC;
(function (FAC) {
    var Passo4Controller = (function () {
        function Passo4Controller($agnet, $location, fichaCadastral, passo4, notificacaoFactory, $filter) {
            var _this = this;
            this.$agnet = $agnet;
            this.$location = $location;
            this.fichaCadastral = fichaCadastral;
            this.passo4 = passo4;
            this.notificacaoFactory = notificacaoFactory;
            this.$filter = $filter;
            this.notificacao = notificacaoFactory('passo4');
            passo4.carregar().success(function () {
                if (_this.fichaCadastral.Situacao > 1) {
                    _this.$location.path("/Passo8/" + _this.fichaCadastral.NAS + "/" + _this.fichaCadastral.CPFResponsavel);
                }
                _this.Passo4 = fichaCadastral.Passo4;
                if (angular.isObject(_this.Passo4)) {
                    _this.inscritoNoDF = _this.Passo4.TipoContadorContabilista == '2';
                }
            }).error(function (data) {
                if (data.hasOwnProperty('Codigo') && data.Codigo == 10) {
                    notificacaoFactory('fac').erro(data.Mensagem);
                    $location.path('/');
                }
                _this.notificacao.erro(data);
                _this.notificacaoFactory = notificacaoFactory;
            });
        }
        Passo4Controller.prototype.voltar = function () {
            this.$location.path("/Passo3/" + this.fichaCadastral.NAS + "/" + this.fichaCadastral.CPFResponsavel);
        };
        Passo4Controller.prototype.alterarVinculo = function (valor) {
            this.limpar(valor);
            this.inscritoNoDF = this.Passo4.TipoContadorContabilista == '2';
        };
        Passo4Controller.prototype.consultarCFDF = function () {
            var _this = this;
            this.passo4.consultarPasso4PorCFDF(this.Passo4.CFDFContador).success(function (data) {
                for (var campo in data) {
                    if (data.hasOwnProperty(campo) && data[campo] != null) {
                        _this.Passo4[campo] = data[campo];
                    }
                }
            }).error(function (data) { _this.notificacao.erro(data); });
        };
        Passo4Controller.prototype.limpar = function (valor) {
            var _this = this;
            this.passo4.limparPasso4().success(function (data) {
                _this.Passo4 = new Object();
                _this.Passo4.TipoContadorContabilista = valor;
            }).error(function (data) { _this.notificacao.erro(data); });
        };
        Passo4Controller.prototype.avancar = function () {
            var _this = this;
            angular.copy(this.Passo4, this.passo4);
            var mes = this.$filter('date')(new Date(), 'MM');
            var ano = this.$filter('date')(new Date(), 'yyyy');
            if (this.Passo4.DataInicioEscrituracao == null || this.Passo4.DataInicioEscrituracao == 'undefined' || this.Passo4.DataInicioEscrituracao == '')
                this.notificacao.aviso("Data inicio de escrituração inválida.");
            else if (this.Passo4.NomeRazaoSocial == null || this.Passo4.NomeRazaoSocial == 'undefined' || this.Passo4.NomeRazaoSocial == '')
                this.notificacao.aviso("Campo Nome/Razão Social inválido.");
            else {
                this.passo4.salvar().success(function (retorno) {
                    _this.$location.path(['/Passo5/', _this.fichaCadastral.NAS, '/', _this.fichaCadastral.CPFResponsavel].join(''));
                })
                    .error(function (data) {
                    if (data.hasOwnProperty('Codigo') && data.Codigo == 10) {
                        _this.notificacaoFactory('fac').erro(data.Mensagem);
                        _this.$location.path('/');
                    }
                    if (angular.isArray(data)) {
                        _this.notificacao.tratarErrosMVC(data, _this.formPasso4);
                    }
                    else {
                        _this.notificacao.erro(data);
                    }
                });
            }
        };
        Passo4Controller.$inject = ['$agnet', '$location', 'fichaCadastral', 'passo4', 'notificacaoFactory', '$filter'];
        return Passo4Controller;
    }());
    FAC.Passo4Controller = Passo4Controller;
})(FAC || (FAC = {}));
//# sourceMappingURL=passo4.js.map