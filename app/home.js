/**
 * Created by pablo on 16.03.16.
 */
angular.module('testHapi')
    .controller('HomeCtrl', ['$scope', '$location', '$http', 'AuthService', function ($scope, $location, $http, AuthService) {


        var client = new nes.Client('ws://localhost:3041');
        client.connect(function (err) {
            console.log('connected');

            client.request('messages', function (err, payload) {   // Can also request '/api/nes/comments'
                if(err) console.log('error',err);
                else console.log('request',payload);
                // payload -> 'world!'
            });
        });
        console.log(nes);
        $scope.title = 'Home';
        $scope.mode = 'list';
        $scope.comment = {message: ''};
        $scope.username = function () {
            return AuthService.user() ? AuthService.user().displayname : '';
        };
        $scope.showEditButton = (owner)=> {
            return AuthService.isAuthenticated() && owner == AuthService.user().userid;
        };
        console.log('$scope.username', $scope.username());
        $scope.AuthService = AuthService;
        $scope.test = ()=> {
            console.log('stored user', $scope.AuthService.user(), $scope.AuthService.isAuthenticated(), $scope.username());
            //$scope.$apply();
        };
        $scope.edit = (id, text,owner)=> {
            $scope.mode = 'edit';
            $scope.isNew = text == '';
            console.log(id, $scope.isNew);

            if ($scope.isNew) {
                $scope.comment.parent = id;
                $scope.comment.message = '';
            }
            else {
                $scope.comment.message = text;
                $scope.comment.commentid = id;
                $scope.comment.owner = owner;
                if ($scope.comment.parent) delete $scope.comment.parent;
            }
        };
        $scope.save = ()=> {
            if ($scope.isNew) {
                $scope.message = $scope.comment.message;
                $scope.addMsg($scope.comment.parent);
            }
            else {
                console.log('$scope.save', $scope.comment.message);
                $http.put('/api/message', $scope.comment)
                    .error(function (err) {
                        console.log('error ', err)
                    })
                    .then(function (result) {
                        console.log(result.data);
                        $scope.getMessages();
                        $scope.comment.message = '';
                        $scope.mode = 'list';
                        //$scope.$apply();
                    });
            }

            $scope.mode = 'list';
            //$scope.comment.message = '';
        };

        $scope.cancel = ()=> {
            $scope.mode = 'list';
            console.log($scope.mode);
            $scope.message = '';
        };
        $scope.logout = ()=> {
            console.log('Logout');
            $http.get('/auth/logout')
                .error(function (err) {
                    console.log('error ', err)
                })
                .then(function (result) {
                    console.log(result.data);
                    $scope.AuthService.removeUser();
                    //alert(result.data);

                });

        };

        $scope.message = '';
        $scope.messages = [];
        $scope.addMsg = (parent)=> {
            var comment = {
                owner: $scope.AuthService.user().userid,
                message: $scope.comment.message,
                parent: parent ? parent : null
            };
            console.log('$scope.addMsg', comment);
            $http.post('/api/message', comment)
                .error(function (err) {
                    console.log('error ', err)
                })
                .then(function (result) {
                    console.log(result.data);
                    $scope.getMessages();
                    $scope.comment.message = '';
                    $scope.message = '';
                    $scope.mode = 'list';

                    //$scope.$apply();
                });

        };
        $scope.remove = (id)=> {
            console.log('remove', id);
            $http.delete('/api/message/' + id)
                .error(function (err) {
                    console.log('error ', err)
                })
                .then(function (result) {

                    if (result.data.error) {
                        console.log(result.data.error);
                    }
                    else {
                        $scope.getMessages();
                    }

                });


        };
        $scope.getMessages = ()=> {
            $http.get('/api/messages')
                .error(function (err) {
                    console.log('error ', err)
                })
                .then(function (result) {

                    if (result.data.error) {
                        console.log(result.data.error);
                    }
                    else {
                        console.log(result.data.data);
                        //$scope.messages = toTree(result.data.data);
                        $scope.messages = result.data.data;
                    }

                });

        };
        $scope.getMessages();
        function toTree(plain) {
            var tree = [];
            plain.forEach(function (item) {
                if (!item.parent) tree.push(item);
            });
            tree.forEach(function (item) {
                item.childs = plain.filter(function (c1) {
                    if (c1.parent == item.commentid) return c1;
                });
                item.childs.forEach(function (ch2) {
                    ch2.childs = plain.filter(function (c2) {
                        if (c2.parent == ch2.commentid) return c2;
                    });
                    ch2.childs.forEach(function (ch3) {
                        ch3.childs = plain.filter(function (c3) {
                            if (c3.parent == ch3.commentid) return c3;
                        });
                    });
                });
            });
            return tree;
        }

    }]);
