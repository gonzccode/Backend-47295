const authMdw = (request, response, next) => {
    console.log("REVISANDO LA SESION**", request.session);
    if (request.session?.user) {
        return next();
    }

    return response.redirect("/login");
    };

module.exports = authMdw;