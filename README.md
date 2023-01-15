# ADMIN-REACT-LAYOUT

## CONFIGURATION

* Change images from:
- assets/img/brand/logo.png (logo for HomePage)
- public/favicon.ico (logo for page)
- public/apple-icon.png

* Change configuration:
- src/config.js
    projectName ==> your project name
- api/routes.js
    const PROJECT = route to api project
    const LOCAL_PORT = port for develop project
    const API_PRODUCTION_ADDRESS = address to your api server

    Add all projects routes like that:
    const route = host + "/route"
    const routeDir = {
        route,
        sub: {
            dashboard: routes + "/dashboard"
        }
    const API_ROUTES = {
        routeDir
    }
}