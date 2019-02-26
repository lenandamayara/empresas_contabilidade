// <reference path="../../agt-typings.ts" />
// <reference path="../../neAGT.d.ts" />
var FAC;
(function (FAC) {
    var Administrador = (function () {
        function Administrador() {
            this._aberta = true;
        }
        return Administrador;
    }());
    FAC.Administrador = Administrador;
    var Passo6Controller = (function () {
        function Passo6Controller($agnet, $location, fichaCadastral, passo6, notificacaoFactory, $q) {
            var _this = this;
            this.totalSocio = 0;
            this.$agnet = $agnet;
            this.$location = $location;
            this.fichaCadastral = fichaCadastral;
            this.passo6 = passo6;
            this.notificacaoFactory = notificacaoFactory;
            this.$q = $q;
            this.rgDesabilitado = true;
            this.participacaoDesabilitado = true;
            this.contribuinteNaoAtivo = false;
            this.tipo4 = false;
            this.notificacao = notificacaoFactory('passo5');
            this.administradores = new Array();
            passo6.carregar().success(function (data) {
                if (_this.fichaCadastral.Situacao > 1) {
                    _this.$location.path("/Passo8/" + _this.fichaCadastral.NAS + "/" + _this.fichaCadastral.CPFResponsavel);
                }
                if (data.fac.Passo6.Administradores.length > 0)
                    _this.totalSocio = data.fac.Passo6.Administradores[0].qtdSociosADMExistentes;
                _this.Passo1 = data.fac.Passo1;
                _this.administradores = data.fac.Passo6.Administradores || _this.administradores;
                _this.cargos = data.cargos;
                if (!angular.isArray(_this.administradores) || _this.administradores.length == 0) {
                    _this.administradores.push(new FAC.Socio());
                }
                //this.rgDesabilitado = this.Passo1.TipoPessoaContribuinte != 'F';
                _this.participacaoDesabilitado = [1, 2, 3].indexOf(_this.Passo1.TipoContribuinte) > 0;
            }).error(function (data) {
                if (data.hasOwnProperty('Codigo') && data.Codigo == 10) {
                    _this.notificacaoFactory('fac').erro(data.Mensagem);
                    _this.$location.path('/');
                }
                _this.notificacao.erro(data);
            });
        }
        Passo6Controller.prototype.adicionarAdministrador = function (event) {
            event.preventDefault();
            this.administradores.push(new FAC.Socio());
        };
        Passo6Controller.prototype.consultarPessoaSocio = function (socio) {
            this.passo6.getInfoSocio(socio);
            return;
        };
        Passo6Controller.prototype.remover = function (event, index) {
            event.preventDefault();
            this.administradores.splice(index, 1);
        };
        Passo6Controller.prototype.voltar = function () {
            this.$location.path("/Passo5/" + this.fichaCadastral.NAS + "/" + this.fichaCadastral.CPFResponsavel);
        };
        Passo6Controller.prototype.avancar = function () {
            var _this = this;
            this.passo6.Administradores = this.administradores;
            this.passo6.salvar().then(function () {
                _this.$location.path("/Passo7/" + _this.fichaCadastral.NAS + "/" + _this.fichaCadastral.CPFResponsavel);
            }, function (response) {
                _this.notificacao.erro(response.data);
            });
        };
        Passo6Controller.$inject = ['$agnet', '$location', 'fichaCadastral', 'passo6', 'notificacaoFactory', '$q'];
        return Passo6Controller;
    }());
    FAC.Passo6Controller = Passo6Controller;
})(FAC || (FAC = {}));
//# sourceMappingURL=passo6.js.map