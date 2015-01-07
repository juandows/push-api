PUSH-API
========
API para el control del servidor de push Uniqush

Configuración
-------------
La configuración está en **config/config.js**

* puerto: Puerto de escucha de la API
* CROSS-Site request: Hosts permitidos desde los que hacer peticiones "cruzadas"
* Uniqush: Configurar host y puerto del uniqush

Errores
-------
* event - connect ECONNREFUSED: Este error puede ser por una mala conexión con UniqushPush, comprobar el host y puerto en el fichero de configuración (config.js)

Deploy
--------
Hay que configurar el **host** a donde se hace el deploy (tanto en development.rb como en production.rb)

Deploy a **desarrollo** (por defecto rama dev-master)
```cap deploy```

Deploy a **producción** (por defecto rama master)
```cap production deploy```

Para seleccionar una rama concreta de la que hacer deploy
```cap deploy -s branch=rama```

El fichero de configuración hay que crearlo manualmente porque está compartido entre las distintas *releases*, crearlo en *shared/files/config/config.js* y modificarlo según el entorno (desarrollo/producción).

Llamadas
--------
* Añadir service provider
    * method: **POST**
	* url: **/add**
	* parameters: 
        * os: "ANDROID" o "IOS"
        * service: Nombre del servicio
        * projectid (**Android**): Identificador de proyecto (Google developer console)
        * apikey (**Android**): API Key (Google developer console)
        * cert (**iOS**): Ruta a certificado .pem
        * key (**iOS**): Ruta a key .pem

* Eliminar service provider
    * method: **POST**
    * url: **/remove**
	* parameters: 
        * os: "ANDROID" o "IOS"
        * service: Nombre del servicio
        * projectid (**Android**): Identificador de proyecto (Google developer console)
        * apikey (**Android**): API Key (Google developer console)
        * cert (**iOS**): Ruta a certificado .pem
        * key (**iOS**): Ruta a key .pem

* Suscribirse a un servicio de push
    * method: **POST**
    * url: **/subscribe**
    * parameters: 
        * os: "ANDROID" o "IOS"
        * service: Nombre del servicio
        * user: Usuario
        * regID: RegisterID (Android) o Devtoken (iOS)
        * device: iPad, iOs, Android... (**optional**)

* Cancelar suscripción a un servicio de push
    * method: **POST**
    * url: **/unsubscribe**
    * parameters: 
        * os: "ANDROID" o "IOS"
        * service: Nombre del servicio
        * user: Usuario
        * regID: RegisterID (Android) o Devtoken (iOS)
        * device: iPad, iOs, Android... (**optional**)

* Envío de push
    * method: **POST**
    * url: **/push**
    * parameters: 
        * service: Nombre del servicio
        * user: Usuario
        * msg: Mensaje
        * ttl: Tiempo de vida. Cuanto tiempo (en segundos) el mensaje debe (**optional**)
        * badge:  (**optional**)
        * img:  (**optional**)
        * sound:  (**optional**)
        * loc_key:  (**optional**)
        * loc_args:  (**optional**)
        * action_loc_key:  (**optional**)
        * Parametros reservados: todos los que empiecen por **uniqush**
        * Otros parámetros: Se pueden enviar parámetros opcionales