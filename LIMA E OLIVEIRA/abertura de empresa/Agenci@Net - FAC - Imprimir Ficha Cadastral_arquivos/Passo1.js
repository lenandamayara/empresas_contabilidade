// <reference path="../../agt-typings.ts" />
// <reference path="../../neAGT.d.ts" />
var FAC;
(function (FAC) {
    var Passo1Controller = (function () {
        function Passo1Controller($location, passo1, fichaCadastral, notificacaoFactory, $sessionStorage, $routeParams, area) {
            var _this = this;
            this.$location = $location;
            this.passo1 = passo1;
            this.fichaCadastral = fichaCadastral;
            this.notificacaoFactory = notificacaoFactory;
            this.$sessionStorage = $sessionStorage;
            this.$routeParams = $routeParams;
            this.passo1Notificacao = notificacaoFactory('passo1');
            if ($sessionStorage.FacNas == 'undefined' || $sessionStorage.FacNas == null || $sessionStorage.FacNas == '')
                $sessionStorage.FacNas = $routeParams.NAS;
            if (($sessionStorage.FacNas != 'undefined' && $sessionStorage.FacNas != null && $sessionStorage.FacNas != '') && ($sessionStorage.FacNas != $routeParams.NAS))
                $sessionStorage.FacNas = $routeParams.NAS;
            this.restrita = area === 'restrita';
            passo1.carregar().success(function (data) {
                $sessionStorage.TPSolPasso1 = data.fac.TipoSolicitacao;
                _this.TiposContribuinte = data.tiposContribuinte;
                _this.Passo1 = angular.copy(fichaCadastral.Passo1) || new Object();
                _this.TiposContrato = data.tiposContrato;
                if (_this.Passo1.TipoContratoNire == 2) {
                    _this.TiposContrato = _this.TiposContrato.filter(function (c) {
                        return c.Codigo == 2;
                    });
                }
                console.log(fichaCadastral.Passo1.TipoContribuinte);
                var valSelTpContb;
                angular.forEach(data.tiposContribuinte, function (value, key) {
                    if (value.Codigo == fichaCadastral.Passo1.TipoContribuinte)
                        valSelTpContb = value;
                });
                _this.Passo1.TipoContribuinteSelecionado = valSelTpContb;
            }).error(function (data) {
                _this.passo1Notificacao.erro(data);
                if ('Codigo' in data && data.Codigo == 50) {
                    $location.path('/');
                    notificacaoFactory('facLoginRestrita').limpar();
                    notificacaoFactory('passo1').limpar();
                    notificacaoFactory('facLoginRestrita').erro(data);
                }
                else if ('Codigo' in data && data.Codigo == 118) {
                    $sessionStorage.codErroFac = data.Codigo;
                    $sessionStorage.msgErroFac = data.Mensagem;
                    _this.$location.path("/Passo8/" + $sessionStorage.FacNas + "/" + _this.fichaCadastral.CPFResponsavel);
                }
            });
        }
        Passo1Controller.prototype.selecionarTipoContribuinte = function () {
            this.TipoSelecionado = this.Passo1.TipoContribuinteSelecionado;
            this.Passo1.TipoContribuinte = this.Passo1.TipoContribuinteSelecionado.Codigo;
            this.Passo1.TipoPessoaContribuinte = this.TipoSelecionado.TipoPessoa;
            if (this.$sessionStorage.TPSolPasso1 != 2)
                this.Passo1.CpfCnpjContribuinte = '';
            if (this.Passo1.TipoPessoaContribuinte === 'F')
                this.CpfCnpjMask = '999.999.999-99';
            else if (this.Passo1.TipoPessoaContribuinte === 'J')
                this.CpfCnpjMask = '99.999.999/9999-99';
        };
        Passo1Controller.prototype.avancar = function () {
            var _this = this;
            angular.copy(this.Passo1, this.passo1);
            var novaFicha = this.fichaCadastral.NAS == null || this.fichaCadastral.NAS == undefined;
            this.passo1.salvar().success(function () {
                var url = novaFicha ? '/GerarNAS/' : '/Passo2/';
                _this.$sessionStorage.FacNas = _this.fichaCadastral.NAS;
                _this.$location.path("" + url + _this.$sessionStorage.FacNas + "/" + _this.fichaCadastral.CPFResponsavel);
            })
                .error(function (erros) {
                _this.passo1Notificacao.tratarErrosMVC(erros, _this.formPasso1);
            });
        };
        Passo1Controller.prototype.cancelarFac = function () {
            var _this = this;
            if (confirm("A solicitação será cancelada DEFINITIVAMENTE, não sendo possível retornar o preenchimento. Tem certeza que deseja cancelar?")) {
                this.passo1.cancelar().then(function () {
                    alert('A FAC cujo NAS é ' + _this.fichaCadastral.NAS + ' foi cancelada com sucesso!');
                    _this.$location.path('/');
                });
            }
        };
        Passo1Controller.prototype.voltar = function () {
        };
        Passo1Controller.$inject = ['$location', 'passo1', 'fichaCadastral', 'notificacaoFactory', '$sessionStorage', '$routeParams', 'area'];
        return Passo1Controller;
    }());
    FAC.Passo1Controller = Passo1Controller;
})(FAC || (FAC = {}));
//# sourceMappingURL=passo1.js.map