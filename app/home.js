/**
 * Created by pablo on 16.03.16.
 */
angular.module('testHapi')
    .controller('HomeCtrl',['$scope','$location','$http','AuthService', function ($scope, $location, $http,AuthService) {

        $scope.title='Home';
        $scope.mode = 'list';
        $scope.comment = {message:''};
        $scope.username = function(){
            return AuthService.user() ? AuthService.user().displayname : '';
        };
        $scope.showEditButton=(owner)=>{
            return AuthService.isAuthenticated() && owner == AuthService.user().userid;
        };
        console.log('$scope.username',$scope.username());
        $scope.AuthService = AuthService;
        $scope.test=()=>{
            console.log('stored user',$scope.AuthService.user(), $scope.AuthService.isAuthenticated(), $scope.username());
            //$scope.$apply();
        };
        $scope.edit=(id,text)=>{
            $scope.mode = 'edit';
            $scope.isNew = text == '';
            console.log(id,$scope.isNew);

            if($scope.isNew) {
                $scope.comment.parent = id;
                $scope.comment.message = '';
            }
            else{
                $scope.comment.message = text;
                $scope.comment.commentid = id;
                if($scope.comment.parent) delete $scope.comment.parent;
            }
        };
        $scope.save=()=>{
            if($scope.isNew){
                $scope.message = $scope.comment.message;
                $scope.addMsg($scope.comment.parent);
            }
            else{
                console.log('$scope.save',$scope.comment.message);
                $http.put('/api/message', $scope.comment)
                    .error(function(err){console.log('error ',err)})
                    .then(function(result) {
                        console.log(result.data);
                        $scope.getMessages();
                        $scope.mode = 'list';
                        //$scope.$apply();
                    });
            }

            $scope.mode = 'list';
            //$scope.comment.message = '';
        };

        $scope.cancel=()=>{
            $scope.mode = 'list';
            console.log($scope.mode);
            $scope.message = '';
        };
        $scope.logout=()=>{
            console.log('Logout');
            $http.get('/auth/logout')
                .error(function(err){console.log('error ',err)})
                .then(function(result) {
                    console.log(result.data);
                    $scope.AuthService.removeUser();
                    //alert(result.data);

                });

        };

        $scope.message='';
        $scope.messages = [];
        $scope.addMsg = (parent)=>{
            var comment={
                owner: $scope.AuthService.user().userid,
                message: $scope.message,
                parent: parent ? parent : null
            };
            console.log('$scope.addMsg',comment);
            $http.post('/api/message', comment)
                .error(function(err){console.log('error ',err)})
                .then(function(result) {
                    console.log(result.data);
                    $scope.getMessages();
                    $scope.mode = 'list';
                    //$scope.$apply();
                });

        };
        $scope.getMessages = ()=>{
            $http.get('/api/messages')
                .error(function(err){console.log('error ',err)})
                .then(function(result) {

                    if(result.data.error){
                        console.log(result.data.error);
                    }
                    else{
                        console.log(result.data.data);
                        $scope.messages = result.data.data;
                    }

                });

        };
        $scope.getMessages();

    }]);
