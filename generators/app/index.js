'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const rename = require('gulp-rename');
const beautify = require('gulp-beautify');

module.exports = class extends Generator {
    writing() {
        this.registerTransformStream(rename(path => {
            if (path.extname == '.ejs')
                path.extname = '.js';
        }));
        this.registerTransformStream(beautify({ indent_size: 2 }));
        this.fs.copyTpl(
            this.templatePath('./app/**/*'),
            this.destinationPath('./generatedcode'),
            this._initOptions.app
        );

        this._initOptions.app.server.routes.forEach(function (route) {
            this.fs.copyTpl(
                this.templatePath('./includes/route.ejs'),
                this.destinationPath(`./generatedcode/routes/${route.name}.js`),
                { route: route });
        }, this);

        if(this._initOptions.app.database){
            this._initOptions.app.database.models.forEach(function (model) {
                this.fs.copyTpl(
                    this.templatePath('./includes/model.ejs'),
                    this.destinationPath(`./generatedcode/models/${model.name}.js`),
                    { model: model });
            }, this);
        }
    }

    installingDependencies() {
        if(this._initOptions.app.server)
            this.npmInstall(['hapi'], { 'save': true });
        if(this._initOptions.app.database)
            this.npmInstall(['mongoose'], { 'save': true });
    }

    install() {
        //this.installDependencies();
    }
};


var obj = {
    server: {
        port: 3000,
        host: "localhost",
        routes: [
            {
                name: "musics",
                urls: [
                    {
                        name: "get",
                        path: "/musics/{id}",
                        method: "GET",
                        calls: [
                            {
                                code: "Music.findById",
                                type: "model",
                                parameters: [ "req.params.id" ]
                            },
                            {
                                inputs: [ "m" ],
                                code: "changeModel",
                                type: "function",
                                parameters: [ "m" ]
                            }
                        ]
                    },
                    {
                        name: "getAll",
                        path: "/musics",
                        method: "GET",
                        calls: [
                            {
                                code: "Music.find",
                                type: "model",
                                parameters: [ ]
                            }
                        ]
                    },
                    {
                        name: "post",
                        path: "/musics",
                        method: "POST"
                    }
                ],
                imports: [
                    {
                        type: "model",
                        name: "music",
                        entity: "Music"
                    }
                ],
                declarations: [
                    {
                        type: "function",
                        name: "changeModel",
                        parameters: [ "music" ],
                        code: "music.title = 'musicedited'; return Promise.resolve(music);"
                    }
                ]

            }
        ]
    },
    database: {
        name: "mydb",
        models: [
            {
                name: "music",
                entity: "Music",
                schema: {
                    title: { type: "String" },
                    artist: { type: "String" },
                    album: { type: "String" }
                }
            }
        ]
    }
}

