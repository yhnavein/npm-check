'use strict';

const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');

function install(packages, currentState) {
    if (!packages.length) {
        return Promise.resolve(currentState);
    }

    const installer = currentState.get('installer');
    const installGlobal = currentState.get('global') ? ['global'] : [];
    const saveExact = currentState.get('saveExact') ? '--exact' : null;

    const yarnArgs = installGlobal
        .concat('add')
        .concat(saveExact)
        .concat(packages)
        .filter(Boolean);

    console.log('');
    console.log(`$ ${chalk.green(installer)} ${chalk.green(yarnArgs.join(' '))}`);
    const spinner = ora(`Installing using ${chalk.green(installer)}...`);
    spinner.enabled = spinner.enabled && currentState.get('spinner');
    spinner.start();

    return execa(installer, yarnArgs, {cwd: currentState.get('cwd')}).then(output => {
        spinner.stop();
        console.log(output.stdout);
        console.log(output.stderr);

        return currentState;
    }).catch(err => {
        spinner.stop();
        throw err;
    });
}

module.exports = install;
