// <reference path="../../agt-typings.ts" />
// <reference path="../../neAGT.d.ts" />
var FAC;
(function (FAC) {
    var Passo8Controller = (function () {
        function Passo8Controller(perfil, fichaCadastral, passo8, notificacaoFactory, $location, $sessionStorage) {
            var _this = this;
            this.perfil = perfil;
            this.fichaCadastral = fichaCadastral;
            this.passo8 = passo8;
            this.notificacaoFactory = notificacaoFactory;
            this.$location = $location;
            this.$sessionStorage = $sessionStorage;
            var notificacao = notificacaoFactory('passo8');
            this.exibirCriticas = true;
            this.opcoes = new Object();
            passo8.carregar().success(function (data) {
                notificacaoFactory('passo8').limpar();
                if ($sessionStorage.codErroFac == 118)
                    notificacaoFactory('passo8').erro($sessionStorage.msgErroFac);
                _this.contribuinte = data.contribuinte;
                console.log(_this.contribuinte);
                _this.fac = data.fac;
                _this.socios = data.socios;
                _this.administradores = data.administradores;
                _this.atividadesSecundarias = data.atividadesSecundarias;
                _this.criticasAviso = data.criticas.filter(function (c) {
                    return c.CodigoErro >= 900 && c.CodigoErro <= 999;
                });
                _this.criticasErro = data.criticas.filter(function (c) {
                    return c.CodigoErro < 900 || c.CodigoErro > 999;
                });
                _this.temErros = _this.criticasErro.length > 0;
                _this.opcoes.mostrarISS = angular.isString(_this.contribuinte.AtividadeISS) && _this.contribuinte.AtividadeISS != '';
                _this.opcoes.mostrarICMS = angular.isString(_this.contribuinte.AtividadeICMS) && _this.contribuinte.AtividadeICMS != '';
                _this.opcoes.mostrarAtividadesSecundarias = angular.isArray(_this.atividadesSecundarias) && _this.atividadesSecundarias.length > 0;
            }).error(function (data) {
                if (data.hasOwnProperty('Codigo') && data.Codigo == 10) {
                    notificacaoFactory('fac').erro(data.Mensagem);
                    $location.path('/');
                }
                else {
                    notificacao.erro(data);
                }
            });
        }
        Passo8Controller.prototype.avancar = function (event) {
            if (event)
                event.preventDefault();
            if (this.temErros) {
                return;
            }
            this.$location.path("/Passo9/" + this.fichaCadastral.NAS + "/" + this.fichaCadastral.CPFResponsavel);
        };
        Passo8Controller.prototype.imprimirFac = function () {
            window.open("/FAC/Requerimento/#/Impressao/" + this.fichaCadastral.NAS + "/" + this.fichaCadastral.CPFResponsavel, '_blank');
            //this.$location.path(`/PedidoInscricao/${this.fichaCadastral.NAS}/${this.fichaCadastral.CPFResponsavel}`);
        };
        Passo8Controller.prototype.cancelarFac = function () {
            var _this = this;
            if (confirm("A solicitação será cancelada DEFINITIVAMENTE, não sendo possível retornar o preenchimento. Tem certeza que deseja cancelar?")) {
                this.passo8.cancelar().then(function () {
                    alert('A FAC cujo NAS é ' + _this.fichaCadastral.NAS + ' foi cancelada com sucesso!');
                    _this.$location.path('/');
                });
            }
        };
        Passo8Controller.prototype.voltar = function (event) {
            if (event)
                event.preventDefault();
            this.$location.path("/Passo7/" + this.fichaCadastral.NAS + "/" + this.fichaCadastral.CPFResponsavel);
        };
        Passo8Controller.$inject = ['perfil', 'fichaCadastral', 'passo8', 'notificacaoFactory', '$location', '$sessionStorage'];
        return Passo8Controller;
    }());
    FAC.Passo8Controller = Passo8Controller;
})(FAC || (FAC = {}));
//# sourceMappingURL=passo8.js.map