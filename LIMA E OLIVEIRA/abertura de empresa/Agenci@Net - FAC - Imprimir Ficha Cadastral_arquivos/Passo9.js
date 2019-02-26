// <reference path="../../agt-typings.ts" />
// <reference path="../../neAGT.d.ts" />
var FAC;
(function (FAC) {
    var Passo9Controller = (function () {
        function Passo9Controller(perfil, fichaCadastral, passo9, notificacaoFactory, $location) {
            var _this = this;
            this.perfil = perfil;
            this.fichaCadastral = fichaCadastral;
            this.passo9 = passo9;
            this.notificacaoFactory = notificacaoFactory;
            this.$location = $location;
            var notificacao = notificacaoFactory('passo9');
            this.opcoes = new Object();
            this.exibirCriticas = false;
            passo9.carregar().success(function (data) {
                _this.contribuinte = data.contribuinte;
                _this.socios = data.socios;
                _this.administradores = data.administradores;
                _this.atividadesSecundarias = data.atividadesSecundarias;
                /*console.log(data.criticas);
                 for (var s in data.criticas.filter(function (c) {
                     return console.log(c.CodigoErro < 900); c.CodigoErro < 900 || c.CodigoErro > 999;
                 })) {
                                      _this.voltar();
                 }
                 ;*/
                for (var prop in data.criticas) {
                    if (data.criticas[prop].CodigoErro < 900 || data.criticas[prop].CodigoErro > 999)
                        _this.voltar();
                }
                ;
                _this.opcoes.mostrarISS = angular.isString(_this.contribuinte.AtividadeISS) && _this.contribuinte.AtividadeISS != '';
                _this.opcoes.mostrarICMS = angular.isString(_this.contribuinte.AtividadeICMS) && _this.contribuinte.AtividadeICMS != '';
                _this.opcoes.mostrarAtividadesSecundarias = angular.isArray(_this.atividadesSecundarias) && _this.atividadesSecundarias.length > 0;
            }).error(function (data) {
                if ('Codigo' in data && data.Codigo == 10) {
                    notificacaoFactory('fac').erro(data.Mensagem);
                    $location.path('/');
                    return;
                }
                notificacao.erro(data);
            });
        }
        Passo9Controller.prototype.avancar = function (event) {
            if (event)
                event.preventDefault();
            this.$location.path(['/Passo10/', this.fichaCadastral.NAS, '/', this.fichaCadastral.CPFResponsavel].join(''));
        };
        Passo9Controller.prototype.voltar = function (event) {
            if (event)
                event.preventDefault();
            this.$location.path(['/Passo8/', this.fichaCadastral.NAS, '/', this.fichaCadastral.CPFResponsavel].join(''));
        };
        Passo9Controller.$inject = ['perfil', 'fichaCadastral', 'passo9', 'notificacaoFactory', '$location'];
        return Passo9Controller;
    }());
    FAC.Passo9Controller = Passo9Controller;
})(FAC || (FAC = {}));
//# sourceMappingURL=passo9.js.map