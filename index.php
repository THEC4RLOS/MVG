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
        
        <div class="pull-left" style="width: 15.4%; height: 100%; background-color: #d5d5d5"> <!-- Controles y herramientas -->
            <div style="padding: 1%;">
                <table>
                    <tr ng-repeat="capa in layers|orderBy:'prioridad':true">
                        <td ng-show="capa.llamada">
                            <h1 class="label label-default"  >{{capa.nombre}}</h1>
                        </td>
                        <td style="padding-left: 10px; padding-bottom: 50px" ng-show="capa.llamada">

                            <a href="#" class="btn-sm btn-default  glyphicon glyphicon-arrow-up" ng-click="bajar(capa)"></a>                        
                            <a class="btn btn-default btn-sm" ng-click="aumentarTransparencia(capa, 0)">tr-</a>                            
                            <a class="btn btn-default btn-sm" ng-click="aumentarTransparencia(capa, 1)">tr+</a>
                            <a href="#" class="btn-sm btn-default  glyphicon glyphicon-arrow-down" ng-click="subir(capa)"></a>                        
                            <a href="#" class="btn-sm btn-default glyphicon glyphicon-screenshot" ng-click="enfocar(capa)"></a>
                            <a href="#" class="btn-sm btn-default " ng-class="capa.estado ? 'glyphicon glyphicon-eye-open' : 'glyphicon glyphicon-eye-close'"
                               ng-click="controlarVisualizacion(capa)"></a>                        
                        </td>
                    </tr>
                </table>
                <hr class="divider">
                <center>
                    
                    <table style="margin: 1%">
                        <tr>
                            <td></td>
                            <td><a class="btn btn-default btn-sm  glyphicon glyphicon-chevron-up" ng-click="mov(1)"></a></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><a class="btn btn-default btn-sm  glyphicon glyphicon-chevron-left" ng-click="mov(4)"></a></td>
                            <td></td>
                            <td><a class="btn btn-default btn-sm  glyphicon glyphicon-chevron-right" ng-click="mov(3)"></a></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><a class="btn btn-default btn-sm  glyphicon glyphicon-chevron-down" ng-click="mov(0)"></a></td>
                            <td></td>
                        </tr>
                    </table>                
                    <h1 class="label label-primary"> Zoom </h1>

                    <div style="margin: 2%" class="btn-group">                
                        <a class="btn btn-default btn-sm" ng-click="zoomIn(1)">+</a>
                        <a class="btn btn-default btn-sm" ng-click="zoomIn(0)">-</a>
                    
                        <a class="btn btn-default btn-sm glyphicon" ng-click="zoomIn(2)">Reset</a>                
                    
                    </div>
                    <div>
                        <h1 class="label label-primary">Dimension</h1>
                        <select ng-change="update()"style="margin: 2%" ng-model="selected" ng-options="opt as opt for opt in dim" ng-init="selected = '300x300'"></select>
                        <!--h3>You have selected : {{selected}}</h3-->
                    </div>

                </center>
            </div>
        </div>  <!-- /.Controles y herramientas -->
        
        <div class="pull-right" style="width: 84.5%; height: 110px; background-color: white"> <!-- visualizacion de las capas -->
            
            <div id="exTab2" class="">	
                <ul class="nav nav-tabs">
                    <li class="active" title="Visualizacion en etiqueta CANVAS">
                        <a  href="#1" data-toggle="tab">CANVAS</a>
                    </li>
                    <li title="Visualizacion en etiqueta IMG">
                        <a href="#2" data-toggle="tab">IMG</a>
                    </li>
                    <li title="Visualizacion en etiqueta SVG">
                        <a href="#3" data-toggle="tab">SVG</a>
                    </li>
                </ul>

                <div class="tab-content">
                    <div class="tab-pane active" id="1" style="background-color: #eee;height:{{sizeY}}px; width:{{sizeX}}px; position: relative;">
                        <div ng-repeat="capa in layers">
                            <div style="position: absolute" ng-show="capa.estado">
                                <table>
                                    <tr>
                                        <td>
                                            <canvas id="{{capa.nombre}}" width="{{sizeX}}" height="{{sizeY}}" style="border:1px solid #a1a1a1;opacity: 1    ;"></canvas>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane" id="2" style="background-color: #eee;height:{{sizeY}}px; width:{{sizeX}}px; position: relative;">
                        
                        <div ng-repeat="capa in layers">
                            <div style="position: absolute" ng-show="capa.estado">
                                <table>                       
                                    <img  ng-href="{{capa.url}}" style="opacity: {{capa.opacidad}}"  src="{{capa.url}}" width="{{sizeX}}" height="{{sizeY}}"/>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane" id="3">
                        <h3>Div svg</h3>
                    </div>
                </div>
            </div>
        </div>
        
        <modal lolo="modal1" modal-body="body" modal-footer="footer" modal-header="header" data-ng-click-right-button="myRightButton()" host="host" port="port" db="db" user="user" pass="pass" schema="schema"> <!-- Modal Configuracion de la Base de Datos -->
        </modal><!-- /.Modal Configuracion de la Base de Datos -->
        <!-- data-backdrop="static" -->
        
        <div data-keyboard="false" class="modal fade popLayerModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"> <!-- Modal Ver Capas -->
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
                                    <th style="width: 20% !important;"><center>Esquema</center></th>
                                    <th style="width: 20% !important;"><center>Tabla</center></th>
                                    <th style="width: 15% !important; "><center>SRID</center></th>
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
                                    <td style="width: 20% !important;"><center>{{capa.esquema}}</center></td>
                                    <td style="width: 20% !important;"><center>{{capa.nombre}}</center></td>
                                    <td style="width: 15% !important;"><center>{{capa.srid}}</center></td>
                                    <td style="width: 25% !important;"><center>{{capa.tipo}}</center></td>
                                </tr>                        
                                <!--td><input type="text" id=" otro['id']}"  ui-Blur="miFun({{ otro['id']}},{{ otro['cedula']}},{{ otro['evaluacion']}});" value="{{ otro['nota']}}"  style="width:30px; height: 20px; "></input></td-->
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="printGeometryColumns()">Cerrar</button>
                        <button type="button" class="btn btn-primary" ng-click="printGeometryColumns()">Visualizar</button>
                    </div>
                </div>
            </div>
        </div> <!-- /.Modal Ver Capas -->             

    </body>
</html>
