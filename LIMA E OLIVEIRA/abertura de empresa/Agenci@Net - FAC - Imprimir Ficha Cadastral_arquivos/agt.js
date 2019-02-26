angular.module('AgNet', [
        'ngAnimate', 'ui.bootstrap', 'ngCookies', 'ngRoute', 'angular-loading-bar', 'mgcrea.ngStrap', 'ngMask', 'ui.mask', 'ngStorage'
]).factory('httpInterceptor', [
        '$q', 'RedirectService', function ($q, redirect, scope) {
            return {
                responseError: function (response) {
                    var status = response.status;
                    var data = response.data;
                    if (status === 401) {
                        redirect.url('/Acesso/Login?url=' + window.location.pathname);
                    } else if (status === 493 && window.location.pathname.toLowerCase().slice(0, 3) !== ('/cx')) {
                        redirect.url(['/Acesso/Bloqueio?notificacoes=', data.NotificacoesPendentes, '&comunicados=', data.ComunicadosPendentes].join(''));
                    } else if (status === 400 || status === 500) {
                        if (angular.isObject(data)) {
                            switch (data.Codigo) {
                                case 10:
                                case 50:
                                case 62:
                                case 67:
                                case 69:
                                case 71:
                                case 97:
                                case 118:
                                    return $q.reject(response);
                                default:
                            }
                            redirect.erro({
                                Codigo: data.Codigo,
                                Programa: data.Programa,
                                PaginaAnterior: '/'
                            });
                        }
                        if (angular.isArray(data)) {
                            redirect.erro({
                                Mensagem: data[0].Erros,
                                PaginaAnterior: '/'
                            });
                        }
                    }

                    return $q.reject(response);
                }
            }
        }
]).config([
        '$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('httpInterceptor');
        }
]).config([
        '$compileProvider', function ($compileProvider) {
            $compileProvider.debugInfoEnabled(true);
        }
]).config([
        '$provide', function ($provide) {
            $provide.decorator('datepickerPopupDirective', [
                '$delegate', function ($delegate) {
                    var directive = $delegate[0];
                    var link = directive.link;

                    directive.compile = function () {
                        return function (scope, element) {
                            link.apply(this, arguments);
                            element.mask('99/99/9999');
                        };
                    };

                    return $delegate;
                }
            ]);
        }
]).run([
        'paginationConfig', function (paginationConfig) {
            paginationConfig.boundaryLinks = true;
            paginationConfig.rotate = true;
            paginationConfig.maxSize = 10;
            paginationConfig.previousText = 'Anterior';
            paginationConfig.nextText = 'Próximo';
            paginationConfig.firstText = 'Primeiro';
            paginationConfig.lastText = 'Último';
        }
]).run([
        'datepickerPopupConfig', function (datepickerPopupConfig) {
            datepickerPopupConfig.datepickerPopup = 'dd/MM/yyyy';
            datepickerPopupConfig.closeText = 'Fechar';
            datepickerPopupConfig.currentText = 'Hoje';
            datepickerPopupConfig.clearText = 'Limpar';
        }
]).service('RedirectService', [
        '$window', '$document', '$location',
        function ($window, $document, $location) {
            this.url = function (url) {
                if (!angular.isString(url)) return;
                $window.location = url;
            };

            this.erro = function (opcoes) {
                if (!angular.isObject(opcoes)) return;
                var urlErro = $document.find('html')[0].dataset.agtAreaAcesso === 'publica'
                    ? '/Error/ErroPublica?'
                    : '/Error/ErroRestrita?';
                if (opcoes.hasOwnProperty('Programa') && opcoes.Programa != null) {
                    urlErro += 'Programa=' + opcoes.Programa + '&';
                }
                if (opcoes.hasOwnProperty('Codigo') && opcoes.Codigo != null) {
                    urlErro += 'Codigo=' + opcoes.Codigo + '&';
                }
                if (opcoes.hasOwnProperty('Mensagem') && opcoes.Mensagem != null) {
                    urlErro += 'Mensagem=' + opcoes.Mensagem + '&';
                }
                if (opcoes.hasOwnProperty('PaginaAnterior') && opcoes.PaginaAnterior !== '/') {
                    urlErro += 'PaginaAnterior=' + opcoes.PaginaAnterior + '&';
                } else if (opcoes.hasOwnProperty('PaginaAnterior') && opcoes.PaginaAnterior != null) {
                    urlErro += 'PaginaAnterior=$' + $location.path() + '&';
                }
                $window.location = urlErro;
            };
        }
]).factory('captchaModel', [
        function () {
            return {
                txtCaptcha: ''
            }
        }
]).factory('$agnet', [
        '$http', '$timeout', '$window', '$q', 'captchaModel', 'area', 'RedirectService', '$sessionStorage',
        function AgNetFactory($http, $timeout, $window, $q, captchaValue, area, redirect, sessionStorage) {
            function AgNet() {
                this.timeout = 15 * 60; // tempo de sessão em minutos
                this.renovarSessaoCbs = [];
            }

            AgNet.prototype.pendingRequests = $http.pendingRequests;
            AgNet.prototype.renovarSessao = function () {
                if (this.timeOutID) $timeout.cancel(this.timeOutID);
                if ($window.location.pathname.match(/^\/Acesso\/.+$/) != null) return;
                this.timeOutID = $timeout(function () {
                    if (area === 'publica') return;
                    sessionStorage.$reset();
                    redirect.url('/Acesso/Login?url=' + $window.location.pathname);
                }, this.timeout * 1000);
                angular.forEach(this.renovarSessaoCbs, function (cb) {
                    if (angular.isFunction(cb)) cb();
                });
            };
            AgNet.prototype.adicionarCBRenovarSessao = function (fun) {
                this.renovarSessaoCbs.push(fun);
            };
            AgNet.prototype.mvcPost = function (url, data, ptr) {
                return this.mvcAction(url, 'POST', data, ptr);
            }
            AgNet.prototype.mvcGet = function (url, data, ptr) {
                return this.mvcAction(url, 'GET', data, ptr);
            }
            AgNet.prototype.mvcAction = function (url, method, data, ptr) {
                this.renovarSessao();
                data = data || {};
                var cancelador = $q.defer();
                if (angular.isObject(ptr)) ptr.cancelador = cancelador;
                var headers = {};
                if (area === 'publica') {
                    headers = {
                        'Captcha': captchaValue.txtCaptcha
                    };
                }
                return $http({
                    url: url,
                    method: method,
                    headers: headers,
                    data: data,
                    timeout: cancelador.promise
                });
            };
            return new AgNet();
        }
]).factory('acessibilidade', [
        '$document', function ($document) {
            function Acessibilidade() {
                this.tamanhoOriginal = 12;
                this.tamanho = 12;
                this.body = $document.find('body');
            }

            Acessibilidade.prototype.aumentar = function () {
                if (this.tamanho > 18) return;
                this.tamanho += 2;
                this.atualizar();
            };
            Acessibilidade.prototype.diminuir = function () {
                if (this.tamanho < 11) return;
                this.tamanho -= 2;
                this.atualizar();
            };
            Acessibilidade.prototype.restaurar = function () {
                this.tamanho = this.tamanhoOriginal;
                this.atualizar();
            };
            Acessibilidade.prototype.atualizar = function () {
                this.body.css({
                    fontSize: this.tamanho + 'px'
                });
            };
            return new Acessibilidade();
        }
]).factory('autenticar', [
        '$agnet', function ($agnet) {
            return $agnet.mvcGet('/Acesso/Usuario');
        }
]).factory('area', [
        '$document', function ($document) {
            return $document.find('html')[0].dataset.agtAreaAcesso || '';
        }
]).factory('caixaMensagem', [
        '$agnet',
        function ($agnet) {
            function CaixaMensagem() {
                this.QtdMsg = 0;
                this.versao = 0;
                this.atualizar();
            }

            CaixaMensagem.prototype = {
                atualizar: function () {
                    var self = this;
                    return $agnet.mvcGet('/CX/ConsultarCaixaPerfil').success(function (caixa) {
                        for (var p in caixa) {
                            self[p] = caixa[p];
                        }
                        self.versao += 1;
                    });
                }
            };
            return new CaixaMensagem();
        }
]).filter('cpfcnpj', [
        function () {
            return function (identidade) {
                if (!angular.isString(identidade)) return identidade;
                var match = identidade.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
                if (match) return match.slice(1, -1).join('.') + '-' + match[match.length - 1];
                match = identidade.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
                if (match) return match.slice(1, -2).join('.') + '/' + match[match.length - 2] + '-' + match[match.length - 1];
                return identidade;
            };
        }
]).filter('nfe', [
        function () {
            return function (nfe) {
                if (!angular.isString(nfe)) return '';
                var match = nfe.match(/^(\d{3})(\d{3})(\d{8})(\d{2})(\d{2})$/);
                if (match) return match.slice(1, 4).join('.') + '/' + match[4] + '-' + match[5];
                return nfe;
            };
        }
]).filter('numeroAutenticacao', [
        function () {
            return function (numeroAutenticacao) {
                if (!angular.isString(numeroAutenticacao)) return '';
                var match = numeroAutenticacao.match(/^(\d{1})(\d{3})(\d{5})(\d{4})$/);
                if (match) return [match[1], '-', match[2], '-', match[3], '/', match[4]].join('');
                return numeroAutenticacao;
            };
        }
]).filter('cfdf', [
        function () {
            return function (identidade) {
                if (!angular.isString(identidade)) return '';
                var match = identidade.match(/^(\d{2})(\d{3})(\d{3})(\d{3})(\d{2})$/);
                if (match) return match.slice(1, -2).join('.') + '/' + match[match.length - 2] + '-' + match[match.length - 1];
                return identidade;
            };
        }
]).filter('danfe', [
        function () {
            return function (danfe) {
                if (!angular.isString(danfe)) return '';
                var regex = /^(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})$/;
                var match = danfe.match(regex);
                if (match) {
                    return match.slice(1, match.length).join(' ');
                }
                return danfe;
            };
        }
]).filter('cep', [
        function () {
            return function (cep) {
                if (!angular.isString(cep)) return '';
                var match = cep.match(/^(\d{5})(\d{3})$/);
                if (match) return match[1] + '-' + match[2];
                return cep;
            };
        }
]).filter('aidf', [
        function () {
            return function (aidf) {
                if (!angular.isString(aidf)) return '';
                var match = aidf.match(/^(\d)(\d{3})(\d{5})(\d{4})$/);
                if (match) return match.slice(1, 4).join('-') + '/' + match[4];
                return aidf;
            };
        }
]).filter('offset', [
        function () {
            return function (input, start) {
                if (!angular.isArray(input)) return input;
                start = parseInt(start);
                return input.slice(start);
            };
        }
]).directive('agtCertificadoImg', [
        'autenticar', function (autenticar) {
            return {
                restrict: 'C',
                link: function (scope, elem) {
                    autenticar.success(function (data) {
                        if (data.Usuario.TipoPessoa === 1) {
                            elem.addClass('agt-certificado-cpf');
                        }
                        if (data.Usuario.TipoPessoa === 2) {
                            elem.addClass('agt-certificado-cnpj');
                        }
                    });
                }
            };
        }
]).directive('agtCaixaMensagemContador', [
        'caixaMensagem', function (caixaMensagem) {
            return {
                restrict: 'AC',
                scope: true,
                link: function (scope) {
                    scope.$watch(function () {
                        return caixaMensagem.versao;
                    }, function () {
                        scope.temMensagemNaoLida = angular.isNumber(caixaMensagem.QtdMsgNaoLida) && caixaMensagem.QtdMsgNaoLida != 0;
                        scope.numMsgNaoLida = caixaMensagem.QtdMsgNaoLida || 0;
                    });
                }
            };
        }
]).directive('agtCertificadoInfo', [
        'autenticar', '$timeout', '$agnet', '$filter',
        function (autenticar, $timeout, $agnet, $filter) {
            var tiposDoc = {
                1: 'CPF',
                2: 'CNPJ'
            };
            return {
                scope: false,
                restrict: 'C',
                link: function (scope) {
                    autenticar.success(function (data) {
                        scope.certificado = {};
                        scope.certificado.nome = data.Usuario.Nome;
                        scope.certificado.tipoPessoa = tiposDoc[data.Usuario.TipoPessoa];
                        scope.certificado.identidade = $filter('cpfcnpj')(data.Usuario.Identidade);
                        scope.certificado.validade = $filter('date')(data.Validade, 'dd/MM/yyyy');;
                        scope.certificado.emissor = data.Emitente;
                        var timeout;
                        $agnet.adicionarCBRenovarSessao(function () {
                            if (timeout) $timeout.cancel(timeout);
                            var atualizar = function (tempo) {
                                var segundos = tempo % 60;
                                var minutos = Math.floor(tempo / 60);
                                scope.certificado.sessaoExpira = minutos + 'min ' + segundos + 's';
                                tempo--;
                                timeout = $timeout(function () { atualizar(tempo); }, 1000);
                            };
                            atualizar($agnet.timeout || 0);
                        });
                    });
                    autenticar.error(function (data) {
                        console.log(data.Usuario.Nome);
                        scope.certificado = {};
                        scope.certificado.nome = data.Usuario.Nome;
                        scope.certificado.tipoPessoa = tiposDoc[data.Usuario.TipoPessoa];
                        scope.certificado.identidade = $filter('cpfcnpj')(data.Usuario.Identidade);
                        scope.certificado.validade = $filter('date')(data.Validade, 'dd/MM/yyyy');;
                        scope.certificado.emissor = data.Emitente;
                        var timeout;
                        $agnet.adicionarCBRenovarSessao(function () {
                            if (timeout) $timeout.cancel(timeout);
                            var atualizar = function (tempo) {
                                var segundos = tempo % 60;
                                var minutos = Math.floor(tempo / 60);
                                scope.certificado.sessaoExpira = minutos + 'min ' + segundos + 's';
                                tempo--;
                                timeout = $timeout(function () { atualizar(tempo); }, 1000);
                            };
                            atualizar($agnet.timeout || 0);
                        });
                    });

                }
            };
        }
]).directive('agtEstadosBrasil', [
        function () {
            var EstadosBrasil = [
                {
                    id: '',
                    name: ''
                }, {
                    id: 'AC',
                    name: 'AC'
                }, {
                    id: 'AL',
                    name: 'AL'
                }, {
                    id: 'AP',
                    name: 'AP'
                }, {
                    id: 'AM',
                    name: 'AM'
                }, {
                    id: 'BA',
                    name: 'BA'
                }, {
                    id: 'CE',
                    name: 'CE'
                }, {
                    id: 'DF',
                    name: 'DF'
                }, {
                    id: 'ES',
                    name: 'ES'
                }, {
                    id: 'GO',
                    name: 'GO'
                }, {
                    id: 'MA',
                    name: 'MA'
                }, {
                    id: 'MG',
                    name: 'MG'
                }, {
                    id: 'MS',
                    name: 'MS'
                }, {
                    id: 'MT',
                    name: 'MT'
                }, {
                    id: 'PA',
                    name: 'PA'
                }, {
                    id: 'PB',
                    name: 'PB'
                }, {
                    id: 'PE',
                    name: 'PE'
                }, {
                    id: 'PI',
                    name: 'PI'
                }, {
                    id: 'PR',
                    name: 'PR'
                }, {
                    id: 'RJ',
                    name: 'RJ'
                }, {
                    id: 'RN',
                    name: 'RN'
                }, {
                    id: 'RO',
                    name: 'RO'
                }, {
                    id: 'RR',
                    name: 'RR'
                }, {
                    id: 'RS',
                    name: 'RS'
                }, {
                    id: 'SC',
                    name: 'SC'
                }, {
                    id: 'SE',
                    name: 'SE'
                }, {
                    id: 'SP',
                    name: 'SP'
                }, {
                    id: 'TO',
                    name: 'TO'
                }, {
                    id: 'EX',
                    name: 'EX'
                }
            ];
            return {
                require: '?ngModel',
                link: function (scope, element, attr, ngModel) {
                    angular.forEach(EstadosBrasil, function (item) {
                        var listData = '<option value="' + item.id + '">' + item.name + '</option>';
                        element.append(listData);
                    });
                    if (!ngModel) return;
                    ngModel.$render = function () {
                        angular.forEach(element.children(), function (option) {
                            if (option.value === (ngModel.$viewValue || '')) option.selected = true;
                        });
                    };
                    element.on('blur keyup change', function () {
                        scope.$apply(function () {
                            angular.forEach(element.children(), function (option) {
                                if (option.selected) ngModel.$setViewValue(option.value);
                            });
                        });
                    });
                }
            };
        }
]).directive('agtAcessibilidadeAumentarFonte', [
        'acessibilidade', function (acessibilidade) {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    element.on('click', function (event) {
                        event.preventDefault();
                        acessibilidade.aumentar();
                    });
                }
            };
        }
]).directive('agtAcessibilidadeDiminuirFonte', [
        'acessibilidade', function (acessibilidade) {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    element.on('click', function (event) {
                        event.preventDefault();
                        acessibilidade.diminuir();
                    });
                }
            };
        }
]).directive('agtAcessibilidadeVoltarAoNormal', [
        'acessibilidade', function (acessibilidade) {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    element.on('click', function (event) {
                        event.preventDefault();
                        acessibilidade.restaurar();
                    });
                }
            };
        }
]).directive('agtAcessibilidadeContraste', [
        function () {
            var dir = this;
            this.estilos = [];
            this.imagens = [];
            var links = document.head.getElementsByTagName('link');
            var imgs = document.body.getElementsByTagName('img');
            angular.forEach(links, function (link) {
                var normal = link.getAttribute('href');
                var contraste = link.getAttribute('data-contraste');
                if (angular.isString(contraste)) {
                    estilos.push({
                        normal: normal,
                        contraste: contraste,
                        element: link
                    });
                }
            });
            angular.forEach(imgs, function (img) {
                var contraste = img.getAttribute('data-contraste');
                if (angular.isString(contraste)) {
                    var normal = img.getAttribute('src');
                    imagens.push({
                        normal: normal,
                        contraste: contraste,
                        element: img
                    });
                }
            });
            this.contrasteAtivo = false;

            this.toggle = function () {
                this.contrasteAtivo = !this.contrasteAtivo;
                var tipo = this.contrasteAtivo ? 'contraste' : 'normal';
                angular.forEach(this.imagens, function (estilo) {
                    estilo.element.setAttribute('src', estilo[tipo]);
                });
                angular.forEach(this.estilos, function (estilo) {
                    estilo.element.setAttribute('href', estilo[tipo]);
                });
            };
            return {
                restrict: 'C',
                link: function (scope, element) {
                    element.on('click', function (event) {
                        scope.$apply(function () {
                            dir.toggle();
                            event.preventDefault();
                        });
                    });
                }
            };
        }
]).directive('ngEnter', [
        function () {
            return function (scope, element, attrs) {
                element.bind('keydown keypress', function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter);
                        });
                        event.preventDefault();
                    }
                });
            };
        }
]).factory('perfil', [
        '$agnet', '$sessionStorage',
        function ($agnet, sessionStorage) {
            var promiseConsultarPerfis = null;

            function Perfil() {
                this.aoMudar = [];
            }

            Perfil.prototype._executarAoMudar = function () {
                angular.forEach(this.aoMudar, function (cb) {
                    cb();
                });
            };
            Perfil.prototype.consultarPerfis = function () {
                var self = this;
                if (promiseConsultarPerfis != null) return promiseConsultarPerfis;
                var perfilData = sessionStorage.agtPerfil;
                var req = $agnet.mvcGet('/Acesso/Perfil');
                req.success(function (perfis) {
                    angular.forEach(perfis, function (tipo) {
                        if (perfilData && tipo.Sigla === perfilData.siglaPerfil) {
                            self.modo = 1;
                            self.tipo = tipo;
                            angular.forEach(tipo.Contribuintes, function (contb) {
                                if (contb.BpaElemento === perfilData.bpaPerfil) {
                                    self.modo = 2;
                                    self.contribuinte = contb;
                                }
                            });
                        }
                    });
                    self._executarAoMudar();
                });
                promiseConsultarPerfis = req;
                return req;
            };
            Perfil.prototype.selecionarPerfil = function (tipo, contb) {
                var data = {
                    siglaPerfil: null,
                    bpaPerfil: null
                };
                this.modo = 1;
                this.tipo = tipo;
                if (angular.isObject(tipo) && angular.isString(tipo.Sigla)) {
                    data.siglaPerfil = tipo.Sigla;
                }
                this.contribuinte = null;
                if (angular.isObject(contb)) {
                    this.modo = 2;
                    this.contribuinte = contb;
                    data.bpaPerfil = contb.BpaElemento;
                }
                sessionStorage.agtPerfil = data;
                this._executarAoMudar();
            };
            Perfil.prototype.AdicionarCbAoMudar = function (evento) {
                this.aoMudar.push(evento);
            };
            Perfil.prototype.limpar = function () {
                this.selecionarPerfil(null, null);
                this.modo = 0;
            };
            return new Perfil();
        }
]).directive('agtPerfil', [
        'perfil',
        function (perfil) {
            return {
                restrict: 'C',
                scope: true,
                link: function (scope) {
                    perfil.consultarPerfis().success(function (perfis) {
                        scope.perfis = perfis;
                    });
                    scope.selecionarPerfil = function (tipo, contb) {
                        if (angular.isObject(contb)) {
                            scope.isCollapsed = false;
                        }
                        perfil.selecionarPerfil(tipo, contb);
                        scope.agtPerfil = perfil;
                    };
                    scope.limparPerfil = function () {
                        perfil.limpar();
                    };
                    scope.agtPerfil = perfil;
                }
            };
        }
]).directive('agtPerfilContribuinteObrigatorio', [
        'perfil', 'area',
        function (perfil, area) {
            return {
                transclude: true,
                require: '?ngModel',
                link: function (scope, element, attrs, ngModel) {
                    if (ngModel) {
                        ngModel.$render = function () {
                            scope.agtPerfil = {
                                modo: ngModel.$viewValue ? 2 : 0
                            };
                        }
                        return;
                    }
                    if (area === 'publica') {
                        scope.agtPerfil = {
                            modo: 2
                        };
                        return;
                    }
                    perfil.consultarPerfis().success(function (perfis) {
                        scope.perfis = perfis;
                    });
                    scope.selecionarPerfil = function (tipo, contb) {
                        if (angular.isObject(contb)) scope.isCollapsed = false;
                        perfil.selecionarPerfil(tipo, contb);
                        scope.agtPerfil = perfil;
                    };
                    scope.limparPerfil = function () {
                        perfil.limpar();
                    };
                    scope.agtPerfil = perfil;
                },
                templateUrl: '/Templates/AGT/SelecionarPerfil.html'
            };
        }
]).factory('Alerta', [
        function () {
            function Alerta(tipo, mensagem) {
                this.tipo = tipo;
                this.mensagem = mensagem;
            }

            return Alerta;
        }
]).factory('notificacaoFactory', [
        'Alerta', '$sce',
        function (Alerta, $sce) {
            var notificacoes = {};

            function Notificacao(id) {
                this.id = id;
                this.limpar();
            }

            Notificacao.prototype = {
                alerta: function (tipo, mensagem) {
                    if (angular.isString(mensagem)) {
                        this.alertas.push(new Alerta(tipo, $sce.trustAsHtml(mensagem)));
                    } else if (angular.isObject(mensagem)) {
                        var msg = ['<dl class="dl-horizontal" style="margin-bottom: 0">'];
                        for (var p in mensagem) {
                            if (mensagem.hasOwnProperty(p) && p !== 'Programa') {
                                msg.push('<dt>');
                                msg.push(p);
                                msg.push('</dt>');
                                msg.push('<dd>');
                                msg.push(mensagem[p]);
                                msg.push('</dd>');
                            }
                        }
                        msg.push('</dl>');
                        this.alertas.push(new Alerta(tipo, $sce.trustAsHtml(msg.join(''))));
                    }
                },
                sucesso: function (mensagem) {
                    this.alerta('alert-success', mensagem);
                },
                aviso: function (mensagem) {
                    this.alerta('alert-warning', mensagem);
                },
                erro: function (mensagem) {
                    this.alerta('alert-danger', mensagem);
                },
                info: function (mensagem) {
                    this.alerta('alert-info', mensagem);
                },
                limpar: function () {
                    this.alertas = [];
                },
                fechar: function (indexAlerta) {
                    this.alertas.splice(indexAlerta, 1);
                },
                obterLabelPorId: function (form, id) {
                    var self = this;
                    var labels;
                    if (id == null) {
                        return null;
                    }
                    if (!(form.name in self.formsIndexados)) {
                        labels = new Object();
                        angular.forEach(form.querySelectorAll('label'), function (label) {
                            labels[label.htmlFor] = label.textContent;
                        });
                        self.formsIndexados[form.name] = labels;
                    }
                    labels = self.formsIndexados[form.name];
                    return labels[id] || null;
                },
                tratarErrosMVC: function (erros) {
                    this.limpar();
                    if (angular.isArray(erros)) {
                        angular.forEach(erros, function (erro) {
                            this.erro(erro.Erros.map(function (e) {
                                return e.replace('[]', erro.Nome);
                            }).join('<br />'));
                        }, this);
                    }
                }
            };

            function notificacaoFactory(identificador) {
                if (!notificacoes.hasOwnProperty(identificador)) {
                    notificacoes[identificador] = new Notificacao(identificador);
                }
                return notificacoes[identificador];
            }

            return notificacaoFactory;
        }
]).directive('agtFormNotificacao', [
        'notificacaoFactory',
        function (notificacaoFactory) {
            return {
                templateUrl: '/Templates/AGT/Notificacao.html',
                scope: {},
                link: function (scope, elem, attrs) {
                    var idNotificacao = attrs.agtFormNotificacao;
                    scope.notificacao = notificacaoFactory(idNotificacao);
                }
            };
        }
]).directive('agtData', [
        'dateFilter', function (dateFilter) {
            return {
                restrict: 'E',
                require: 'ngModel',
                scope: {
                    format: '@',
                    minDate: '=?',
                    maxDate: '=?'
                },
                link: function (scope, elem, attrs, ngModel) {
                    scope.required = !!attrs.required;

                    scope.openPopup = function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        scope.isOpen = true;
                    };

                    ngModel.$render = function () {
                        if (!ngModel.$modelValue) {
                            scope.selectedDate = null;
                            return;
                        }
                        ngModel.$modelValue.toString = function () {
                            return dateFilter(this, attrs.format);
                        };
                        scope.selectedDate = ngModel.$modelValue;
                    };

                    scope.$watch('selectedDate', function (value) {
                        ngModel.$setViewValue(value);
                    });
                },
                template: '<div class="input-group"> \
            <input type="text" class="form-control" datepicker-popup="{{format}}" min-date="minDate" max-date="maxDate" ng-model="selectedDate" is-open="isOpen" ng-required="{{required}}" /> \
            <span class="input-group-btn"> \
              <button type="button" class="btn btn-default" ng-click="openPopup($event)"> \
                <i class="glyphicon glyphicon-calendar"></i> \
              </button> \
            </span> \
           </div>'
            };
        }
]).directive('agtDataMes', [
        function () {
            return {
                require: '?ngModel',
                replace: true,
                link: function (scope, elem, attrs, ngModel) {
                    var regex = /^((?!(1[3-9])|00))([0-1]\d)\/\d{4}$/;
                    ngModel.$validators.validator = function (modelValue) {
                        if (!ngModel.$viewValue && attrs.required) return false;
                        if (!ngModel.$viewValue) return true;
                        return ngModel.$viewValue.match(regex);
                    };
                    ngModel.$parsers.push(function (value) {
                        if (!value) return undefined;
                        if (!ngModel.$validators.validator(value)) return undefined;
                        return value.slice(-4) + value.slice(0, 2);
                    });
                },
                scope: {},
                template: '<input class="form-control" type="text" ui-mask="99/9999" />'
            };
        }
]).directive('agtDataHora', [
        function () {
            return {
                require: '?ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    var ano, mes, dia, hora, minuto, segundo;
                    ngModel.$render = function () {
                        var valor = ngModel.$viewValue || null;
                        if (valor == null) return;
                        scope.value = valor;
                    }
                    elem.removeClass('form-control');
                    scope.$watch('value', function () {
                        if (!angular.isString(scope.value) || scope.value.length !== 14) return;
                        dia = parseInt(scope.value.slice(0, 2));
                        mes = parseInt(scope.value.slice(2, 4)) - 1;
                        ano = parseInt(scope.value.slice(4, 8));
                        hora = parseInt(scope.value.slice(8, 10));
                        minuto = parseInt(scope.value.slice(10, 12));
                        segundo = parseInt(scope.value.slice(12, 14));
                        ngModel.$setViewValue(new Date(ano, mes, dia));
                    });
                    ngModel.$render = function () {
                        var valor = ngModel.$viewValue;
                        if (valor !== undefined && valor !== null) {
                            scope.value = $filter('date')(valor, 'dd/MM/yyyy hh:mm');
                        }
                    };
                },
                scope: {},
                template: '<input class="form-control" style="width:100%; height:100%" type="text" ui-mask="99/99/9999 99:99:99" ng-model="value" />'
            };
        }
]).run([
        '$rootScope', '$window', '$location',
        function ($rootScope, $window) {
            var tituloOriginal = $window.document.title;
            $rootScope.$on('$routeChangeSuccess', function (event, current) {
                if (!current || !current.$$route) return;
                $window.document.title = angular.isString(current.$$route.title)
                    ? $window.document.title.slice(0, $window.document.title.indexOf('-') + 1) + ' ' + current.$$route.title
                    : tituloOriginal;
            });
        }
]).directive('loginIdentificacao', [
        function () {
            return {
                require: 'ngModel',
                priority: 90,
                scope: {
                    // Array com os valores do combo e as mascaras.
                    // Exemplo: [{name:'CPF',mask:'999.999.999-99'}]
                    nameMask: '=',
                    required: '=?ngRequired',
                    disabled: '=?ngDisabled',
                    // Objeto que representa o item do nameMask selecionado
                    // Exemplo: {name:'CPF',mask:'999.999.999-99'}
                    selecao: '=?',
                    debug: '@?'
                },
                link: function (scope, element, attrs, ngModel) {
                    ngModel.$render = function () {
                        scope.identificacao = ngModel.$modelValue;
                    };

                    if (angular.isUndefined(scope.selecao)) {
                        scope.selecao = scope.nameMask[0];
                    }

                    scope.$watch(function () {
                        return scope.identificacao;
                    }, function (newValue) {
                        ngModel.$setViewValue(newValue);
                    });

                    if (attrs.autofocus && !scope.ngDisabled) {
                        element.find('input')[0].focus();
                    }
                },
                templateUrl: '/Templates/LoginIdentificacao.html'
            };
        }
]).directive('carregarUsuario', [
        'autenticar',
        function (autenticar) {
            return {
                restrict: 'A',
                scope: false,
                controller: function ($scope) {
                    autenticar.success(function (data) {
                        $scope.Usuario = data.Usuario;
                    });
                }
            };
        }
]).directive('carregando', [
        '$agnet',
        function ($agnet) {
            return {
                restrict: 'C',
                template: ' \
                    <div id="bloqueio-tela" class="bloqueio-tela" ng-show="isLoading()"></div> \
                    <div id="caixa-carregando" class="caixa-carregando" ng-show="isLoading()"> \
                        <div class="caixa-carregando-conteudo"> \
                            <img src="/Imagens/ajax-loader3.gif" /> \
                            <span> \
                                <h4 style="display: inline"> \
                                    <b>carregando</b> \
                                </h4> \
                            </span> \
                        </div> \
                    </div>',
                scope: {},
                link: function (scope) {
                    scope.isLoading = function () {
                        return $agnet.pendingRequests.filter(function (req) {
                            return req.url !== '/Acesso/Aud';
                        }).length > 0;
                    };
                }
            };
        }
]).directive('aud', [
        '$agnet',
        function ($agnet) {
            return {
                restrict: 'C',
                link: function (scope) {
                    scope.$on('$routeChangeSuccess', function (event, current) {
                        function executarAud() {
                            var obj = new Object();
                            for (var field in scope) {
                                if (['$', '_'].indexOf(field[0]) >= 0 || angular.isFunction(scope[field])) {
                                    continue;
                                }
                                obj[field] = angular.copy(scope[field]);
                            }
                            var view = JSON.stringify({
                                scope: obj,
                                templateUrl: current.loadedTemplateUrl,
                                location: window.location,
                                userAgent: window.navigator.userAgent
                            });
                            $agnet.mvcPost('/Acesso/Aud', {
                                View: view
                            });
                        }

                        function verificarPendencias() {
                            if ($agnet.pendingRequests.length !== 0) {
                                setTimeout(verificarPendencias, 300);
                                return;
                            }
                            executarAud();
                        }

                        setTimeout(verificarPendencias, 50);
                    });
                }
            };
        }
]).directive('captcha', [
        'captchaModel',
        function (captchaValue) {
            var i = 0;
            var executado = false;
            var aoCarregarScripts = function () {
                executado = true;
            };
            var scripts = ['/Captcha/jquery.hoverIntent.js', '/Captcha/soundmanager2-nodebug-jsmin.js', '/Captcha/Captcha.js'];

            function loadScript() {
                var script = scripts[i++];
                if (!angular.isString(script)) {
                    if (!executado) {
                        aoCarregarScripts();
                        executado = true;
                    }
                    return;
                }
                var tag = document.createElement('script');
                tag.src = script;
                tag.setAttribute('type', 'text/javascript');
                tag.onload = loadScript;
                document.body.appendChild(tag);
            }

            loadScript();
            return {
                templateUrl: '/Captcha/Captcha.html',
                scope: true,
                link: function (scope, elem) {
                    aoCarregarScripts = function () {
                        window.captchaAPI.gerarNovoCaptcha();
                    }
                    if (executado) {
                        aoCarregarScripts();
                    }
                    var input = elem.find('input');
                    input.on('change', function () {
                        captchaValue.txtCaptcha = input.val();
                    });
                }
            };
        }
]).directive('identificacaoContribuinte', [
        '$agnet',
        function ($agnet) {
            return {
                restrict: 'EC',
                require: '?ngModel',
                scope: {
                    identificacao: '=',
                    url: '@url'
                },
                templateUrl: '/Templates/AIDF/IdentificacaoContribuinte.html',
                link: function (scope, elem, attrs, ngModel) {
                    if (ngModel) {
                        ngModel.$render = function () {
                            scope.contribuinte = ngModel.$viewValue;
                        }
                        return;
                    }
                    scope.$watch('identificacao', function () {
                        if (angular.isObject(scope.identificacao)) {
                            scope.contribuinte = scope.identificacao;
                        } else if (scope.identificacao && scope.url) {
                            $agnet.mvcPost(scope.url, {
                                cfdf: scope.identificacao
                            }).success(function (data) {
                                scope.contribuinte = data;
                            });
                        }
                    });
                }
            };
        }
]).directive('qualificacaoContribuinte', [
        '$agnet',
        function ($agnet) {
            return {
                restrict: 'EC',
                scope: {
                    identificacao: '=',
                    url: '@url'
                },
                templateUrl: '/Templates/AIDF/QualificacaoContribuinte.html',
                link: function (scope) {
                    scope.$watch('identificacao', function () {
                        if (angular.isObject(scope.identificacao)) {
                            scope.qualificacao = scope.identificacao;
                        } else if (scope.url && scope.identificacao) {
                            $agnet.mvcPost(scope.url, {
                                cfdf: scope.identificacao
                            }).success(function (data) {
                                scope.qualificacao = data;
                            });
                        }
                    });
                }
            };
        }
]).directive('identificacaoGrafica', [
        '$agnet',
        function ($agnet) {
            return {
                restrict: 'EC',
                scope: {
                    identificacao: '=',
                    url: '@url'
                },
                templateUrl: '/Templates/AIDF/IdentificacaoGrafica.html',
                link: function (scope) {
                    scope.$watch('identificacao', function () {
                        if (angular.isObject(scope.identificacao)) {
                            scope.grafica = scope.identificacao;
                        } else if (scope.identificacao && scope.url) {
                            $agnet.mvcPost(scope.url, {
                                cfdf: scope.identificacao
                            }).success(function (data) {
                                scope.grafica = data;
                            });
                        }
                    });
                }
            };
        }
]).directive('identificacaoContador', [
        '$agnet',
        function ($agnet) {
            return {
                restrict: 'EC',
                scope: {
                    contribuinte: '=identificacao',
                    url: '@url'
                },
                templateUrl: '/Templates/AIDF/IdentificacaoContador.html',
                link: function (scope) {
                    scope.$watch('contribuinte', function () {
                        if (angular.isObject(scope.identificacao)) {
                            scope.contador = scope.identificacao;
                        } else if (scope.url && scope.identificacao) {
                            $agnet.mvcPost(scope.url, {
                                cfdf: scope.identificacao
                            }).success(function (data) {
                                scope.contador = data;
                            });
                        }
                    });
                }
            };
        }
]).directive('agtMoeda', [
        function () {
            function MascaraMoeda(elem, ngModel) {
                this.value = '';
                this.ngModel = ngModel;
                this.elem = elem;
                this.selecao = {
                    inicio: null,
                    fim: null
                };
            }

            MascaraMoeda.prototype = {
                formatar: function () {
                    var valorFormatado;
                    var vt = this.value;
                    while (vt.length < 3) {
                        vt = '0' + vt;
                    }
                    valorFormatado = ',' + vt.slice(-2);
                    for (var i = vt.length - 2; i--;) {
                        valorFormatado = vt[i] + valorFormatado;
                        if (((vt.length - 2) - i) % 3 === 0 && i > 0) {
                            valorFormatado = '.' + valorFormatado;
                        }
                    }
                    return 'R$ ' + valorFormatado;
                },
                setValue: function (valor, inicio, fim) {
                    if (inicio == undefined && fim == undefined) {
                        this.value = valor;
                    } else {
                        this.value = this.value.slice(0, inicio) + valor + this.value.slice(fim, 9e9);
                    }
                    this.ngModel.$setViewValue(this.value);
                    this.elem.val(this.formatar());
                },
                fazerSelecao: function () {
                    if (angular.isNumber(this.elem[0].selectionStart) && angular.isNumber(this.elem[0].selectionEnd)) {
                        var texto = this.elem.val();
                        var indiceInicioNumero = texto.search(/[1-9]/);
                        texto = texto.slice(indiceInicioNumero);
                        for (var i = 1, real = 1; i <= texto.length; i++) {
                            if (texto[i - 1].match(/\d/)) {
                                if ((this.elem[0].selectionStart - indiceInicioNumero) == i) {
                                    this.selecao.inicio = real;
                                }
                                if ((this.elem[0].selectionEnd - indiceInicioNumero) == i) {
                                    this.selecao.fim = real;
                                }
                                real++;
                            }
                        }
                    }
                }
            }
            return {
                priority: 1,
                require: '?ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    if (!ngModel) return;
                    var inputMoeda = new MascaraMoeda(elem, ngModel);
                    var atualizar = function () {
                        var valor = ngModel.$viewValue;
                        if (angular.isString(valor)) {
                            valor = valor.replace(/[\.\,\$\R\s]/g, '');
                            if (valor.match(/^\d+$/)) {
                                inputMoeda.setValue(valor);
                            }
                        }
                    }
                    ngModel.$render = (atualizar);
                    elem.on('keydown', function (e) {
                        e = e || window.event;
                        var key = e.which || e.charCode || e.keyCode;
                        if (key == undefined) return true;
                        if (!(key === 8 || key === 46 || key === 63272)) {
                            return true;
                        }
                        e.preventDefault();
                        inputMoeda.fazerSelecao();
                        var inicio = inputMoeda.selecao.inicio;
                        var fim = inputMoeda.selecao.fim;
                        if (inicio === fim) {
                            switch (key) {
                                case 8:
                                    inicio--;
                                    break;
                                default:
                                    fim++;
                                    break;
                            }
                        }
                        inputMoeda.setValue('', inicio, fim);
                        return false;
                    });
                    elem.on('keypress', function (e) {
                        e.preventDefault();
                        e = e || window.event;
                        var key = e.which || e.charCode || e.keyCode;
                        if (key == undefined) return false;
                        if (key < 48 || key > 57) { // Se for qualquer coisa se não número ignorar.
                            return false;
                        }
                        inputMoeda.fazerSelecao();
                        inputMoeda.setValue(String.fromCharCode(key), inputMoeda.selecao.inicio, inputMoeda.selecao.fim);
                        return false;
                    });
                }
            }
        }
])
    .provider('URLBuilder', [
        function () {
            function encodeUriQuery(val, pctEncodeSpaces) {
                return encodeURIComponent(val).
                    replace(/%40/gi, '@').
                    replace(/%3A/gi, ':').
                    replace(/%24/g, '$').
                    replace(/%2C/gi, ',').
                    replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
            }

            /**
             * Angular's private buildUrl function, patched to refer to the public methods on the angular globals
             */
            function buildUrl(url, params) {
                if (!params) return url;
                var parts = [];
                angular.forEach(params, function (value, key) {
                    if (value === null || angular.isUndefined(value)) return;
                    if (!angular.isArray(value)) value = [value];

                    angular.forEach(value, function (v) {
                        if (angular.isDate(v)) {
                            v = moment(v).toISOString();
                        } else if (angular.isObject(v)) {
                            v = angular.toJson(v);
                        }
                        parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(v));
                    });
                });
                return url + ((url.indexOf('?') === -1) ? '?' : '&') + parts.join('&');
            }

            this.$get = function () {
                return {
                    build: function (url, params) {
                        return buildUrl(url, params);
                    }
                };
            };
        }
    ])
    .directive('agtMenu', [
        '$agnet', function ($agnet) {
            var temServico = function (item) {
                return !!item.SubItens && item.SubItens.find(function (val) {
                    return val.Servico != null;
                });
            }

            return {
                restrict: 'C',
                scope: true,
                link: function (scope) {
                    $agnet.mvcPost('/AGT/Menu').then(function (response) {
                        scope.menu = response.data;
                    });

                    scope.aberto = function (item) {
                        return !temServico(item) && item.aberto;
                    }

                    scope.isActive = function (item) {
                        if (!item || !scope.active) return {};
                        return { active: item.SeqMenu === scope.active.SeqMenu };
                    }

                    scope.click = function (item) {
                        item.aberto = !item.aberto;
                        scope.servicos = null;

                        scope.active = item;

                        if (temServico(item)) {
                            scope.servicos = item.SubItens;
                        }
                    }
                }
            };
        }
    ]).directive('uppercase', [
        function () {
            return {
                restrict: 'C',
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    ngModel.$parsers.push(function (input) {
                        if (angular.isString(input)) {
                            return input.toUpperCase();
                        }
                        return undefined;
                    });
                    elem.css('text-transform', 'uppercase');
                }
            }
        }
    ]).directive('lettersOnly', [
        function () {
            return {
                restrict: 'C',
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    ngModel.$parsers.push(function (input) {
                        if (!/^[a-z]+$/i.test(input)) {
                            ngModel.$setViewValue(null);
                            ngModel.$render();
                            return undefined;
                        }
                        return input;
                    });
                }
            }
        }
    ]).directive('numbersOnly', [
        function () {
            return {
                restrict: 'C',
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    ngModel.$parsers.push(function (input) {
                        if (!/^[0-9]+$/i.test(input)) {
                            ngModel.$setViewValue(null);
                            ngModel.$render();
                            return undefined;
                        }
                        return input;
                    });
                }
            }
        }
    ]).directive('agtDataCampo', [
        '$filter', function ($filter) {
            return {
                restrict: 'C',
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    elem.mask('99/99/9999');
                    ngModel.$formatters.push(function (modelValue) {
                        if (angular.isDate(modelValue)) return $filter('date')(modelValue, 'dd/MM/yyyy');
                        return null;
                    });
                    ngModel.$parsers.push(function (input) {
                        var data = moment(input, 'DD/MM/YYYY');
                        if (input && !data.isValid()) {
                            ngModel.$setValidity('date', false);
                            return undefined;
                        }
                        ngModel.$setValidity('date', true);
                        return data.toDate();
                    });
                }
            }
        }
    ])
    .directive('limparSessao', [
        '$sessionStorage', function (sessionStorage) {
            return {
                restrict: 'A',
                link: function (scope, element) {
                    element.on('click', function () {
                        sessionStorage.$reset();
                    });
                }
            };
        }
    ])
    .filter('characters', function () {
        return function (input, chars, breakOnWord) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length > chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    //get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                } else {
                    while (input.charAt(input.length - 1) === ' ') {
                        input = input.substr(0, input.length - 1);
                    }
                }
                return input + '…';
            }
            return input;
        };
    })
    .filter('splitcharacters', function () {
        return function (input, chars) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length > chars) {
                var prefix = input.substring(0, chars / 2);
                var postfix = input.substring(input.length - chars / 2, input.length);
                return prefix + '…' + postfix;
            }
            return input;
        };
    })
    .filter('words', function () {
        return function (input, words) {
            if (isNaN(words)) return input;
            if (words <= 0) return '';
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '…';
                }
            }
            return input;
        };
    });