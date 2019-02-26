// <reference path="../../agt-typings.ts" />
// <reference path="../../neAGT.d.ts" />
var FAC;
(function (FAC) {
    var Passo2Controller = (function () {
        function Passo2Controller($agnet, $location, $rootScope, fichaCadastral, passo1, passo2, notificacaoFactory) {
            var _this = this;
            this.$agnet = $agnet;
            this.$location = $location;
            this.$rootScope = $rootScope;
            this.fichaCadastral = fichaCadastral;
            this.passo1 = passo1;
            this.passo2 = passo2;
            this.notificacaoFactory = notificacaoFactory;
            this.notificacao = notificacaoFactory('passo2');
            this.abaAtiva = 'Passo2';
            $rootScope.esconderAbas = true;
            this.feiranteHabilitado = false;
            passo2.carregar().success(function (data) {
                if (_this.fichaCadastral.Situacao > 1) {
                    _this.$location.path("/Passo8/" + _this.fichaCadastral.NAS + "/" + _this.fichaCadastral.CPFResponsavel);
                }
                _this.Passo2 = angular.copy(fichaCadastral.Passo2);
                _this.Passo2.LocalAtendimento = parseInt(_this.Passo2.LocalAtendimento);
                _this.feiranteHabilitado = fichaCadastral.Passo1.TipoContribuinte == 2;
                _this.TipoEndereco = data.tiposEnderecos;
                _this.LocalAtendimento = data.locaisAtendimento;
                _this.unidadesAuxiliares = data.unidadesAuxiliares;
                _this.TipoContribuinte = (fichaCadastral.Passo1.TipoContribuinte);
            }).error(function (data) {
                if (data.hasOwnProperty('Codigo') && data.Codigo == 10) {
                    notificacaoFactory('fac').erro(data.Mensagem);
                    $location.path('/');
                }
                _this.notificacao.erro(data);
            });
        }
        Passo2Controller.prototype.consultarIPTU = function (event) {
            var _this = this;
            event.preventDefault();
            this.notificacao.limpar();
            this.passo2.consultarIPTU(this.Passo2.InscricaoIPTU).success(function (endereco) {
                endereco.InscricaoIPTU = _this.Passo2.InscricaoIPTU;
                angular.copy(endereco, _this.Passo2);
            }).error(function (data) {
                _this.notificacao.erro(data);
            });
        };
        Passo2Controller.prototype.voltar = function () {
            this.$location.path("/Passo1/" + this.fichaCadastral.NAS + "/" + this.fichaCadastral.CPFResponsavel);
        };
        Passo2Controller.prototype.avancar = function () {
            var _this = this;
            angular.copy(this.Passo2, this.passo2);
            this.passo2.salvar().success(function () {
                _this.$location.path("/Passo3/" + _this.fichaCadastral.NAS + "/" + _this.fichaCadastral.CPFResponsavel);
            })
                .error(function (erro) {
                if (angular.isArray(erro)) {
                    _this.notificacao.tratarErrosMVC(erro, _this.formPasso2);
                    return;
                }
                _this.notificacao.erro(erro);
            });
        };
        Passo2Controller.$inject = ['$agnet', '$location', '$rootScope', 'fichaCadastral', 'passo1', 'passo2', 'notificacaoFactory'];
        return Passo2Controller;
    }());
    FAC.Passo2Controller = Passo2Controller;
})(FAC || (FAC = {}));
//# sourceMappingURL=passo2.js.map