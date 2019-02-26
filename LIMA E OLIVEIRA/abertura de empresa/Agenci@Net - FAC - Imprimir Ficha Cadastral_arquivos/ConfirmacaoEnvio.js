// <reference path="../../agt-typings.ts" />
// <reference path="../../neAGT.d.ts" />
// <reference path="../../Servicos/FACServico.ts
var FAC;
(function (FAC) {
    var ConfirmacaoEnvioController = (function () {
        function ConfirmacaoEnvioController($window, $location) {
            this.window = $window;
            this.window.history.pushState({}, this.window.document.title);
            this.location = $location;
        }
        ConfirmacaoEnvioController.prototype.sair = function () {
            this.window.location.href = '/';
        };
        ConfirmacaoEnvioController.prototype.confirmar = function () {
            if (confirm('Você tem certeza que deseja encaminhar esta solicitação?')) {
                window.history.replaceState({}, '');
                this.location.path("/PedidoInscricao/" + this.fichaCadastral.NAS + "/" + this.fichaCadastral.CPFResponsavel);
            }
        };
        ConfirmacaoEnvioController.$inject = ['$window', '$location'];
        return ConfirmacaoEnvioController;
    }());
    FAC.ConfirmacaoEnvioController = ConfirmacaoEnvioController;
})(FAC || (FAC = {}));
//# sourceMappingURL=ConfirmacaoEnvio.js.map