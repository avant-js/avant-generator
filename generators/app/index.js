'use strict';
const Generator = require('yeoman-generator');
const rename = require('gulp-rename');
const beautify = require('gulp-beautify');
const filter = require('gulp-filter');
const beautifyOptions = { indent_size: 2 };

module.exports = class extends Generator {
    writing() {

        this.registerTransformStream(rename(path => {
            if (path.extname === '.ejs') {
                path.extname = '.js';
            }
        }));

        var ejsFilter = filter(['**/*.js', '**/*.json'], { restore: true });

        this.registerTransformStream([
            ejsFilter,
            beautify(beautifyOptions),
            ejsFilter.restore
        ]);

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

        if (this._initOptions.app.database) {
            this._initOptions.app.database.models.forEach(function (model) {
                this.fs.copyTpl(
                    this.templatePath('./includes/model.ejs'),
                    this.destinationPath(`./generatedcode/models/${model.name}.js`),
                    { model: model });
            }, this);
        }

        if (this._initOptions.app.server.swagger) {
            this.fs.copy(
                this.templatePath('./public/**/*'),
                this.destinationPath('./generatedcode/public')
            );

            this.fs.copyTpl(
                this.templatePath('./includes/swagger.ejs'),
                this.destinationPath('./generatedcode/public/docs/swagger.json'),
                { swagger: this._initOptions.app.server.swagger });
        }

        this.fs.copyTpl(
            this.templatePath('./app/.eslint*'),
            this.destinationPath('./generatedcode'),
            this._initOptions.app
        );
    }

    installingDependencies() {
        if (this._initOptions.app.server) {
            this.npmInstall(['hapi'], { save: true });
        }
        if (this._initOptions.app.database) {
            this.npmInstall(['mongoose'], { save: true });
        }
        this.npmInstall(['eslint'], { 'save-dev': true });
        this.npmInstall(['mocha'], { 'save-dev': true });
        this.npmInstall(['chai'], { 'save-dev': true });
    }

    install() {
        this.installDependencies({
            npm: true
        });
    }
};
