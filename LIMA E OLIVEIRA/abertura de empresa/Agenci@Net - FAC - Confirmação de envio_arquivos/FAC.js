/// <reference path="../../agt-typings.ts" />
/// <reference path="passo1.ts" />
/// <reference path="passo2.ts" />
/// <reference path="passo3.ts" />
/// <reference path="passo4.ts" />
/// <reference path="passo5.ts" />
/// <reference path="passo6.ts" />
/// <reference path="passo7.ts" />
/// <reference path="passo8.ts" />
/// <reference path="passo9.ts" />
/// <reference path="passo10.ts" />
/// <reference path="pedidoinscricao.ts" />
/// <reference path="confirmacaoenvio.ts" />
var app = angular.module('FAC', ['AgNet', 'ngRoute', 'ui.mask', 'FACServico', 'ui.bootstrap', 'ui.utils.masks', 'ngMask']);
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            template: '<div></div>',
            controller: 'IndexController',
            title: 'Login'
        }).when('/SolicitarInscricao', {
            templateUrl: '/Templates/FAC/LoginCadastro.html',
            controller: 'SolicitarInscricaoController',
            title: 'FAC - Solicitar Inscrição'
        }).when('/AlterarFAC', {
            templateUrl: '/Templates/FAC/LoginAlteracao.html',
            controller: 'AlterarFACController',
            title: 'Alterar FAC'
        }).when('/AcompanhamentoSolicitacao', {
            templateUrl: '/Templates/FAC/AcompanhamentoSolicitacao.html',
            controller: 'ConsultarAcompanhamentoSolicitacaoController',
            title: 'Consulta acompanhamento de solicitação'
        }).when('/LoginAcompanhamentoSolicitacao', {
            templateUrl: '/Templates/FAC/LoginAcompanhamento.html',
            controller: 'LoginAcompanhamentoSolicitacaoController',
            title: 'Consulta acompanhamento de solicitação'
        }).when('/DetalharSolicitacao/:Nas/:Cfdf?/:Codigo?/:Data?', {
            templateUrl: '/Templates/FAC/DetalhamentoSolicitacaoFAC.html',
            controller: 'ConsultaDetalhamentoSolicitacaoController',
            title: 'Detalhamento do andamento da FAC'
        }).when('/DetalharSolicitacaoInscricao/:Nas/:Responsavel?', {
            templateUrl: '/Templates/FAC/DetalhamentoSolicitacaoInscricao.html',
            controller: 'ConsultaDetalhamentoSolicitacaoInscricaoController',
            title: 'Detalhamento do andamento da FAC'
        }).when('/Passo1/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/Passo1.html',
            controller: 'Passo1Controller',
            controllerAs: 'ctrl',
            title: 'FAC - Passo1'
        }).when('/GerarNAS/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/GerarNAS.html',
            controller: 'GerarNASController',
            controllerAs: 'ctrl',
            title: 'FAC - Passo1'
        }).when('/Passo2/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/Passo2.html',
            controller: 'Passo2Controller',
            controllerAs: 'ctrl',
            title: 'FAC - Passo2'
        }).when('/Passo3/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/Passo3.html',
            controller: 'Passo3Controller',
            controllerAs: 'ctrl',
            title: 'FAC - Passo3'
        }).when('/Passo4/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/Passo4.html',
            controller: 'Passo4Controller',
            controllerAs: 'ctrl',
            title: 'FAC - Passo4'
        }).when('/Passo5/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/Passo5.html',
            controller: 'Passo5Controller',
            controllerAs: 'ctrl',
            title: 'FAC - Passo5'
        }).when('/Passo6/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/Passo6.html',
            controller: 'Passo6Controller',
            controllerAs: 'ctrl',
            title: 'FAC - Passo6'
        }).when('/Passo7/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/Passo7.html',
            controller: 'Passo7Controller',
            controllerAs: 'ctrl',
            title: 'FAC - Passo7'
        }).when('/Passo8/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/Passo8.html',
            controller: 'Passo8Controller',
            controllerAs: 'ctrl',
            title: 'FAC - Relatório de críticas'
        }).when('/Passo9/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/Passo8.html',
            controller: 'Passo9Controller',
            controllerAs: 'ctrl',
            title: 'FAC - Imprimir Ficha Cadastral'
        }).when('/Passo10/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/Passo10.html',
            controller: 'Passo10Controller',
            controllerAs: 'ctrl',
            title: 'FAC - Enviar solicitação'
        }).when('/ConfirmacaoEnvio/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/ConfirmacaoEnvio.html',
            controller: 'ConfirmacaoEnvioController',
            controllerAs: 'ctrl',
            title: 'FAC - Confirmação de envio'
        }).when('/PedidoInscricao/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/PedidoInscricao.html',
            controller: 'PedidoInscricaoController',
            controllerAs: 'ctrl',
            title: 'FAC - Imprimir Requerimento'
        }).when('/Impressao/:NAS?/:CPF?', {
            templateUrl: '/Templates/FAC/PedidoInscricao.html',
            controller: 'PedidoInscricaoController',
            controllerAs: 'ctrl',
            title: 'FAC - Imprimir Requerimento'
        });
    }]);
