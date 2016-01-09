<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <title>MVG</title>
        <!--script data-require="jquery@1.9.0" data-semver="1.9.0" src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.js"></script>
        <link data-require="bootstrap@3.0.0" data-semver="3.0.0" rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" />
        <script data-require="bootstrap@3.0.0" data-semver="3.0.0" src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
        <script data-require="angular.js@1.2.14" data-semver="1.2.14" src="http://code.angularjs.org/1.2.14/angular.js"></script-->
        <script src="./resources/jquery/jquery.js"></script>
        <link rel="stylesheet" type="text/css" href="./resources/bootstrap/css/bootstrap.min.css">
        <script src="./resources/bootstrap/js/bootstrap.min.js"></script>
        <script src="./resources/angular/angular.js"></script>
        <script src="./resources/angular/angular-fullscreen.js"></script>
        <script src="./js/app.js"></script>
    </head>
    <body ng-app="app" ng-controller="controller">
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">

                    <a class="navbar-brand" href="#">Multi Visor Geografico</a>
                </div>

                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li class="active" style=""><a> <font color="#E7E7E7">|</font></a></li>
                        <li title="Acceso a Base de Batos">
                            <a role="button" href="#{{modal1}}" data-toggle="modal">
                                <img style=" width: 18px; height: 18px" src="./img/db.png" />
                            </a>
                        </li>
                    </ul>

                    <ul class="nav navbar-nav navbar-right">
                        <li><a ng-click="goFullscreen()" title="Fullscreen" class="glyphicon glyphicon-fullscreen" href="#"></a></li>                        
                    </ul>
                </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>
<modal lolo="modal1" modal-body="body" modal-footer="footer" modal-header="header" data-ng-click-right-button="myRightButton()"></modal>
    <!--div style="width: 100%; height: 100%">  background-image: url(img/db.png)
    <li class="active" style=""><a href="#"> <font color="#E7E7E7">|</font> <span class="sr-only">(current)</span></a></li>
        <div id="nav-bar"  class="navbar container" style="width: 12%; height: 100%; background: #1b6d85; ">
            <button type="button" class="btn-lg">open</button>
            <button type="button" class="btn-lg">open</button>

        </div>
        <div id="map-container" class="navbar navbar-right container" style="width: 88.9%; height: 100%; background: #255625;">
    <button>open</button>
        </div>
    </div-->
    <div Fullscreen></div >
</body>
</html>
