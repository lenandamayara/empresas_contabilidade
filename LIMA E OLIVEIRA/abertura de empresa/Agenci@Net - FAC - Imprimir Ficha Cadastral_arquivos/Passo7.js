// <reference path="../../agt-typings.ts" />
// <reference path="../../neAGT.d.ts" />
var FAC;
(function (FAC) {
    var Passo7Controller = (function () {
        function Passo7Controller($agnet, $location, passo7, notificacaoFactory, fichaCadastral) {
            var _this = this;
            this.$agnet = $agnet;
            this.$location = $location;
            this.passo7 = passo7;
            this.notificacaoFactory = notificacaoFactory;
            this.fichaCadastral = fichaCadastral;
            this.notificacao = notificacaoFactory('passo7');
            this.issDesabilitado = false;
            passo7.carregar().success(function (data) {
                if (_this.fichaCadastral.Situacao > 1) {
                    _this.$location.path("/Passo8/" + _this.fichaCadastral.NAS + "/" + _this.fichaCadastral.CPFResponsavel);
                }
                _this.regimesIss = data.regimesIss;
                _this.faixasIss = data.faixasIss;
                _this.motivosIss = data.motivosIss;
                _this.regimesIcms = data.regimesIcms;
                _this.faixasIcms = data.faixasIcms;
                _this.motivosIcms = data.motivosIcms;
                _this.Passo7 = data.fac.Passo7;
                _this.issDesabilitado = false;
                _this.icmsDesabilitado = false;
                _this.notificacao.limpar();
                var iss10 = (_this.Passo7.RegimeIss == 10);
                if (iss10)
                    _this.notificacao.aviso('Para contribuintes enquadrados no SIMPLES NACIONAL, não é possível alterar informações contidas nesse PASSO. Utilize o menu lateral para acessar o passo desejado. Caso você deseje se desenquadrar do SIMPLES NACIONAL, faça a comunicação à Secretaria da Receita Federal do Brasil (RFB) por meio do Portal do Simples Nacional na Internet (www.receita.fazenda.gov.br).');
            }).error(function (data) {
                if (data.hasOwnProperty('Codigo') && data.Codigo == 10) {
                    notificacaoFactory('fac').erro(data.Mensagem);
                    $location.path('/');
                }
                _this.notificacao.erro(data);
            });
        }
        Passo7Controller.prototype.voltar = function () {
            this.$location.path('/Passo6/${this.fichaCadastral.NAS}/${this.fichaCadastral.CPFResponsavel}');
        };
        Passo7Controller.prototype.avancar = function () {
            var _this = this;
            /* if (!this.issDesabilitado && this.Passo7.RegimeIss != 10) {
                 if (this.formPasso7.RegimeIss.$error.required) {
                     this.notificacao.erro('ISS: o campo regime é obrigatório.');
                     return;
                 }
                 if (this.formPasso7.DataRegimeIss.$error.required) {
                     this.notificacao.erro('ISS: o campo data do regime é obrigatório.');
                     return;
                 }
                 if (this.formPasso7.RegimeIss != 10) {
                     if (this.formPasso7.MotivoRegimeIss.$error.required) {
                         this.notificacao.erro('ISS: o campo motivo é obrigatório.');
                         return;
                     }
                 }
             }
             if (!this.icmsDesabilitado && this.Passo7.RegimeIcms != 10) {
                 if (this.formPasso7.RegimeIcms.$error.required) {
                     this.notificacao.erro('ICMS: o campo regime é obrigatório.');
                     return;
                 }
                 if (this.formPasso7.DataRegimeIcms.$error.required) {
                     this.notificacao.erro('ICMS: o campo data do regime é obrigatório.');
                     return;
                 }
             }*/
            angular.copy(this.Passo7, this.passo7);
            this.passo7.salvar().then(function () {
                _this.$location.path("/Passo8/" + _this.fichaCadastral.NAS + "/" + _this.fichaCadastral.CPFResponsavel);
            }, function (res) {
                if (angular.isArray(res.data)) {
                    _this.notificacao.tratarErrosMVC(res.data);
                }
                else {
                    _this.notificacao.erro(res.data);
                }
            });
        };
        Passo7Controller.$inject = ['$agnet', '$location', 'passo7', 'notificacaoFactory', 'fichaCadastral'];
        return Passo7Controller;
    }());
    FAC.Passo7Controller = Passo7Controller;
})(FAC || (FAC = {}));
//# sourceMappingURL=passo7.js.map