app.controller('IndexController', ['$scope', '$location', function ($scope, $location) {
        var go = $scope.$parent.goto;
        if (angular.isString(go)) {
            $location.path(go);
        }
    }]);
app.controller('LoginAcompanhamentoSolicitacaoController', ['$scope', '$location', '$sessionStorage', function ($scope, $location, $sessionStorage) {
        $scope.avancar = function () {
            var solicitacao = $scope.solicitacao;
            var cpf = solicitacao.Cpf;
            $location.path("DetalharSolicitacaoInscricao/" + solicitacao.Nas + "/" + cpf);
        };
    }]);
app.controller('ConsultarAcompanhamentoSolicitacaoController', ['$scope', '$location', '$route', 'fichaCadastral', 'notificacaoFactory', function ($scope, $location, $route, fichaCadastral, notificacaoFactory) {
        var notificacao = notificacaoFactory('acompanhamento');
        $scope.consultaRealizada = false;
        $scope.login = {
            nameMask: [{
                    name: 'CPF',
                    mask: '999.999.999-99'
                }, {
                    name: 'CNPJ',
                    mask: '99.999.999/9999-99'
                }, {
                    name: 'CF/DF',
                    mask: '99.999.999/999-99'
                }]
        };
        fichaCadastral.carregarFormAcompanhamentoSolicitacao().success(function (data) {
            $scope.situacoes = data.situacoes;
            $scope.tiposSolicitacao = data.tiposSolicitacao;
            $scope.perfilAcesso = data.perfilAcesso;
            $scope.usuario = data.usuario;
            $scope.selecionarNAS = function (event, solicitacao) {
                event.preventDefault();
                $location.path("DetalharSolicitacao/" + solicitacao.NumeroNas + "/" + solicitacao.CfDf.replace(/[\/\.\-]/g, '') + "/" + $scope.consulta.Codigo + "/" + solicitacao.DataSolicitacao);
            };
            $scope.consultarAcompanhamento = function () {
                notificacao.limpar();
                fichaCadastral.consultarAcompanhamento($scope.consulta).then(function (res) {
                    $scope.consultaRealizada = true;
                    $scope.solicitacoes = res.data.solicitacoes;
                    $scope.contribuinte = res.data.contribuinte;
                }, function (res) {
                    if (angular.isArray(res.data)) {
                        notificacao.tratarErrosMVC(res.data, $scope.formulario);
                    }
                    notificacao.erro(res.data);
                });
            };
        }).error(function (data) {
            notificacao.erro(data);
        });
    }]);
