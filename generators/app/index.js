'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const rename = require('gulp-rename');
const beautify = require('gulp-beautify');

module.exports = class extends Generator {
    prompting() {
        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the exquisite ' + chalk.red('generator-avantjs') + ' generator!'
        ));

        const prompts = [{
            type: 'confirm',
            name: 'someAnswer',
            message: 'Would you like to enable this option?',
            default: true
        }];

        return this.prompt(prompts).then(props => {
            // To access props later use this.props.someAnswer;
            this.props = props;
        });
    }

    writing() {

        this.registerTransformStream(rename(path => {
            if (path.extname == '.ejs')
                path.extname = '.js';
        }));
        this.registerTransformStream(beautify({ indent_size: 2 }));
        this.fs.copyTpl(
            this.templatePath('./app/**/*'),
            this.destinationPath(),
            {
                server: {
                    port: 3000,
                    host: 'localhost',
                    routes: [
                        {
                            name: 'musics'
                        }
                    ]
                },
                database: {
                    name: 'mydb'
                }
            }

        );

        obj.server.routes.forEach(function (route) {
            this.fs.copyTpl(
                this.templatePath('./includes/route.ejs'),
                this.destinationPath(`./routes/${route.name}.js`),
                { route: route });
        }, this);

        obj.database.models.forEach(function (model) {
            this.fs.copyTpl(
                this.templatePath('./includes/model.ejs'),
                this.destinationPath(`./models/${model.name}.js`),
                { model: model });
        }, this);
    }

    installingDependencies() {
        if(obj.server)
            this.npmInstall(['hapi'], { 'save': true });
        if(obj.database)
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
                                inputs: [ "m", "err" ],
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

