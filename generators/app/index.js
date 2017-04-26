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

    installingHapi() {
        this.npmInstall(['hapi'], { 'save': true });
    }

    installingMongoose() {
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
                        path: "/hello/{id}",
                        method: "GET",
                        calls: [
                        ]
                    },
                    {
                        name: "getAll",
                        path: "/hello",
                        method: "GET"
                    },
                    {
                        name: "post",
                        path: "/hello",
                        method: "POST"
                    }
                ],
                models: [
                    {
                        name: "music",
                        entity: "Music"
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