app.controller('ConsultaDetalhamentoSolicitacaoInscricaoController', ['$scope', '$location', '$routeParams', 'fichaCadastral', 'notificacaoFactory', function ($scope, $location, $routeParams, fichaCadastral, notificacaoFactory) {
        var notificacao = notificacaoFactory('acompanhamento');
        var consulta = angular.copy($routeParams);
        fichaCadastral.consultarSolicitacaoInscricao(consulta).then(function (res) {
            $scope.solicitacao = res.data.solicitacao;
            $scope.andamentos = res.data.andamentos;
        }, function (res) {
            if (angular.isArray(res.data)) {
                angular.forEach(res.data, function (d) {
                    notificacao.erro(d);
                });
            }
            notificacao.erro(res.data);
        });
    }]);
app.controller('ConsultaDetalhamentoSolicitacaoController', ['$scope', '$location', '$routeParams', 'fichaCadastral', 'notificacaoFactory', function ($scope, $location, $routeParams, fichaCadastral, notificacaoFactory) {
        var notificacao = notificacaoFactory('acompanhamento');
        var consulta = angular.copy($routeParams);
        consulta.Data = new Date(parseInt(consulta.Data));
        fichaCadastral.consultarSolicitacao(consulta).then(function (res) {
            $scope.solicitacao = res.data.solicitacao;
            $scope.contribuinte = res.data.contribuinte;
            $scope.solicitante = res.data.solicitante;
            $scope.andamentos = res.data.andamentos;
        }, function (res) {
            if (angular.isArray(res.data)) {
                angular.forEach(res.data, function (d) {
                    notificacao.erro(d);
                });
            }
            notificacao.erro(res.data);
        });
    }]);
app.controller('AbasController', ['$scope', '$location', '$route', 'fichaCadastral', function ($scope, $location, $route, fichaCadastral) {
        $scope.$on('$routeChangeSuccess', function (event, current) {
            var caminho = current.$$route.originalPath;
            $scope.esconderAbas = (caminho === '/' || caminho.toUpperCase() === '/SOLICITARINSCRICAO');
            $scope.registrado = false;
            if (angular.isString(current.params.NAS) || angular.isString(fichaCadastral.NAS)) {
                $scope.registrado = true;
                $scope.NAS = current.params.NAS;
            }
            var passo = caminho.slice(1);
            passo = passo.slice(0, passo.indexOf('/'));
            $scope.passo = passo;
        });
        $scope.selecionarPasso = function (passo, event) {
            event.preventDefault();
            if (!$scope.registrado || $scope.passo === passo.slice(1)) {
                return;
            }
            var i = 0;
            var caminho = new Array();
            caminho[i++] = passo;
            caminho[i++] = '/';
            if (fichaCadastral.NAS != null && fichaCadastral != undefined)
                caminho[i++] = fichaCadastral.NAS;
            caminho[i++] = '/';
            if (angular.isString(fichaCadastral.CPFResponsavel))
                caminho[i++] = fichaCadastral.CPFResponsavel;
            $location.path(caminho.join(''));
        };
    }]);
app.controller('SolicitarAlteracaoFACController', ['$scope', '$sessionStorage', 'fichaCadastral', '$location', 'notificacaoFactory', function ($scope, $sessionStorage, fichaCadastral, $location, notificacaoFactory) {
        $scope.iniciarCadastro = function () {
            var notificacao = notificacaoFactory('fac');
            fichaCadastral.iniciarAtualizacaoFAC($scope.cadastro.CfDf).success(function (data) {
                $sessionStorage.FacNas = fichaCadastral.NAS;
                $location.path(['/GerarNAS/', fichaCadastral.NAS, '/', fichaCadastral.CPFResponsavel].join(''));
            }).error(function (erro) {
                if (angular.isArray(erro)) {
                    notificacao.tratarErrosMVC(erro, $scope.formIniciarCadastro);
                    return;
                }
                notificacao.erro(erro);
            });
        };
    }]);
app.controller('SolicitarInscricaoController', [function () { }]);
app.controller('AlterarFACController', ['$scope', '$location', 'fichaCadastral', function ($scope, $location, fichaCadastral) {
        fichaCadastral.consultarPerfilAcesso().then(function (res) {
            $scope.perfilAcesso = res.data.perfilAcesso;
            $scope.usuario = res.data.usuario;
        });
    }]);
