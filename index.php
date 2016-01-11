<!DOCTYPE html>
<!--
    Homero: Multi Visor Geografico
-->
<html>
    <head> <!-- head -->
        <meta charset="UTF-8">
        <title>Homero</title>
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
    </head> <!-- /.head -->
    <body ng-app="app" ng-controller="controller">
        
        <div Fullscreen></div>
        
        <div> <!-- Nav Bar -->
            <nav class="navbar navbar-default">
                <div class="container-fluid">
                    <!-- Brand and toggle get grouped for better mobile display -->
                    <div class="navbar-header">
                        <a title="Homero" class="navbar-brand" href="#Homero">
                            <img style=" width: 18px; height: 18px" src="./img/donut.png">
                        </a>
                        <a title="El mejor Visor Geografico!" class="navbar-brand">Multi Visor Geografico</a>
                    </div>

                    <!-- Collect the nav links, forms, and other content for toggling -->
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul class="nav navbar-nav">
                            <li class="active" style=""><a><font color="#E7E7E7">|</font></a></li>
                            <li title="Acceso a Base de Batos">
                                <a role="button" href="#{{modal1}}" data-toggle="modal" data-target="{{handler}}">
                                    <img style=" width: 18px; height: 18px" src="./img/db.png" />
                                </a>
                            </li>
                            <li title="Capas">
                                <a role="button" data-toggle="modal" data-target=".popLayerModal">
                                    <img style=" width: 18px; height: 18px" src="./img/layer.png" />
                                </a>
                            </li>
                        </ul>

                        <ul class="nav navbar-nav navbar-right">
                            <li><a ng-click="goFullscreen()" title="Fullscreen" class="glyphicon glyphicon-fullscreen" href="#"></a></li>
                        </ul>
                    </div><!-- /.navbar-collapse -->
                </div><!-- /.container-fluid -->
            </nav>
        </div> <!-- /.Nav Bar -->
        <div class="pull-left" style="width: 15.5%; height: 110px; background-color: white"></div>
        <div class="pull-right" style="width: 84.5%; height: 110px; background-color: white">
        <ul class="nav nav-tabs">
            <li role="presentation" class="active"><a href="#">CANVAS</a></li>
            <li role="presentation"><a href="#">IMG</a></li>
            <li role="presentation"><a href="#">SVG</a></li>            
        </ul>
        </div>
        <modal lolo="modal1" modal-body="body" modal-footer="footer" modal-header="header" data-ng-click-right-button="myRightButton()" host="host" port="port" db="db" user="user" pass="pass"> <!-- Modal Configuracion de la Base de Datos -->
        </modal><!-- /.Modal Configuracion de la Base de Datos -->

        <div  class="modal fade popLayerModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"> <!-- Modal Ver Capas -->
            <div class="modal-dialog modal-lg" >
                <div class="modal-content" style="overflow-y: auto;height: 90%" >
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <center><h4 class="modal-title">Capas Disponibles</h4></center>
                    </div>
                    <div class="modal-body">
                        <table class="table table-striped table-header-rotated scroll" >
                            <thead>
                                <tr>
                                    <th style="width: 15% !important;"><center>Ver</center></th>
                                    <th style="width: 20% !important;"><center>Tabla</center></th>
                                    <th style="width: 20% !important; "><center>SRID</center></th>
                                    <th style="width: 25% !important; "><center>Tipo</center></th>
                                </tr>                        
                            </thead>
                            <tbody >
                                <tr ng-repeat="capa in layers">
                                    <td style="width: 15% !important;">
                                        <span class="input-group-addon">
                                            <input type="checkbox" aria-label="" ng-model="capa.estado">
                                        </span>
                                    </td>
                                    <td style="width: 20% !important;"><center>{{capa.nombre}}</center></td>
                                    <td style="width: 20% !important;"><center>{{capa.srid}}</center></td>
                                    <td style="width: 25% !important;"><center>{{capa.tipo}}</center></td>
                                </tr>                        
                                <!--td><input type="text" id=" otro['id']}"  ui-Blur="miFun({{ otro['id']}},{{ otro['cedula']}},{{ otro['evaluacion']}});" value="{{ otro['nota']}}"  style="width:30px; height: 20px; "></input></td-->
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" ng-click="printGeometryColumns()">Visualizar</button>
                    </div>
                </div>
            </div>
        </div> <!-- /.Modal Ver Capas -->

    </body>
</html>