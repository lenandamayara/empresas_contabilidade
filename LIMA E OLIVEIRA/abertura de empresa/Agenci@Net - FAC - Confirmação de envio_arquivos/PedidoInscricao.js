// <reference path="../../agt-typings.ts" />
// <reference path="../../neAGT.d.ts" />
// <reference path="../../Servicos/FACServico.ts" />
var FAC;
(function (FAC) {
    var PedidoInscricaoController = (function () {
        function PedidoInscricaoController($window, $location, fichaCadastral) {
            var _this = this;
            this.templateUrl = '/Templates/FAC/PedidoInscricao.html';
            this.window = $window;
            this.window.history.pushState({}, this.window.document.title);
            this.location = $location;
            this.fichaCadastral = fichaCadastral;
            this.fichaCadastral.imprimirPedidoInscricao().success(function (data) {
                _this.contribuinte = data.contribuinte;
                _this.fac = data.fac;
                _this.criticas = data.criticas;
                _this.contador = fichaCadastral.Passo4;
                _this.NAS = _this.contribuinte.NAS || fichaCadastral.NAS;
                _this.criticasAviso = data.criticas.filter(function (c) {
                    return c.CodigoErro >= 900 && c.CodigoErro <= 999;
                });
                for (var s in data.criticas.filter(function (c) {
                    return c.CodigoErro < 900 || c.CodigoErro > 999;
                })) {
                    _this.location.path("/Passo8/" + _this.fichaCadastral.NAS + "/" + _this.fichaCadastral.CPFResponsavel);
                }
                ;
            });
        }
        PedidoInscricaoController.prototype.sair = function () {
            this.window.location.href = '/';
        };
        PedidoInscricaoController.$inject = ['$window', '$location', 'fichaCadastral'];
        return PedidoInscricaoController;
    }());
    FAC.PedidoInscricaoController = PedidoInscricaoController;
})(FAC || (FAC = {}));
//# sourceMappingURL=pedidoinscricao.js.map