import simpleGit from "simple-git";
import chalk from 'chalk';

const git = simpleGit();

export async function Clone(repoUrl: string) {
    try {
        console.log(`Cloning repository from ${repoUrl} into the current directory...`);
        await git.clone(repoUrl);
        console.log('Successfully cloned the repository into the current directory');
    } catch (error) {
        console.error('Error cloning the repository:', (error as Error).message);
    }
}

export const Branch = {
    command: 'branch [branchName]',
    description: 'Create, delete, or list Git branches',
    options: [
        { flag: '-d, --delete', description: 'Delete a branch' },
        { flag: '-b, --branch', description: 'Create a new branch' },
        { flag: '-g --git', description: 'use git'},
    ],
    action: async (branchName: string, options: { delete?: boolean; branch?: boolean, git?: boolean}) => {
        // console.log('Debug: branchName:', branchName);
        // console.log('Debug: options:', options);
        try {
            if(!options.git){
                throw new Error('Please provide a git flag with -g or --git');
            }

            const isRepo = await git.checkIsRepo();
            if (!isRepo) {
                throw new Error('The current directory is not a Git repository.');
            }

            if (options.delete) {
                if (!branchName) {
                    throw new Error('Branch name is required for deletion.');
                }
                console.log(`Deleting branch: ${branchName}...`);
                await git.branch(['-d', branchName]);
                console.log(`Branch ${branchName} deleted successfully.`);
            } else if (options.branch) {
                if (!branchName) {
                    throw new Error('Branch name is required for creation.');
                }
                console.log(`Creating branch: ${branchName}...`);
                await git.branch([branchName]);
                console.log(`Branch ${branchName} created successfully.`);
            } else {
                console.log('Listing all branches:');
                const branches = await git.branch();
                // console.log('Debug: branches:', branches);

                if (!branches || !branches.branches) {
                    throw new Error('Failed to retrieve branch information.');
                }

                const branchList = Object.keys(branches.branches).filter(
                    (key) => !key.startsWith('remotes/') 
                );
                console.log(`Current branch: ${branches.current}`);
                console.log('Local branches:\n' + branchList.join('\n'));
            }
        } catch (error) {
            console.error('Error managing branches:', (error as Error).message);
        }
    }
};

export async function Push() {
    try {
        console.log('Pushing changes to the remote repository...');
        await git.push();
        console.log('Changes pushed successfully.');
    } catch (error) {
        console.error('Error pushing changes:', (error as Error).message);
    }
}

export async function Pull() {
    try {
        console.log('Pulling changes from the remote repository...');
        await git.pull();
        console.log('Changes pulled successfully.');
    } catch (error) {
        console.error('Error pulling changes:', (error as Error).message);
    }
}

export async function Log() {
    try {
        console.log(chalk.bold.blue('Fetching commit history...'));
        const log = await git.log();
        log.all.forEach((commit) => {
            console.log(
                chalk.green(`Commit: ${chalk.bold((commit.hash).substring(0, 7))}`) +
                    chalk.yellow(` - ${commit.message}`)
            );
        });
    } catch (error) {
        console.error(chalk.bold.red('Error fetching commit history:'), (error as Error).message);
    }
}

export async function Status() {
    try {
        const isRepo = await git.checkIsRepo();
        if (!isRepo) {
            throw new Error('The current directory is not a Git repository.');
        }

        const status = await git.status();
        console.log(chalk.bold.blue('Repository status:'));
        console.log(chalk.green(`On branch ${status.current}`));

        if (status.ahead > 0) {
            console.log(chalk.yellow(`Your branch is ahead of 'origin/${status.current}' by ${status.ahead} commit(s).`));
        }
        if (status.behind > 0) {
            console.log(chalk.yellow(`Your branch is behind 'origin/${status.current}' by ${status.behind} commit(s).`));
        }

        if (status.modified.length > 0) {
            console.log(chalk.bold('\nChanges not staged for commit:'));
            status.modified.forEach((file) => console.log(chalk.red(`\tmodified: ${file}`)));
        }
        if (status.not_added.length > 0) {
            console.log(chalk.bold('\nUntracked files:'));
            status.not_added.forEach((file) => console.log(chalk.gray(`\t${file}`)));
        }
        if (status.created.length > 0) {
            console.log(chalk.bold('\nNew files:'));
            status.created.forEach((file) => console.log(chalk.green(`\t${file}`)));
        }
        if (status.deleted.length > 0) {
            console.log(chalk.bold('\nDeleted files:'));
            status.deleted.forEach((file) => console.log(chalk.red(`\t${file}`)));
        }
        if (status.staged.length > 0) {
            console.log(chalk.bold('\nChanges to be committed:'));
            status.staged.forEach((file) => console.log(chalk.green(`\t${file}`)));
        }

        if (
            status.modified.length === 0 &&
            status.not_added.length === 0 &&
            status.created.length === 0 &&
            status.deleted.length === 0 &&
            status.staged.length === 0
        ) {
            console.log(chalk.bold.green('\nWorking directory is clean.'));
        }
    } catch (error) {
        console.error(chalk.bold.red('Error retrieving repository status:'), (error as Error).message);
    }
}