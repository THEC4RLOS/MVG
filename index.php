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
        <link rel="stylesheet" type="text/css" href="./resources/bootstrap/css/bootstrap.min.css">
        <script src="./resources/angular/angular.js"></script>
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
                        <li class="active" style=""><a href="#"> <font color="#E7E7E7">|</font></a></li>
                        <li title="Acceso a Base de Batos">
                            <a ng-click="hola()">
                                <img style=" width: 18px; height: 18px" src="./img/db.png" />
                            </a>
                        </li>
                    </ul>

                    <ul class="nav navbar-nav navbar-right">
                        <li><a title="Fullscreen" class="glyphicon glyphicon-fullscreen" href="#"></a></li>                        
                    </ul>
                </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>
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
    </body>
</html>
