var Anumargak = require("./../src/letsRoute");

describe("Anumargak ", function() {
    it("should find static url", function() {
        var anumargak = Anumargak();

        anumargak.on("GET", "/this/is/static", () => 30);
        anumargak.on("HEAD", "/this/is/static", () => 30);

        /* expect(anumargak.staticRoutes.GET["/this/is/static"]()).toEqual(30);
        expect(anumargak.staticRoutes.HEAD["/this/is/static"]()).toEqual(30); */

        expect(anumargak.find("GET","/this/is/static")()).toEqual(30);
        expect(anumargak.find("HEAD","/this/is/static")()).toEqual(30);
    });

    it("should lookup static url", function(done) {
        var anumargak = Anumargak();

        anumargak.on("GET", "/this/is/static", (req,res) => {
            done();
        });

        anumargak.lookup({
            method: "GET",
            url: "/this/is/static"}
        );
    });

    it("should set dynamic url", function() {
        var anumargak = Anumargak();

        anumargak.on("GET", "/this/is/:dynamic", () => 30);
        anumargak.on("HEAD", "/this/is/:dynamic", () => 30);

        /* expect(anumargak.dynamicRoutes.GET["/this/is/([^\\/]+)"]()).toEqual(30);
        expect(anumargak.dynamicRoutes.HEAD["/this/is/([^\\/]+)"]()).toEqual(30); */

        expect(anumargak.find("GET","/this/is/dynamic")()).toEqual(30);
        expect(anumargak.find("HEAD","/this/is/dynamic")()).toEqual(30);
    });

    it("should set multiple urls under the same route ", function() {
        var anumargak = Anumargak();

        anumargak.on("HEAD", "/this/is/:dynamic", () => 30)
        anumargak.on("HEAD", "/this/is/:dynamic/2", () => 50)
        
        /* expect(anumargak.dynamicRoutes.HEAD["/this/is/([^\\/]+)"]()).toEqual(30);
        expect(anumargak.dynamicRoutes.HEAD["/this/is/([^\\/]+)/2"]()).toEqual(50); */

        expect(anumargak.find("HEAD","/this/is/dynamic")()).toEqual(30);
        expect(anumargak.find("HEAD","/this/is/dynamic/2")()).toEqual(50);
    });

    it("should overwrite  same route ", function() {
        var anumargak = Anumargak();

        anumargak.on("HEAD", "/this/is/:dynamic", () => 30)
        anumargak.on("HEAD", "/this/is/:dynamic", () => 50)

        /* expect(anumargak.dynamicRoutes.HEAD["/this/is/([^\\/]+)"]()).toEqual(50); */

        expect(anumargak.find("HEAD","/this/is/dynamic")()).toEqual(50);
    });

    it("should set dynamic url with two parameters", function() {
        var anumargak = Anumargak();

        anumargak.on("GET", "/this/is/:dynamic/with/:pattern(\\d+)", () => 30);

        /* expect(anumargak.dynamicRoutes.GET["/this/is/([^\\/]+)/with/(\\d+)"]()).toEqual(30); */

        expect(anumargak.find("GET","/this/is/dynamic/with/123")()).toEqual(30);
    });

    //TODO: change the regex to identify consecutive params
    it("should set dynamic url with two consecutive parameters", function() {
        var anumargak = Anumargak();

        anumargak.on("GET", "/this/is/:dynamic/with/:two-:params", () => 30)

        /* expect(anumargak.dynamicRoutes.GET["/this/is/([^\\/]+)/with/([^\\/]+)([^\\/]+)"]()).toEqual(30); */

        expect(anumargak.find("GET","/this/is/dynamic/with/twoparams")()).toEqual(30);
    });

    it("should set dynamic url with two consecutive parameters with pattern", function() {
        var anumargak = Anumargak();

        anumargak.on("GET", "/this/is/:dynamic/with/:two(\\d+):params", () => 30);

        /* expect(anumargak.dynamicRoutes.GET["/this/is/([^\\/]+)/with/(\\d+)([^\\/]+)"]()).toEqual(30); */

        expect(anumargak.find("GET","/this/is/dynamic/with/123pattern")()).toEqual(30);
    });

    it("should set dynamic url with parameter with val", function() {
        var anumargak = Anumargak();

        anumargak.on("GET", "/this/is/:dynamic/with/:two(\\d+)rest", () => 30);
        anumargak.on("GET", "/example/at/:hour(\\d{2})h:minute(\\d{2})m", () => 50)

        /* expect(anumargak.dynamicRoutes.GET["/this/is/([^\\/]+)/with/(\\d+)rest"]()).toEqual(30);
        expect(anumargak.dynamicRoutes.GET["/example/at/(^\\d{2})h(^\\d{2})m"]()).toEqual(50); */

        expect(anumargak.find("GET","/this/is/dynamic/with/123rest")()).toEqual(30);
        expect(anumargak.find("GET","/example/at/32h48m")()).toEqual(50);
    });

    it("should set dynamic url with parameter with val", function() {
        var anumargak = Anumargak();

        anumargak.on("GET", "/this/is/:dynamic/with/:two(\\d+)rest", () => 30);
        anumargak.on("GET", "/example/at/:hour(\\d{2})h:minute(\\d{2})m", () => 50)

        /* expect(anumargak.dynamicRoutes.GET["/this/is/([^\\/]+)/with/(\\d+)rest"]()).toEqual(30);
        expect(anumargak.dynamicRoutes.GET["/example/at/(^\\d{2})h(^\\d{2})m"]()).toEqual(50); */

        expect(anumargak.find("GET","/this/is/dynamic/with/123rest")()).toEqual(30);
        expect(anumargak.find("GET","/example/at/32h48m")()).toEqual(50);
    });

    it("should lookup for correct function", function(done) {
        var anumargak = Anumargak();

        anumargak.on("GET", "/this/is/:dynamic/with/:two(\\d+)rest", 
            (req,res,params) => {
                expect(params).toEqual({
                    dynamic : "dynamic",
                    two : "123"
                });
                done();
            }
        );
        anumargak.on("GET", "/example/at/:hour(\\d{2})h:minute(\\d{2})m", 
            (req,res,params) => {
                expect(params).toEqual({
                    hour : "32",
                    minute : "48"
                });
                done();
            }
        );

        var req = {
            method : "GET",
            url : "/this/is/dynamic/with/123rest"
        }

        anumargak.lookup(req) ;

        var req = {
            method : "GET",
            url : "/example/at/32h48m"
        }

        anumargak.lookup(req) ;
        /* expect(anumargak.lookup(req,res) ).toEqual(30);
        expect(anumargak.find("GET","/example/at/32h48m")()).toEqual(50); */
    });

    
    it("should find correct function leaving query paramaters apart", function() {
        var anumargak = Anumargak();

        anumargak.on("GET", "/this/is/:dynamic/with/:pattern(\\d+)", () => 30);

        expect(anumargak.find("GET","/this/is/dynamic/with/123?ignore=me")() ).toEqual(30);
        expect(anumargak.find("GET","/this/is/dynamic/with/123#ignoreme")() ).toEqual(30);
    });

    it("should lookup correct function leaving query paramaters apart", function(done) {
        var anumargak = Anumargak();
        
        anumargak.on("GET", "/this/is/:dynamic/with/:two(\\d+)rest", 
            (req,res,params) => {
                expect(params).toEqual({
                    dynamic : "dynamic",
                    two : "123"
                });
                done();
            }
        );
        
        var req = {
            method : "GET",
            url : "/this/is/dynamic/with/123rest?ignore=me"
        }
        
        anumargak.lookup(req) ;
        
        var req = {
            method : "GET",
            url : "/this/is/dynamic/with/123rest#ignoreme"
        }
        
        anumargak.lookup(req) ;
    });

    it("should support similar route path with different parameter", function() {
        var anumargak = Anumargak();

        anumargak.on("GET", "/this/is/:dynamic/with/:pattern(\\d+)", () => 30);
        anumargak.on("GET", "/this/is/:dynamic/with/:pattern([a-z]+)", () => 50);

        expect(anumargak.find("GET","/this/is/dynamic/with/123")() ).toEqual(30);
        expect(anumargak.find("GET","/this/is/dynamic/with/string")() ).toEqual(50);
    });

    /* it("should support wild card ", function(done) {
        var anumargak = Anumargak();
        
        anumargak.on("GET", "/this/is/:dynamic/with/ * /anything/here?ignore=me", 
            (req,res,params) => {
                expect(params).toEqual({
                    dynamic : "dynamic",
                    "*" : "string"
                });
                done();
        });
        anumargak.lookup({
            url: "/this/is/dynamic/with/string",
            method : "GET"
        });
    });  */

    it("should set multiple methos is an array is passed", function() {
        var anumargak = Anumargak();

        anumargak.on(["GET", "HEAD"], "/this/is/:dynamic/with/:pattern(\\d+)", () => 30);

        expect(anumargak.find("GET","/this/is/dynamic/with/123")() ).toEqual(30);
        expect(anumargak.find("HEAD","/this/is/dynamic/with/123")() ).toEqual(30);
    });

    it("should throw error on invalid argument type", function() {
        var anumargak = Anumargak();

        expect(() => {
            anumargak.on({ method: "GET"}, "/this/is/:dynamic/with/:pattern(\\d+)", () => {});
        }).toThrowError("Invalid method argument. String or array is expected.");
    });

    it("should throw error on invalid method type", function() {
        var anumargak = Anumargak();

        expect(() => {
            anumargak.on("OTHER", "/this/is/:dynamic/with/:pattern(\\d+)", () => {});
        }).toThrowError("Invalid method type OTHER");
    });

    it("should find default function when no rout matches", function() {
        var anumargak = Anumargak({
            defaultRoute : () => 50
        });

        anumargak.on("GET", "/this/is/:dynamic/with/:pattern(\\d+)", () => {});
        
        expect(anumargak.find("GET", "/this/is/not/registered")()).toEqual(50);

    });

    it("should look up default function when no rout matches", function(done) {
        var anumargak = Anumargak({
            defaultRoute : (req,res) => {
                done();
            }
        });

        anumargak.on("GET", "/this/is/:dynamic/with/:pattern(\\d+)", () => {});
        
        anumargak.lookup({
            method : "GET", 
            url: "/this/is/not/registered"
        });

    });

});