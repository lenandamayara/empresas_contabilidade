// <reference path="../../agt-typings.ts" />
// <reference path="../../neAGT.d.ts" />
// <reference path="../../Servicos/FACServico.ts" />
var FAC;
(function (FAC) {
    var Passo10Controller = (function () {
        function Passo10Controller($agnet, $location, fichaCadastral, passo10, notificacaoFactory) {
            var _this = this;
            this.$agnet = $agnet;
            this.$location = $location;
            this.fichaCadastral = fichaCadastral;
            this.passo10 = passo10;
            this.notificacao = notificacaoFactory('passo10');
            this.passo10.carregar().then(function (res) {
                _this.contribuinte = res.data.contribuinte;
                _this.Nas = _this.contribuinte.NumeroNas || fichaCadastral.NAS;
                _this.criticasAviso = res.data.criticas.filter(function (c) { return (c.CodigoErro >= 900 && c.CodigoErro <= 999); });
                for (var s in res.data.criticas.filter(function (c) {
                    return c.CodigoErro < 900 || c.CodigoErro > 999;
                })) {
                    $location.path("/Passo8/" + _this.fichaCadastral.NAS + "/" + _this.fichaCadastral.CPFResponsavel);
                }
                ;
            });
        }
        Passo10Controller.prototype.voltar = function () {
            this.$location.path("/Passo9/" + this.fichaCadastral.NAS + "/" + this.fichaCadastral.CPFResponsavel);
        };
        Passo10Controller.prototype.confirmar = function () {
            var _this = this;
            if (confirm('Você tem certeza que deseja encaminhar esta solicitação?')) {
                this.fichaCadastral.gravarFAC().success(function () {
                    window.history.replaceState({}, '');
                    _this.$location.path("/ConfirmacaoEnvio/" + _this.fichaCadastral.NAS + "/" + _this.fichaCadastral.CPFResponsavel);
                });
            }
        };
        Passo10Controller.$inject = ['$agnet', '$location', 'fichaCadastral', 'passo10', 'notificacaoFactory'];
        return Passo10Controller;
    }());
    FAC.Passo10Controller = Passo10Controller;
})(FAC || (FAC = {}));
//# sourceMappingURL=passo10.js.map