app.controller('RetomarAlteracaoFACController', ['$scope', '$location', 'fichaCadastral', 'notificacaoFactory', function ($scope, $location, fichaCadastral, notificacaoFactory) {
        var notificacao = notificacaoFactory('fac');
        $scope.retomarCadastro = function () {
            fichaCadastral.NAS = $scope.retomarCadastro.NAS;
            fichaCadastral.retomarAtualizacaoFAC().success(function () {
                $location.path(['/Passo1/', fichaCadastral.NAS, '/', fichaCadastral.CPFResponsavel].join(''));
            }).error(function (erro) {
                if (angular.isArray(erro)) {
                    notificacao.tratarErrosMVC(erro, $scope.formRetomarCadastro);
                    return;
                }
                notificacao.erro(erro);
            });
        };
    }]);
app.controller('IniciarCadastroController', ['$scope', '$location', 'fichaCadastral', 'notificacaoFactory', '$sessionStorage', function ($scope, $location, fichaCadastral, notificacaoFactory, $sessionStorage) {
        var notificacao = notificacaoFactory('fac');
        $scope.iniciarCadastro = function () {
            fichaCadastral.iniciarCadastro($scope.cadastro).success(function () {
                $sessionStorage.FacNas = fichaCadastral.Nas;
                $location.path(['/Passo1/', fichaCadastral.NAS, '/', fichaCadastral.CPFResponsavel].join(''));
            }).error(function (erro) {
                if (angular.isArray(erro)) {
                    notificacao.tratarErrosMVC(erro, $scope.formIniciarCadastro);
                    return;
                }
                notificacao.erro(erro);
            });
        };
    }]);
app.controller('RetomarCadastroController', ['$scope', '$location', 'fichaCadastral', 'notificacaoFactory', '$sessionStorage', function ($scope, $location, fichaCadastral, notificacaoFactory, $sessionStorage) {
        var notificacao = notificacaoFactory('fac');
        $scope.retomarCadastroFc = function () {
            fichaCadastral.retomarCadastro($scope.retomarCadastro).success(function (retorno) {
                var passo = retorno != null ? retorno.Passo || '/Passo1' : '/Passo1';
                $sessionStorage.FacNas = $scope.retomarCadastro.NAS;
                passo += "/" + fichaCadastral.NAS + "/" + fichaCadastral.CPFResponsavel;
                $location.path(passo);
            }).error(function (erro) {
                if (angular.isArray(erro)) {
                    notificacao.tratarErrosMVC(erro, $scope.formRetomarCadastro);
                    return;
                }
                notificacao.erro(erro);
            });
        };
    }]);
app.controller('GerarNASController', ['$scope', '$location', 'fichaCadastral', function ($scope, $location, fichaCadastral) {
        $scope.cadastro = angular.copy(fichaCadastral);
        $scope.cadastro.DataSolicitacao = new Date();
        $scope.cadastro.DataFinalEntrega = new Date($scope.cadastro.DataSolicitacao.getTime() + 60 * 60 * 24 * 30 * 1000);
        $scope.avancar = function () {
            $location.path(['/Passo2/', fichaCadastral.NAS, '/', fichaCadastral.CPFResponsavel].join(''));
        };
    }]);
app.controller('Passo1Controller', FAC.Passo1Controller);
app.controller('Passo2Controller', FAC.Passo2Controller);
app.controller('Passo4Controller', FAC.Passo4Controller);
app.controller('Passo3Controller', FAC.Passo3Controller);
app.controller('Passo5Controller', FAC.Passo5Controller);
app.controller('Passo6Controller', FAC.Passo6Controller);
app.controller('Passo7Controller', FAC.Passo7Controller);
app.controller('Passo8Controller', FAC.Passo8Controller);
app.controller('Passo9Controller', FAC.Passo9Controller);
app.controller('Passo10Controller', FAC.Passo10Controller);
app.controller('PedidoInscricaoController', FAC.PedidoInscricaoController);
app.controller('ConfirmacaoEnvioController', FAC.ConfirmacaoEnvioController);
//# sourceMappingURL=FAC.js.map